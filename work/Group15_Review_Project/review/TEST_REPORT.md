# Executed verification - 23 October 2026

**Final game status: PASS for the checks below. Design status: complete review draft; real team contributions remain pending.** No teammate playtest or approval is claimed.

Tested HTML SHA-256: `d6da560bd305a60abc471911a881d2e30c3c72ff88142da4fd58fa469c1ce257`.

Environment: Windows, Node 22.11.0, Python 3.12.14, ReportLab 4.4.9, pypdf 6.10.0, Playwright 1.62.1, headless Microsoft Edge 155.0.4283.62, official Harlowe 3.3.9. See `environment.json` and runtime metadata. Local client date is used for this report; automated host timestamps are not evidence of earlier design meetings.

## Colour revision requested by the user

Choice boxes now have green, amber or red fill, border and subtle glow, plus visible text labels. Green denotes support or protection; amber denotes uncertain tradeoffs; red denotes heightened risk or continuing harm. The intro explains the cues without promising outcomes. Scene backgrounds reflect risk/support/uncertainty. E1 is green, E2 amber, E3 teal-green, E4 muted green, and E5 red. Every ending has a textual outcome descriptor. Full scrollable-page backgrounds were checked, including the restart area.

All 150 exhaustive combinations, supplementary layout/restart checks and the 12-control keyboard route were rerun on this revision. A separate colour test traversed real offline routes to all five endings, asserted the green/red/amber choice styles and five distinct ending backgrounds, and saved screenshots and colour-results.json. Normal and hover states are distinguished in the test. Actual Twine import/export was repeated. No state logic, links or outcome rules changed.

The design PDF was regenerated to describe these colours. All 11 pages were rerendered; pages 1-9 and 11 are pixel-identical to the previously inspected renders, and the changed page 10 was visually inspected with no clipping or overlap. The contribution draft status is unchanged.

## Passed checks

| Check | Executed method and result |
|---|---|
| Genuine runtime and structure | Compiler embeds the unmodified official Harlowe 3.3.9 runtime. Parsed story data has stable IFID, Intro start, 25 playable passages plus Frame header. No unresolved destinations or empty/template passages. |
| Every route, not only endings | Actual browser clicks from Intro exercised all **150 complete decision combinations**: 30 reachable first/repair/credit/consent combinations times 5 final variants (Report, Exit with account, Exit without account, Peers, Silence). All expected endings matched. |
| Additional replay/layout checks | Suite logged **158 complete routes**, plus two fresh partial replay sequences, keyboard activation, and visual visits; **2,108 passage-render checks** total. The 158 rows are in ROUTE_CHECKLIST.csv; the first 150 are the exhaustive set. |
| Passage/choice/variant coverage | All 25 playable passages, all 5 endings, **37 distinct displayed choice labels keyed by passage**, and **75 distinct rendered passage-text variants** observed. There are 38 link occurrences including repeated Report labels, representing 35 distinct passage pairs. Static reachability complements, rather than replaces, browser execution. |
| Persisting consequences | Assertions check first-response text, dated notes versus recollection, scoped consent or no statement, E1/E2 guard, exit-account text, and solo-regression continuity. Exhaustive combinations execute every reachable if/else variant; rendered variant counts are saved. |
| Restart | Every complete route uses `(restart:)`. Additional no-reload playthroughs first set documentation/support/consent/exit-account, then replay quiet/solo/accept/no account; another sets challenged before restarting and obtains E2 on a fresh quiet/open/accept report. Eight variables are initialized by Intro, verified statically. No inherited consent, objection, note, or exit-account text appeared. |
| Runtime errors | Zero `tw-error` elements and zero browser JavaScript/console errors in the final suite. |
| Offline local file | Actual `file:///.../Group15_Twine_Story.html`, browser context offline for the complete route suite. Zero HTTP(S) requests. HTML parser found zero external asset/script/link resource tags. An ordinary external ACM anchor remains optional. |
| Keyboard | Full 12-choice route using real Tab and Enter only, including the conditional consent action, E1, and true restart. Every activated control had the visible 3px focus outline. See keyboard-results.json. |
| Desktop/narrow layouts | 1280px desktop and 390px narrow screenshots for Intro, dialogue, decision, and ending/reflection; all 25 passages reached across representative narrow routes. No horizontal overflow in executed render checks. Root inspected the generated screenshots. |
| Enlarged layout | 640 CSS-pixel layout at a 1280px desktop equivalent models 200% zoom reflow. No horizontal overflow; screenshot inspected. This is explicitly an equivalent-layout check, not a claim that a browser-menu zoom command was executed. |
| Actual Twine import/export | Official deployed Twine editor assets were downloaded to an isolated localhost origin and fresh browser context, with English labels and the pinned official Harlowe runtime. Library > Import accepted the actual HTML as one story with 26 passages. Build > Publish to File exported it. All passage texts/tags, stylesheet, IFID, and format version were equal to the canonical build. The re-export loaded Intro and advanced to Offer offline without runtime errors. No existing user stories were accessed. |
| Source proofreading | Every passage, label, and conditional was read by an independent review agent; root reviewed and corrected its four findings. Jean is introduced before use; E1 names the actual written objection; E3 does not invent a private statement; the final silence choice says 'without further action'. See NARRATIVE_REVIEW.md and resolution note below. |
| PDF content and rendering | All **11 pages** rendered through Poppler and individually visually inspected by the document agent; root also inspected a page contact sheet and final flow/detail pages. Fixed a diagram connector overlap and proposal-page orphan before the final render. No remaining clipping, overlapping text, missing glyphs, or unreadable diagrams observed. pypdf checks found all 6 required headings, draft labels throughout, 7 clickable source links, and no replacement glyphs. |
| Diagram agreement | Generator asserts all **35 distinct compiled passage connections** are covered by the three final diagrams. Conditional consent, E1/E2 guard, exit-account variation, and every restart are annotated. Proposal redraw is faithful to supplied initial PDF page 3; original PDF is retained unchanged. |
| Contribution honesty | Blank CSV copied as input; actual totals remain Pending, required totals are separately labeled 100%. Perspective notes remain unconfirmed. No fabricated shares, personal perspective ownership, approvals, or tests. |

## Packaging validation

**PASS.** The preflight ZIP extracted into a new directory and passed ZIP CRC and all files listed in the preflight manifest. All 11 copied handoff files were byte-for-byte identical to the extracted inputs. Running the bundled compiler from the fresh directory produced byte-identical HTML. Running the document generator produced the same 11 pages and identical page text (PDF metadata timestamps may differ). A complete 12-choice offline keyboard route, including consent, E1, and restart, passed from the extracted project. Results are in `package-results.json`. The final archive is regenerated with this finalized report and checked again against its current manifest; the playable HTML and PDF payloads remain the validated artifacts.

## Limitations and checks not performed

- No human team playthrough, authorship confirmation, or approval. These are review tasks, not automated test results.
- No physical phone, screen reader, Firefox, Safari, or OS-specific browser-menu zoom test. Responsive viewport and keyboard checks were performed as described.
- The main ACM case and Code pages returned HTTP 403 through the retrieval tool. The supplied handoff supports the case premise; the accessible ACM chapter index verified the principle headings. No claim is made to have retrieved the full official case or copied source quotations. The optional canonical link is present, but remote page accessibility is not a passed test.
- The online Twine entry page initially rendered blank in the test browser. Actual import/export succeeded using its downloaded official application assets on an isolated local origin. Missing editor service-worker/icon/font requests were observed in that test setup; they did not affect import/export. These requests are for the test editor, not game dependencies. The final game made zero network requests.
- Harlowe's source repository returned an anti-bot page for license retrieval. The official distributed runtime, its Zlib metadata, and all embedded copyright notices are retained; supplementary license files and provenance are included.
- No publication, external hosting, assignment submission, teammate contact, real HR/legal-process validation, or promise of a grade was performed.

## Resolved build/test issues

The compiler also normalizes Windows CRLF line endings, verified after this revision. The first compiler attempt assumed the entire story-format wrapper was JSON. Harlowe also includes a setup function; the compiler now parses its JSON data prefix without executing that setup. The first browser harness read a passage too early after navigation; it now waits for the expected actual heading. A later visual check exposed Harlowe's session restore after reload; independent test routes now explicitly clear browser session storage, while restart tests deliberately do not. A font override and generated-line-break spacing were corrected in canonical CSS and rebuilt. The final route suite and Twine round trip were rerun on the final hash above. These resolved harness/build issues are not silently counted as passed first attempts.

All four source-review findings in NARRATIVE_REVIEW.md were applied before the final route tests. That file preserves the independent review as originally written, including recommendations now resolved. No known failing functional check remains among the executed final checks; unperformed checks remain unperformed.
