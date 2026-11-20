# AGENTS.md: Online-Banking

Online-Banking der Aventa Bank für Privatkunden: Anmeldung, Finanzstatus, Überweisung und die Funktionen rund ums Girokonto.

This repo is specified with KnippQAi. Every change belongs to a story (PK-…) and has its own branch in every repo it touches, starting with `story/<key>`; which one is stated in `read_story`. `main` contains only what is implemented and proven by acceptance tests.

## Connection

KnippQAi is connected as an MCP server. A developer uses a personal token (KnippQAi, user menu „MCP-Zugang“): one connection for every system you may read, with your rights. The tools then take an optional `system`; a story that touches one system needs none.

```
claude mcp add --transport http knippqai https://hominator.hopto.org/api/mcp --header "Authorization: Bearer ${KNIPPQAI_TOKEN}"
```

An unattended agent (CI, bot) uses an agent key of the system „Online-Banking“ instead (in KnippQAi under „Agenten“); it is valid only for this system:

```
claude mcp add --transport http knippqai https://hominator.hopto.org/api/agent/mcp --header "Authorization: Bearer <agent-key>"
```

## Workflow and Definition of Done

The specification lies in this repo under `docs/` (use cases, rules, data model, OpenAPI, screens, `docs/architecture.md`), the Gauge acceptance tests under `acceptance/specs`. Read them in the checkout; `git diff main...<story branch> -- docs acceptance/specs` shows what the story changes. The MCP server gives references and state, not file contents.

The MCP server names its tools in the order of the work when the agent connects: `list_stories`, `checkout_story`, `read_story`, `submit_draft`, `acceptance_tests`, `start_acceptance_tests` or `report_acceptance_tests`, `report_unit_tests`, `open_pull_request`. `read_story` with the story key (e.g. "PK-17") shows the next step and the Definition of Done, computed from the story's state: branch, technical draft, missing steps, rules checked by unit test, the last Development run, open questions and the pull request; and the changed files with element keys and lines. Follow it; this file does not repeat it. `find_spec` locates an element (file, line, scenarios with its tag, open stories), `read_file` reads a file of another system you have not checked out.

The development environment is usually local: the repo ships a script (e.g. `scripts/acceptance_tests.sh`) that builds and starts the service from the working tree and runs `gauge run` against it. If it is missing, create it; the JUnit report comes from the Gauge plugin `xml-report` under `acceptance/reports/xml-report/result.xml`. A local run counts only for the pushed head of the branch without uncommitted changes; report it with `report_acceptance_tests` with commit and report. `start_acceptance_tests` checks the service in the project's development environment, which KnippQAi does not build. If the project has none, that is the test environment with `main`: this only works if the story does not change product code.

After the pull request, review, CI pipeline and merge happen in Git. After the merge, the pipeline deploys the state to the test environment; there KnippQAi runs the acceptance tests (Acceptance stage) and the reviewer accepts. A story returned to development has its branch at `main` again, and `read_story` names the reason.

## Rules

- `docs/` is authoritative. Change nothing there: no use cases, rules, entities, no OpenAPI, no screens, no story file under `docs/stories/`, also not `docs/architecture.md`, `docs/adr/` and `docs/leitplanken.md`. If you must make a technical decision that `docs/architecture.md` and `docs/adr/` do not answer (new library, new pattern, different format), make it and report it with `give_feedback` (kind technik); the technical role records it as a decision. If the specification does not fit and you cannot continue without a decision, ask a clarifying question with `ask_question`. If you have already solved it sensibly in the code (wrong value, missing case, neighboring system behaves differently), give feedback with `give_feedback` and keep working: it blocks nothing while you build, and the business side decides it at the latest at acceptance.
- Screens under `docs/ui` are wireframes: they fix content and names (labels, buttons, columns), not layout or look. Build one coherent application that works on a phone, every function in the navigation; keep the names exactly.
- Write everything people read in KnippQAi (questions, options, feedback, draft) in German.
- Do not change the scenarios under `acceptance/specs/`. Only implement missing steps.
- KnippQAi assigns IDs (UC-…, BR-…, NFR-…). Reference them in code and unit tests, e.g. with `@UseCase("UC-003")`, when a criterion is checked as a unit or load test.
- Commit messages start with the story key: `PK-17: Teilausführung storniert den Rest`.
- Work only on the story branch, never on `main`.
- A platform run checks the service running in its environment: in Development it must have the branch's state, in Acceptance that of `main` after the deploy. `KNIPPQ_ACCEPTED_COMMITS` (comma-separated) lists the commits the service may be built from: from the last commit that changes code (not `docs/`, `acceptance/` or Markdown like this file). In the acceptance tests, add a BeforeSuite hook that reads the service's build commit (e.g. `GET /api/version`) and aborts the run with a clear message („Testumgebung läuft mit <commit>, erwartet einer von …; Testumgebung neu bauen“) if it matches none of these commits. Without the variable (local run) the hook does not check.
- If the system calls another system via REST, that system's contract is copied under `docs/api/extern/<provider>.openapi.yaml`: only the operations used, verbatim from the provider, origin in `info.x-provider`. Build the call exactly against this copy, with the base URL from an environment variable. In the acceptance tests a test double plays the provider. The service must also reach it in a platform run, where steps and service run in different containers: a server in the step process is not enough. The steps set the double's responses (including no response and 404) before the call, and `POST /api/test/reset` clears them. If the copy names authentication (`security`, 401), the call authenticates as the specification describes, and the double requires the same authentication and answers 401 without it, like the original.
- KnippQAi commits to the story branch itself: your draft, every incorporated answer and every accepted finding. `read_story` names where the branch stands. If that is newer than your checkout, `git pull` before you go on or report; `read_story` with since and your commit lists what changed in the specification, `read_replies` the answers and decisions.
- If the business side amends the specification after Ready, `read_story` shows it at the top ("Specification amended after Ready" with reason, commit and affected elements). Pull the branch again and align code and steps with it.

## This repo

- Local Development stage: `scripts/akzeptanztests.sh [specs/<file>.spec]`. It prints only the summary and the failed steps; the full Gauge output is in `acceptance/reports/gauge.log`, read it only for a failure.
- Unit tests: `npm test`; build: `npm run build`.
