# Rebuild and source ownership

From the extracted package root:

```powershell
node source/build.mjs
python source/generate_pdf.py
python source/static_test.py
```

The first command rebuilds the playable HTML and derives `graph.json` from the actual passage links. The second rebuilds the design PDF and all flow exports, asserting that final diagrams cover every compiled connection. The third checks structure, initialization, links, embedded resources, and reachability. All scripts resolve paths relative to themselves and may also be run from another working directory. No network connection is needed for rebuilding the HTML: the exact official runtime is bundled.

`story.twee` is canonical narrative and Harlowe logic. `style.css` is canonical styling. `build.mjs` version 1.0.0 is a small compatible compiler for this project's Twee 3 subset and the official Twine 2 HTML/story-format template specification; it is not Tweego. It normalizes LF/CRLF source line endings and reads the JSON portion of the pinned story format and fills `STORY_NAME` and `STORY_DATA`. Do not patch generated HTML alone. If editing in Twine instead, export the story and reconcile its changes into these canonical sources before rebuilding.

Pinned story format: Harlowe 3.3.9. Stable IFID: B93175A9-0E76-43A8-9832-B1308B8BBE15. Start: Intro. Twenty-five playable passages plus the Frame header. Passage positions/tags are included in the Twee source and export.

PDF prose is editable in `design_content.json`; layout, supporting explanation, and proposed-flow coordinates are in `generate_pdf.py`. Final graph topology is checked against `graph.json`, not an invented design history. `diagrams/final_flow.mmd` and four SVG exports are derived artifacts. If you add/change links, update the final diagram layout in the generator; it will reject uncovered graph connections.

Contribution percentages have one source: `team_contributions.csv`. Put only actual human-confirmed figures in the five rows, each totaling 100%. Specific perspective ownership belongs in `perspective_notes.json`. The PDF stays a review draft while these inputs are incomplete. No human authorship is inferred from the supplied roles.

Python generation requires ReportLab and pypdf; exact versions used are recorded in `review/environment.json`. Browser tests require Playwright and an installed Edge (default) or another Playwright channel via BROWSER_CHANNEL. In PowerShell:

```powershell
$env:PLAYWRIGHT_PATH = 'C:/absolute/path/to/node_modules/playwright'
node source/browser_test.cjs
```

That suite opens the local file offline, clicks actual Harlowe links, and writes review evidence. It clears browser session storage only between independent routes, then separately tests the in-game restart without clearing storage. The 150 exhaustive routes are all combinations of first response, repair, credit, available consent decision, and final response (including exit account). The additional routes test layouts and fresh replays.

Twine compatibility: import `submission/Group15_Twine_Story.html` using Library > Import. Importing only `story.twee` does not bring in the separate CSS, so use the self-contained HTML for a complete editor copy. Build > Play previews it; Build > Publish to File exports an independent playable file. Import/export in an isolated editor was actually tested; see the test report.

Official format specifications:
- https://github.com/iftechfoundation/twine-specs/blob/master/twee-3-specification.md
- https://github.com/iftechfoundation/twine-specs/blob/master/twine-2-htmloutput-spec.md
- https://github.com/iftechfoundation/twine-specs/blob/master/twine-2-storyformats-spec.md
- https://twine2.neocities.org/

The compiler and document generator were prepared with Codex assistance for review. Supplied teammate roles are not evidence that those people authored, tested, or approved this generated implementation.

Colour-specific verification: `node source/colour_test.cjs`. Choice colours are assigned by the named decision-stage tags and choice order in CSS. If you reorder a decision, update and test its colour mapping. Outcome tags control ending themes.
