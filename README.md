# The Price of Prestige

**CMPT 376W · Group 15 · Twine ethical case study**  
Kazi Boni Amin — programming/art; Krrish Setia — main writer; Andy Wang — editing/secondary writing.

[Play online](https://marchosias405.github.io/CMPT376W-The-Price-of-Prestige/) · [ACM source case](https://www.acm.org/code-of-ethics/case-studies/abusive-workplace-behavior)

[AI context for teammates](#ai-context-for-teammates) · [Remaining work](#finish-before-submission)

## Files and folders

```text
.github/workflows/deploy.yml       Checks exported HTML and deploys to GitHub Pages
.gitignore                        Excludes temporary/generated development files
README.md                         This project guide
01_Design/
  G15_Initial_Design_and_Build_Plan.pdf   Original proposed design
work/Group15_Review_Project/
  README.md                       Older package overview
  submission/
    Group15_Twine_Story.html       Playable, self-contained game; submission file
    Group15_Design_Document.pdf    Generated design document; still a review draft
  source/
    story.twee                    EDIT: story, choices, state and endings
    style.css                     EDIT: colours, typography and layout
    design_content.json           EDIT: scenario, characters, dilemmas and goals
    team_contributions.csv        EDIT: actual contributions per design section
    perspective_notes.json        EDIT: each member's perspective and example
    build.mjs                     Generates game HTML, graph and runtime metadata
    generate_pdf.py               Generates design PDF and flow diagrams
    graph.json                    Generated passage/link map
    diagrams/
      proposed_flow.svg           Proposed branching diagram
      final_flow_A.svg            Final flow: first response and technical work
      final_flow_B.svg            Final flow: credit, consent and options
      final_flow_C.svg            Final flow: responses, endings and restart
      final_flow.mmd              Generated Mermaid version of final flow
    static_test.py                Structural/link/reachability checks
    browser_test.cjs               Browser routes, state, restart and layout tests
    keyboard_test.cjs              Keyboard navigation tests
    colour_test.cjs                Choice/ending colour tests
    package.py                    Creates review ZIP and file-hash manifest
    BUILD.md                      Build instructions and test dependencies
    vendor/
      harlowe-3.3.9.js             Bundled story runtime; keep this
      runtime-metadata.json       Runtime version, provenance and hash
      LICENSES.md                 Runtime licensing notes
      es6-shim-LICENSE.txt         Dependency licence
      jquery-LICENSE.txt           Dependency licence
  review/
    TEAM_INPUT_NEEDED.md           Missing team facts
    RUBRIC_CHECK.md                Earlier implementation-to-rubric checklist
    TEST_REPORT.md                 Recorded test results and limitations
    ROUTE_CHECKLIST.csv            Recorded route-by-route results
```

Edit the source files, then rebuild. Do not edit only the generated HTML/PDF. Diagram layout and some PDF text also live in `generate_pdf.py`.

## Rubric status — 50 marks

**Updated: 23 October 2026.** Source/build assessment uses commit `2585012` and recorded tests. Kazi’s subsequent screenshots verify the hosted intro and successful access to the correct ACM case page. Contribution inputs remain incomplete. “Implemented” is not an awarded mark; this README update is not a fresh full-game test or PDF visual audit.

### Twine story — /25

Evidence: [story source](work/Group15_Review_Project/source/story.twee), [rubric review](work/Group15_Review_Project/review/RUBRIC_CHECK.md), [test report](work/Group15_Review_Project/review/TEST_REPORT.md).

| Criterion | Marks | Current status / remaining check |
|---|---:|---|
| Intro | 0; −2 if incomplete | **Complete — manually verified:** title, correct working ACM case link, and all three names/roles are visible on the hosted intro. No intro change needed. |
| Spelling and grammar | 2 | Automated-review proofreading recorded; teammate proofreading remains. |
| Playability | 3 | Five endings/restart implemented; report records 150 exhaustive routes passing. Team playthrough remains. |
| Originality | 2 | Implemented: Eli/Priya, consent, documentation, reporting and new outcomes. |
| Realistic choices | 3 | Implemented: uncertain reviews, transfer and peer improvement; no automatic promotion or lawsuit win. |
| Multiple perspectives | 5 | Implemented: five characters, remembered choices and different consequences. |
| Consistent implementation | 5 | Implemented: abuse, unfair credit and leadership responsibility remain central. |
| Visual appeal | 5 | Custom styling and responsive/keyboard checks recorded; hosted intro visually confirmed. Human review of other passages and mobile layout remains. |

### Design document — /25

Evidence: [design content](work/Group15_Review_Project/source/design_content.json), [PDF generator](work/Group15_Review_Project/source/generate_pdf.py), [team inputs](work/Group15_Review_Project/review/TEAM_INPUT_NEEDED.md).

| Criterion | Marks | Current status / remaining work |
|---|---:|---|
| ACM case identified | 0; required | Included with canonical link. |
| Team name and members | 0; required | Group 15, names and roles included. |
| Scenario description | 2 | Story/characters included; add an explicit lesson-goal sentence to match the rubric fully. |
| Characters | 3 | Five described; four non-player characters interact meaningfully with Diane. |
| Ethical dilemmas | 8 | Four bulleted dilemmas with choices and rationales included. |
| Lesson goals | 5 | Four goals connected to dilemmas/outcomes included. |
| Proposed/final story flow | 4 | Proposed diagram plus three annotated final diagrams included in generation code/report. |
| Team contributions | 3 | **Incomplete:** five percentage rows are blank; all three perspective entries are unconfirmed. |

### Marks at risk

**Contributions: up to 3 marks at risk** if left incomplete; the rubric allows partial credit, so an exact deduction cannot be predicted. **Scenario description: its 2-mark criterion is also at risk of partial loss** because learning goals are not explicit in that paragraph. Together these affect criteria worth **5/50**, not an automatic five-mark deduction.

Missing perspective ownership is also an assignment requirement, but no separate fixed deduction is stated. Human proofreading/playtesting is unfinished verification, not an automatic penalty: actual defects could cost marks in the corresponding story rows. **The hosted intro is verified complete; no missing-item penalty is indicated.** Preserve its title, case link and team credits in the final submitted HTML; removing any required item would trigger **−2**.

## Finish before submission

1. Fill `team_contributions.csv` with real percentages: every section must total **100%**. Fill `perspective_notes.json` with each member's actual perspective, passage/example and confirmation. Do not invent contributions.
2. Add a sentence to `design_content.json`'s scenario stating what players should learn: distinguish abuse from constructive criticism and assess fair credit, self-protection and accountability.
3. Rebuild, then inspect the PDF: no pending contribution entries or review-draft label; diagrams readable. Play all five endings, restart, proofread and test the live site. Confirm the same intro title, case link and team credits in the final local HTML you will submit.
4. Submit **both files in `submission/`** through the course submission system. The website does not replace the required HTML/PDF upload.

## Rebuild and publish updates

From the repository root, with Node.js and Python installed:

```powershell
python -m pip install reportlab pypdf
node work/Group15_Review_Project/source/build.mjs
python work/Group15_Review_Project/source/generate_pdf.py
python work/Group15_Review_Project/source/static_test.py
```

See [BUILD.md](work/Group15_Review_Project/source/BUILD.md) for browser-test setup. Review changed files, commit the intended source and generated outputs, then push to `main`.

**CI/CD:** `deploy.yml` checks that the exported game is nonempty and contains Twine story data, then publishes it as `index.html`. It does **not** compile sources, regenerate the PDF or run the full tests. Rebuild before pushing. Hosting earns no separate marks in the supplied rubric.

## AI context for teammates

**Give your LLM this README plus repository access or the relevant source files.** A README or live-game link alone does not give it the editable project. Continue this implementation rather than creating a new game.

### Read first and locate your task

The project is a **Harlowe 3.3.9** choose-your-own-adventure game for **CMPT 376W, Group 15**. Required deliverables are the self-contained HTML and matching design PDF; the website is supplementary. The rubric above totals **50 marks**.

Read `source/BUILD.md` and `review/TEAM_INPUT_NEEDED.md`, then the files relevant to the assigned task. These short paths are relative to **`work/Group15_Review_Project/`**; `.github/` and this README are at the repository root. The current source and instructor’s latest rubric take precedence over historical summaries.

| Task | Files to read/edit |
|---|---|
| Dialogue, decisions, endings | `source/story.twee` — canonical narrative and Harlowe logic. |
| Appearance | `source/style.css` plus the markup in `source/story.twee`. |
| Design document | `source/design_content.json` and `source/generate_pdf.py` — generator also contains prose and layout. |
| Contribution table/ownership | `source/team_contributions.csv` and `source/perspective_notes.json`. |
| Final flow diagrams | Current story and generated `source/graph.json`; change diagram layout in `source/generate_pdf.py`, then regenerate SVG/Mermaid files. |
| Tests/deployment | Relevant test scripts, `review/TEST_REPORT.md`, `review/ROUTE_CHECKLIST.csv`, and root `.github/workflows/deploy.yml`. |

Some older reports reference removed `reference_packet/` files or generated review JSON. Do not assume those files remain present, claim to have inspected them, or restore Codex handoff clutter without a reason.

### Story and logic to preserve

**Characters:** Diane is the new graduate/player; Max is the abusive AR lead; Jean protects him; Eli is the coworker concerned about credit and retaliation; Priya explains HR options without guaranteeing results. Four decision stages cover the first outburst, a technical defect, unfair research credit, and the longer-term response.

**Endings:** E1 — accountability begins; E2 — review unresolved; E3 — a safer exit; E4 — local progress; E5 — success with a cost. Each has consequences and an ethical reflection, not a moral score or a perfect solution.

**State:** `Intro` initializes `$first`, `$documented`, `$repair`, `$credit`, `$challenged`, `$supported`, `$consent`, and `$exitAccount`. On the formal-report route, E1 requires `($documented and $challenged) or $consent`; otherwise the report leads to E2. Supporting Eli alone does not grant consent: Pair → Support → accepting his scoped permission sets `$consent`. Every ending uses `(restart:)`. These rules are fictional narrative logic, not predictions about real HR processes.

Preserve meaningful consent, fair credit, responsibility for abuse, and continuity after branches merge. Reporting a defect does not make Diane responsible for Max’s abuse. Do not reintroduce Ada, guaranteed lawsuit winnings, instant promotion to lead, or team collapse for declining a promotion. Change the story structure only when requested, then synchronize the document, diagrams and tests.

### Priorities and working rules

1. **Complete the real team inputs.** Five rows × three members = 15 percentages; each row totals 100. Each member needs an actual perspective contribution and passage/example. Set `confirmed` only after human confirmation. Roles and AI suggestions are not evidence of authorship. The PDF generator removes the review-draft status when the required inputs are complete; do not hide it manually.
2. **Add the scenario’s explicit learning-goal sentence**, then regenerate the PDF. Keep the scenario to one or two paragraphs. Preserve the genuine initial design and proposed flow rather than rewriting history to match the final version.
3. **Edit sources, then rebuild.** Use the commands above. Keep the existing compiler, Harlowe runtime, IFID and licence notices. No new framework is needed. Twine-editor changes must be reconciled into canonical sources before rebuilding; editing only exported HTML/PDF will lose changes on the next build.
4. **Verify affected work.** Run build/static checks and relevant browser/keyboard/colour tests using `BUILD.md`. Inspect the regenerated PDF after document changes. Recorded test passes apply to the earlier build, not automatically to new edits. The hosted intro and ACM destination are verified; remaining gameplay and final local exports still need human review.
5. **Protect teammates’ changes.** Inspect Git status/diffs first and use a task branch for collaboration. Do not discard local work, force-push, delete the backup branch, or edit unrelated files. Do not commit, push, merge, publish or submit without an explicit request. A push to `main` deploys the exported HTML but does not rebuild sources or run the full test suite.
6. **Report honestly.** List changed paths, checks actually run, failures/unperformed checks and remaining human decisions. Do not invent contribution figures, perspective ownership, approvals, tests or grades. Keep AI assistance transparent and follow the course’s actual policy.

### Copy-paste teammate prompt

```text
Read the repository’s root README.md, especially “AI context for teammates,”
then work/Group15_Review_Project/source/BUILD.md and the actual files needed
for my task. Continue the existing Harlowe project rather than replacing it.

My task: [describe the specific change or review].

Make only the requested changes. Preserve teammates’ work and the existing
state/consent logic. Edit canonical sources, regenerate affected outputs,
and run relevant checks. Do not invent contributions, authorship, test results
or grades. Do not commit, push, publish or submit unless I explicitly ask.
Finish with changed paths, tests actually run and remaining human decisions.
If you cannot access the repository, request the specific files you need;
do not pretend to have read or edited them.
```
