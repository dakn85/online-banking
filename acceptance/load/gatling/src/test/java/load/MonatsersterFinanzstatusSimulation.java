package load;

import io.gatling.javaapi.core.ChainBuilder;
import io.gatling.javaapi.core.PopulationBuilder;
import io.gatling.javaapi.core.ScenarioBuilder;
import io.gatling.javaapi.core.Simulation;
import io.gatling.javaapi.http.HttpProtocolBuilder;

import java.time.Duration;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

/**
 * Monatserster Finanzstatus: 200 Kundinnen melden sich einmal an und sehen
 * wiederholt ihren Finanzstatus und die Umsaetze des Girokontos.
 *
 * Steckbrief: load/kontext/steckbrief.yaml (200 gleichzeitig, Anstieg in 30 s,
 * 2 min halten, je Anfrage 1-2 s Denkzeit; 95 % <= 500 ms, <= 0,5 % Fehler).
 */
public class MonatsersterFinanzstatusSimulation extends Simulation {

    private static final int KUNDINNEN = 200;
    private static final String IBAN = "[A-Z]{2}[0-9]{2}[0-9A-Z]{18}";

    private final String basisUrl = pflicht("BANKING_URL");
    private final String pin = pflicht("LASTTEST_PIN");

    private static String pflicht(String name) {
        String wert = System.getenv(name);
        if (wert == null || wert.isBlank()) {
            throw new IllegalStateException(
                "Umgebungsvariable " + name + " fehlt; sie wird unter Einstellungen \u2192 Zug\u00e4nge angelegt.");
        }
        return wert;
    }

    private final HttpProtocolBuilder httpProtocol = http
        .baseUrl(basisUrl)
        .acceptHeader("application/json")
        .contentTypeHeader("application/json")
        // Wie ein Browser cached Gatling wiederholte GETs; ohne Abschalten kaeme
        // GET /api/konten als 304 ohne Rumpf zurueck. Fuer den Lasttest unerwuenscht.
        .disableCaching();

    /** Je virtuelle Nutzerin genau ein Lastkunde: lasttest-001 bis lasttest-200 (zirkulaer). */
    private Iterator<Map<String, Object>> nutzer() {
        return Stream.iterate(0, i -> (i + 1) % KUNDINNEN)
            .map(i -> {
                Map<String, Object> zeile = new LinkedHashMap<>();
                zeile.put("kennung", String.format("lasttest-%03d", i + 1));
                zeile.put("pin", pin);
                return zeile;
            })
            .iterator();
    }

    /** Anmeldung einmal je Nutzerin; die Sitzung haelt ueber das Cookie aventa_sitzung. */
    private final ChainBuilder anmelden = exec(
            http("Anmelden")
                .post("/api/anmeldung")
                .body(StringBody("{\"kennung\":\"#{kennung}\",\"pin\":\"#{pin}\"}"))
                .check(
                    status().in(200),
                    jsonPath("$.name").exists()))
        .exitHereIfFailed();

    /** Ein Durchgang: Finanzstatus, dann die Umsaetze des Girokontos, je 1-2 s Denkzeit. */
    private final ChainBuilder durchgang = exec(
            http("Finanzstatus")
                .get("/api/konten")
                .check(
                    status().in(200),
                    jsonPath("$.konten[?(@.art == 'Girokonto')].iban")
                        .transform(gefunden -> {
                            Matcher m = Pattern.compile(IBAN).matcher(gefunden);
                            return m.find() ? m.group() : gefunden;
                        })
                        .saveAs("iban")))
        .pause(1, 2)
        .exec(
            http("Umsaetze")
                .get("/api/konten/#{iban}/umsaetze")
                .check(
                    status().in(200),
                    jsonPath("$.gesamt").exists()))
        .pause(1, 2);

    /** Setup: einmal die Lastkunden auf den Ausgangsstand setzen (je 200 Umsaetze). */
    private final ScenarioBuilder reset = scenario("Lastdaten zuruecksetzen").exec(
        http("Lastreset")
            .post("/api/test/lasttest/reset")
            .check(status().is(204)));

    /** Angemeldet bleiben und lesen, solange die Lastfenster-Strecke laeuft. */
    private final ScenarioBuilder last = scenario("Monatserster Finanzstatus")
        .feed(nutzer())
        .exec(anmelden)
        .during(Duration.ofSeconds(150)).on(durchgang);

    {
        setUp(
            reset.injectOpen(atOnceUsers(1))
                .andThen(last.injectClosed(
                    rampConcurrentUsers(0).to(KUNDINNEN).during(Duration.ofSeconds(30)),
                    constantConcurrentUsers(KUNDINNEN).during(Duration.ofSeconds(120)))))
            .protocols(httpProtocol)
            // Sicherheitsgrenze: Nutzerinnen, die erst gegen Ende des Anstiegs starten,
            // lesen noch bis kurz nach dem Haltefenster; der Lauf endet spaetestens hier.
            .maxDuration(Duration.ofSeconds(200))
            .assertions(
                details("Anmelden").responseTime().percentile(95.0).lt(500),
                details("Finanzstatus").responseTime().percentile(95.0).lt(500),
                details("Umsaetze").responseTime().percentile(95.0).lt(500),
                details("Lastreset").responseTime().percentile(95.0).lt(500),
                details("Anmelden").failedRequests().percent().lt(0.5),
                details("Finanzstatus").failedRequests().percent().lt(0.5),
                details("Umsaetze").failedRequests().percent().lt(0.5),
                details("Lastreset").failedRequests().percent().lt(0.5));
    }
}
