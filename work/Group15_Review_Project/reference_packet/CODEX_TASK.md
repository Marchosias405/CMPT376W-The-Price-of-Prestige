# Build the complete CMPT 376W Group 15 Twine project

## Mission

Act as the implementation, narrative, design-document, and testing assistant for this project. Build the complete project in this workspace so I can review a working game and matching PDF. Do the work, not just a plan or instructions for me to assemble it.

The assignment is G1 - ACM Code of Ethics Case Study (Twine), Group 15. The story is **The Price of Prestige**, adapting ACM's **Abusive Workplace Behavior** case. The user has a maximum 12-hour overall work window; aim to complete the core deliverables well before that. This is an upper bound, not an instruction to wait or spend all 12 hours.

Proceed autonomously on reversible local work and ordinary implementation choices, subject to your environment's instructions and permissions. Read relevant installed skills when available. Use parallel help for independent narrative, technical, or rubric reviews if available. Finish all feasible implementation, testing, and documentation before presenting the review package. Do not pause after every phase for screenshots; that earlier coaching workflow is superseded by this request for a complete build.

Do not publish the game to a public site, submit coursework, contact my teammates, or send messages. Deliver files for my review.

## 1. Read the input packet

Read every supplied reference before implementing:

1. reference/04_assignment_and_rubric.txt - authoritative assignment and grading text.
2. reference/05_revised_build_spec.md - intended revised story and design.
3. reference/G15_Initial_Design_and_Build_Plan.pdf - initial design and proposed flow created before implementation.
4. reference/01_original_story.txt - original outline for context.
5. reference/02_original_design_draft.txt - original design and supplied team roles.
6. reference/03_previous_feedback.txt - historical feedback, some of which is stale.
7. reference/06_team_contributions_template.csv - blank human contribution data.
8. reference/07_official_sources.md - official source and technical documentation links.

Preserve the reference directory unchanged. The first four text references reproduce user-pasted material with normalized formatting; they are not existing Twine exports.

Use the actual assignment as the grading authority. Follow this task and the revised specification for the intended implementation. The original outline and old feedback are historical inputs, not instructions to reintroduce superseded choices. In particular, the old feedback's design-section point values are unverified, and its request to introduce Ada is superseded by consistent use of Jean.

Inspect the workspace before making changes. Create a separate work/ output directory. If unrelated user files or an existing implementation are present, preserve them and reuse appropriate work instead of overwriting it blindly.

## 2. Build a genuine Twine project

This must be a real **Twine 2 story using Harlowe 3.x**, not a generic JavaScript branching page, React application, hosted website, or a mockup.

- Choose a verified compatible Harlowe release, pin its exact version, and use that version consistently.
- Use Twine's supported import/export workflow or a compatible compiler such as Tweego. Inspect available tooling first.
- Maintain editable Twee 3 source, including StoryTitle, StoryData, stable IFID, story format/version, start passage, and useful passage positions/tags.
- Produce genuinely playable Twine HTML with the actual Harlowe runtime and valid story/passage data. Story-data tags without the runtime are insufficient.
- Use a single canonical source. Fix source and rebuild the output; do not patch only the generated HTML.
- Document one reproducible rebuild command, dependencies, exact versions, and any required runtime downloads. Retain applicable runtime licenses.
- Keep the final player experience self-contained: double-click the HTML to play without a server, account, API key, install, or Internet connection.
- The ordinary ACM reference link may open an external page. The game itself must not depend on remote fonts, CDN scripts, images, audio, or services.
- Prefer CSS, system fonts, and simple embedded visual elements. If separate assets are necessary, include them and test their relative paths after extracting the package into a fresh directory.
- Do not mix SugarCube macros or other story-format syntax into Harlowe.

If a particular build tool is unavailable, use another legitimate Twine-compatible workflow within the environment's permissions. If a required capability is genuinely blocked, complete unaffected work and report the exact limitation without claiming success.

## 3. Narrative requirements

Use the revised specification as the story baseline. Aim for approximately 22-26 passages, four major decision stages, and five distinct endings. This is a scope target, not a reason to force incoherent passages or add filler.

Cast:
- Diane: player and new graduate.
- Max: acclaimed technical lead who behaves abusively.
- Jean: research manager who protects Max.
- Eli: coworker who wants support and fair credit but fears retaliation.
- Priya: HR adviser who explains this fictional company's options and limitations.

Max, Jean, Eli, and Priya must interact meaningfully with the player. Write original narration and natural dialogue. Keep the AR research setting, the difficult professional power imbalance, and research-credit issue central.

Core decision stages:
1. Respond to the initial outburst: tell Jean, record events, or stay quiet for now.
2. Handle the defect: review with Eli, attempt a rushed repair alone, or raise the defect openly.
3. Address unfair credit and Eli's concerns: challenge the decision, support Eli and ask what he wants shared, or accept the decision for immediate stability.
4. Choose a longer-term response: formal report, transfer/departure, peer improvements, or continued silence.

Preserve these five outcome concepts:
- E1 Accountability begins.
- E2 Review unresolved.
- E3 A safer exit.
- E4 Local progress.
- E5 Success with a cost.

Each ending needs concrete consequences, a short ethical reflection tied to the actual route, relevant ACM principles, and an easy restart. Do not reduce the reflection to a simplistic good/bad score.

Maintain a small, explicit state model for relevant facts: what Diane documented; how the defect was handled; support for Eli and his consent; and the response to unfair authorship. Every major choice must affect later dialogue, information, relationships, technical consequences, or an ending. Rejoining passages is acceptable only if the consequences persist.

Prevent continuity failures:
- A player who never spoke to Jean must not be told they were annoyed by Jean's response.
- A rushed solo repair that causes a regression must not become a successful demonstration without explanation. Show subsequent review, remediation, delay, or route-specific outcome text.
- Do not invent consent, evidence, or a complaint the player never obtained or made.
- An unresolved investigation does not mean the complaint was false.
- Eli's participation can help, but his refusal does not prevent Diane from reporting her own experience or observations.
- Max is responsible for his abuse; reporting a bug does not make Diane responsible for his mistreatment of someone.
- Technical mistakes may require correction, not humiliation or loss of earned credit.
- Leaving can be a defensible boundary. Do not call it cowardice or revenge avoidance.
- Remove the guaranteed successful lawsuit and payout, instant graduate-to-team-lead promotion, and team collapse caused by refusing that promotion.
- Priya cannot promise complete secrecy, a particular finding, immediate reform, or a guaranteed punishment.
- Explain management's incentives without presenting them as an excuse.
- Reset every story variable on a true restart.

Use fresh prose rather than copying the ACM case. Attribute the original premise and clearly distinguish adaptation additions. Verify ACM descriptions against accessible official sources when possible; never fabricate quotations or pretend a blocked page was read.

## 4. Intro and visual design

The intro must include:
- The Price of Prestige.
- Group 15.
- Identification of ACM's Abusive Workplace Behavior case and its working URL.
- Kazi Boni Amin - programmer and art designer.
- Krrish Setia - main writer.
- Andy Wang - editor and secondary writer.
- A clear start control and brief instructions sufficient to play without external help.

Create a consistent visual design beyond stock Twine. Use a restrained AR research-office style, such as navy, teal, and subtle warm accents. Include readable line lengths, strong text contrast, consistent headings, distinct speaker labels, generous spacing, obvious choice controls, visible keyboard focus, and a narrow-screen layout.

Keep choices and text usable with keyboard navigation and standard browser zoom. Avoid decorative animations that delay reading. Do not add unrelated game systems, authentication, leaderboards, analytics, remote AI calls, or a moral-score meter.

## 5. Produce the design document

Create the design PDF and an editable source. Markdown plus a working PDF-generation script is acceptable; DOCX is also acceptable if supported.

Required sections:
1. Scenario Description - short and consistent with the actual game.
2. Characters - describe all characters and their perspectives.
3. Ethical Dilemmas - a bulleted list with a few sentences for each dilemma, the available choices, and character-consistent reasons for each choice.
4. Lesson Goals - at least two clear goals; use the four proposed goals if they still match.
5. Story Flow - both proposed and final branching diagrams, clearly labeled and annotated.
6. Team Contributions - a table of the five preceding sections, with each person's real percentage for that section and row totals of 100% once confirmed.

Also include the story title, course/group, team names and known roles, ACM case-study identification/link, source attribution, and short explanations of the additions to the original case.

For flow diagrams:
- Preserve the supplied initial PDF unchanged.
- Use its proposed flow as the genuine pre-implementation proposal, redrawing only for readability if needed without altering its meaning.
- Derive a separate final diagram from the actual implemented passage graph. Include state-dependent routes and label important choices.
- Annotate actual differences between proposal and implementation. If a part did not change, say so.
- Never fabricate earlier meetings, dates, approvals, screenshots, or design history.
- Do not substitute a bare Twine screenshot for an annotated diagram.
- Keep diagrams readable when printed; split the final flow across pages if necessary.

The game, final diagram, dilemmas, character list, outcomes, and lesson goals must agree.

## 6. Handle contribution data honestly

The supplied roles are known. Percentages and ownership of the new perspective-elements are not known.

- Do not invent percentages, assign equal shares as fact, or claim a teammate created or tested something without evidence.
- Use the provided CSV as the single source for real contribution figures.
- Where data remains blank, label it clearly as awaiting team confirmation.
- List the actual information needed in review/TEAM_INPUT_NEEDED.md: percentages for each of the five design sections and the specific perspective-elements each person contributed.
- Complete all independent work first; do not block implementation while waiting for these figures.
- If these inputs remain unresolved, label the PDF as a review draft and do not describe the entire assignment as submission-ready.
- Keep the document generation easy to rerun after the team fills the CSV and perspective notes.

Do not add unsupported claims about human authorship, approvals, tests, or course policies.

## 7. Verify the actual deliverables

Perform meaningful structural and browser testing, within available tools:

- All referenced destinations exist and contain finished content.
- Every normal story passage and ending is reachable in a valid playthrough.
- Every displayed choice and important conditional variant is exercised; reaching only all five endings is insufficient.
- Verify the different evidence, repair, authorship, and consent states across merged branches.
- Test each ending from the real intro, including routes with and without earlier supporting actions.
- Check for Harlowe tw-error elements as well as browser console errors.
- Confirm restart clears all flags and replay cannot inherit another route's state.
- Check intro, dialogue, decisions, reflections, and endings at desktop and narrow widths.
- Test the actual exported HTML opened as a local file, with network unavailable or disabled.
- If the output uses separate assets, test a fresh extracted copy of the final ZIP.
- Verify the story can be imported into Twine, ideally by an actual import/play/export round trip in an isolated editor environment. Do not overwrite any existing user story. If no editor interaction is possible, validate the format and runtime, explicitly record that UI import remains a user check, and do not claim it was performed.
- Proofread every passage and link label.
- Render every PDF page and inspect for overlaps, clipped text/tables, tiny diagrams, missing glyphs, and awkward page breaks. Check the document text and references as well.
- Make sure the package contains the actual latest builds.

Record the checks actually executed and their outcomes. Clearly distinguish passed, failed, and not-performed checks. Do not fabricate screenshots, test results, external access, or a perfect grade.

## 8. Deliverable structure

Use this structure, or a clearly explained equivalent:

work/submission/
- Group15_Twine_Story.html
- Group15_Design_Document.pdf (visibly marked review draft if human contribution data is pending)
- Required local assets only if the HTML is not self-contained.

work/source/
- story.twee and the canonical stylesheet source.
- Editable design-document source.
- Proposed and final flow source plus readable rendered exports.
- Reproducible build and document-generation scripts/configuration.
- Required runtime/version/license information.

work/review/
- README_REVIEW.md with exact review, import, rebuild, and final-submission steps.
- TEST_REPORT.md listing executed checks and limitations.
- ROUTE_CHECKLIST.csv or equivalent showing which choices/states/endings were tested.
- RUBRIC_CHECK.md mapping each actual rubric item to concrete implemented evidence.
- TEAM_INPUT_NEEDED.md containing only genuine unresolved human inputs.
- A small set of useful game-preview screenshots if browser capture is available.

Also create Group15_Review_Package.zip containing the submission candidates, source, and review materials. Keep supporting logs/source distinct from the two items the assignment actually requires.

## 9. Final response to me

Lead with the result and give clickable paths to the playable HTML, design PDF, review ZIP, and editable source.

Explain briefly:
- What was built and what changed from the original outline.
- How to play the local HTML.
- How to import the HTML into Twine using Library > Import.
- Which tests were actually performed and any unverified capability.
- Exactly what I must review or supply, especially contribution data.
- Which files are the actual submission candidates.

Do not end with merely a plan, incomplete passage templates, or instructions for me to do routine building/testing. Complete the reviewable project first, then hand it over.

