# The Price of Prestige

**CMPT 376W · Group 15 · Twine ethical case study**  
Kazi Boni Amin — programming/art; Krrish Setia — main writer; Andy Wang — editing/secondary writing.

[Play online](https://marchosias405.github.io/CMPT376W-The-Price-of-Prestige/) · [ACM source case](https://www.acm.org/code-of-ethics/case-studies/abusive-workplace-behavior)

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

**Snapshot: 23 October 2026, commit `2585012`.** “Implemented” means content exists, not that marks are guaranteed. Assessment uses source, document-generation code and recorded tests; it is not a fresh browser test or PDF visual audit.

### Twine story — /25

Evidence: [story source](work/Group15_Review_Project/source/story.twee), [rubric review](work/Group15_Review_Project/review/RUBRIC_CHECK.md), [test report](work/Group15_Review_Project/review/TEST_REPORT.md).

| Criterion | Marks | Current status / remaining check |
|---|---:|---|
| Intro | 0; −2 if incomplete | Implemented: title, ACM link, all names/roles. Check the external link manually. |
| Spelling and grammar | 2 | Automated-review proofreading recorded; teammate proofreading remains. |
| Playability | 3 | Five endings/restart implemented; report records 150 exhaustive routes passing. Team playthrough remains. |
| Originality | 2 | Implemented: Eli/Priya, consent, documentation, reporting and new outcomes. |
| Realistic choices | 3 | Implemented: uncertain reviews, transfer and peer improvement; no automatic promotion or lawsuit win. |
| Multiple perspectives | 5 | Implemented: five characters, remembered choices and different consequences. |
| Consistent implementation | 5 | Implemented: abuse, unfair credit and leadership responsibility remain central. |
| Visual appeal | 5 | Custom styling and responsive/keyboard checks recorded; human desktop/mobile review remains. |

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

Missing perspective ownership is also an assignment requirement, but no separate fixed deduction is stated. Human proofreading/playtesting is unfinished verification, not an automatic penalty: actual defects could cost marks in the corresponding story rows. Missing any intro item would trigger the separate **−2** penalty; the items are currently present.

## Finish before submission

1. Fill `team_contributions.csv` with real percentages: every section must total **100%**. Fill `perspective_notes.json` with each member's actual perspective, passage/example and confirmation. Do not invent contributions.
2. Add a sentence to `design_content.json`'s scenario stating what players should learn: distinguish abuse from constructive criticism and assess fair credit, self-protection and accountability.
3. Rebuild, then inspect the PDF: no pending contribution entries or review-draft label; diagrams readable. Play all five endings, restart, proofread and test the live site.
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
