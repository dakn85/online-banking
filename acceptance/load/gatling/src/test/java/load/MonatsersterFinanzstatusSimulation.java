package load;

import static io.gatling.javaapi.core.CoreDsl.*;
import static io.gatling.javaapi.http.HttpDsl.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.gatling.javaapi.core.*;
import io.gatling.javaapi.http.*;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * Monatserster Finanzstatus: 200 Kundinnen melden sich an und sehen ihren Finanzstatus
 * und ihre Umsätze. Ablauf und Lastmodell kommen aus dem Steckbrief
 * load/monatserster-finanzstatus.load.yaml.
 *
 * Sign-in: POST /api/anmeldung legt das Cookie aventa_sitzung an; jeder virtuelle Nutzer
 * meldet sich einmal an und bleibt über seine ganze Lebensdauer angemeldet (Gatling hält
 * die Cookies pro Nutzer). Kennungen lasttest-001 bis lasttest-200, PIN aus LASTTEST_PIN.
 * Der Reset der Lastdaten läuft einmal im Setup (kein gemessener Request).
 */
public class MonatsersterFinanzstatusSimulation extends Simulation {

    private static final String BASE_URL = System.getenv("BANKING_URL");
    private static final String PIN = System.getenv("LASTTEST_PIN");

    private static final int NUTZER = 200;
    private static final Duration ANSTIEG = Duration.ofSeconds(30);
    private static final Duration HALTEN = Duration.ofSeconds(120);
    private static final Duration ABBAU = Duration.ofSeconds(30);
    private static final Duration NUTZER_LEBENSDAUER = Duration.ofSeconds(120);
    private static final int P95_MS = 500;
    private static final double MAX_FEHLER_PROZENT = 0.5;

    private static final ObjectMapper MAPPER = new ObjectMapper();

    /** Einmal im Setup: Lastdaten zurücksetzen (nur Testbetrieb, ohne Anmeldung). */
    @Override
    public void before() {
        if (BASE_URL == null || BASE_URL.isBlank()) {
            throw new IllegalStateException("BANKING_URL ist nicht gesetzt.");
        }
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest anfrage = HttpRequest.newBuilder(URI.create(BASE_URL + "/api/test/lasttest/reset"))
                    .POST(HttpRequest.BodyPublishers.noBody())
                    .build();
            HttpResponse<Void> antwort = client.send(anfrage, HttpResponse.BodyHandlers.discarding());
            if (antwort.statusCode() != 204) {
                throw new IllegalStateException(
                        "Lastdaten-Reset antwortete mit " + antwort.statusCode() + " statt 204 (TEST_MODE=1?).");
            }
        } catch (java.io.IOException | InterruptedException e) {
            throw new IllegalStateException("Lastdaten-Reset fehlgeschlagen: " + e.getMessage(), e);
        }
    }

    /** IBAN des ersten Girokontos aus der Kontenliste; nur dort gibt es Umsätze. */
    private static String ersteGiroIban(String body) {
        try {
            JsonNode root = MAPPER.readTree(body);
            for (JsonNode konto : root.path("konten")) {
                if ("Girokonto".equals(konto.path("art").asText())) {
                    return konto.path("iban").asText();
                }
            }
        } catch (Exception e) {
            throw new IllegalStateException("Kontenliste nicht lesbar: " + e.getMessage(), e);
        }
        throw new IllegalStateException("Kein Girokonto in der Kontenliste.");
    }

    /** Feeder mit den 200 Lastkennungen, zyklisch. */
    private static FeederBuilder<Object> kundenFeeder() {
        List<Map<String, Object>> kunden = new ArrayList<>();
        for (int i = 1; i <= NUTZER; i++) {
            kunden.add(Map.of("kennung", String.format("lasttest-%03d", i)));
        }
        return listFeeder(kunden).circular();
    }

    private final HttpProtocolBuilder httpProtocol = http
            .baseUrl(BASE_URL)
            .disableCaching()
            .acceptHeader("application/json");

    private final ScenarioBuilder szenario = scenario("Monatserster Finanzstatus")
            .feed(kundenFeeder())
            .exec(session -> session.set("pin", PIN))
            // Einmal anmelden, Sitzung bleibt für die ganze Nutzerlebensdauer bestehen.
            .exec(http("Anmeldung")
                    .post("/api/anmeldung")
                    .header("Content-Type", "application/json")
                    .body(StringBody("{\"kennung\":\"#{kennung}\",\"pin\":\"#{pin}\"}"))
                    .check(status().is(200))
                    .check(jsonPath("$.name").exists()))
            // Finanzstatus einmal abrufen und die Girokonto-IBAN für die Umsätze merken.
            .exec(http("Finanzstatus")
                    .get("/api/konten")
                    .check(status().is(200))
                    .check(bodyString().saveAs("kontenBody")))
            .exec(session -> session.set("iban", ersteGiroIban(session.getString("kontenBody"))))
            .during(NUTZER_LEBENSDAUER).on(
                    // Finanzstatus und Umsätze ansehen, mit 1–2 s Denkzeit dazwischen.
                    exec(http("Finanzstatus")
                            .get("/api/konten")
                            .check(status().is(200)))
                    .pause(Duration.ofSeconds(1), Duration.ofSeconds(2))
                    .exec(http("Umsaetze")
                            .get("/api/konten/#{iban}/umsaetze")
                            .check(status().is(200))
                            .check(jsonPath("$.gesamt").exists()))
                    .pause(Duration.ofSeconds(1), Duration.ofSeconds(2)));

    {
        setUp(
                szenario.injectClosed(
                        rampConcurrentUsers(0).to(NUTZER).during(ANSTIEG),
                        constantConcurrentUsers(NUTZER).during(HALTEN),
                        rampConcurrentUsers(NUTZER).to(0).during(ABBAU)))
                .protocols(httpProtocol)
                .maxDuration(Duration.ofSeconds(300))
                .assertions(
                        global().failedRequests().percent().lt(MAX_FEHLER_PROZENT),
                        details("Anmeldung").failedRequests().percent().lt(MAX_FEHLER_PROZENT),
                        details("Finanzstatus").responseTime().percentile(95.0).lt(P95_MS),
                        details("Finanzstatus").failedRequests().percent().lt(MAX_FEHLER_PROZENT),
                        details("Umsaetze").responseTime().percentile(95.0).lt(P95_MS),
                        details("Umsaetze").failedRequests().percent().lt(MAX_FEHLER_PROZENT));
    }
}
