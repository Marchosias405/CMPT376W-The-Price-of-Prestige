/* Exhaustive real-browser route checks for the revised Group 15 Twine story.
 * Does not inject story state or mock Harlowe. Run after source/build.mjs.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const assert = require('assert');
const crypto = require('crypto');
const { pathToFileURL } = require('url');
const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');

const root = path.resolve(__dirname, '..');
const review = path.join(root, 'review');
const html = path.resolve(process.argv[2] || path.join(root, 'submission/Group15_Twine_Story.html'));
const routes = [];
const seenPassages = new Set(), seenChoices = new Set();
const errors = [], requests = [];

const names = [
  'Intro', 'Offer', 'Outburst', 'Jean', 'Record', 'Quiet', 'Defect',
  'Pair', 'Solo', 'Open', 'Credit', 'Challenge', 'Support', 'Accept',
  'Debrief', 'Options', 'Report', 'Exit', 'Peers', 'Silence',
  'E1', 'E2', 'E3', 'E4', 'E5'
];
const source = fs.readFileSync(path.join(__dirname, 'story.twee'), 'utf8').replace(/\r\n?/g, '\n');
const headings = Object.fromEntries(
  [...source.matchAll(/^:: (\w+)[^\n]*\n([\s\S]*?)(?=^:: |$(?![\s\S]))/gm)]
    .filter(m => m[2].includes('<h1>'))
    .map(m => [m[1], m[2].match(/<h1>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g, '')])
);

async function inspect(page, name) {
  const h = headings[name];
  assert(h !== undefined, `No heading found in Twee for ${name}`);
  await page.waitForFunction(expected => document.querySelector('tw-passage h1')?.textContent === expected, h);
  assert.deepStrictEqual(await page.locator('tw-error').allTextContents(), [], `Harlowe error in ${name}`);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `Horizontal overflow in ${name}`);
  const txt = await page.locator('tw-passage').innerText();
  seenPassages.add(name);
  return txt;
}
async function choose(page, passage, index=0) {
  const links = page.locator('tw-passage .choices tw-link');
  const n = await links.count();
  assert(index < n, `${passage}: choice ${index} missing (only ${n} links)`);
  const label = (await links.nth(index).innerText()).trim();
  seenChoices.add(`${passage}: ${label}`);
  await links.nth(index).click();
}

// f: Jean/Record/Quiet; r: Pair/Solo/Open; c: Challenge/Support/Accept;
// s: Support+Pair consent choice; a: Report/Exit/Peers/Silence;
// x: Exit account (0=yes, 1=no).
async function run(page, f, r, c, s, a, x, fresh=true) {
  if (fresh) {
    await page.evaluate(() => { try { sessionStorage.clear(); } catch {} });
    await page.goto(pathToFileURL(html).href);
  }
  await inspect(page, 'Intro');
  await choose(page, 'Intro'); await inspect(page, 'Offer');
  await choose(page, 'Offer'); await inspect(page, 'Outburst');
  const first = ['Jean', 'Record', 'Quiet'][f];
  await choose(page, 'Outburst', f); await inspect(page, first);
  await choose(page, first);
  let txt = await inspect(page, 'Defect');
  assert(txt.includes(f === 0 ? "Jean's refusal" : f === 1 ? 'Your record is saved' : 'No manager has heard'));

  const repair = ['Pair', 'Solo', 'Open'][r];
  await choose(page, 'Defect', r); await inspect(page, repair);
  await choose(page, repair);
  txt = await inspect(page, 'Credit');
  if (r === 0) {
    assert(txt.includes('Your current credit is intact.'), 'Pair must preserve current credit');
    assert(txt.includes('The warning makes future recognition'), 'Pair must include a future-credit warning');
  } else if (r === 1) {
    assert(txt.includes('Your name is missing.'), 'Solo must remove Diane, not Eli');
    assert(txt.includes('Eli is still listed'), 'Solo must preserve Eli\'s byline');
  } else {
    assert(txt.includes('Your name has not been removed.'), 'Open must preserve Diane\'s byline');
    assert(txt.includes('unequal treatment'), 'Open must raise unequal treatment concerns');
  }
  const creditChoiceLabels = await page.locator('tw-passage .choices tw-link').allTextContents();
  assert.equal(creditChoiceLabels.length, 3, 'Credit must offer three route-appropriate choices');
  await choose(page, 'Credit', c);

  const credit = ['Challenge', 'Support', 'Accept'][c];
  txt = await inspect(page, credit);
  if (credit === 'Support') {
    if (r === 0) assert(txt.includes('specific statement'), 'Pair+Support must describe scoped permission');
    else assert(txt.includes('not comfortable') || txt.includes('does not authorize'), 'Solo/Open+Support must respect refusal');
  }
  await choose(page, credit, c === 1 && r === 0 ? s : 0);
  txt = await inspect(page, 'Debrief');

  const consent = r === 0 && c === 1 && s === 0;
  assert(txt.includes(consent ? 'Eli authorized sharing his specific named statement' : 'You have no permission to share a private statement'));
  assert(txt.includes(f === 1 ? 'dated record of Max' : f === 0 ? "Jean's dismissal" : 'not previously reported or documented'));
  assert(txt.includes(r === 0 ? 'Your joint repair succeeded' : r === 1 ? 'Your rushed repair caused a regression' : 'Your public defect report resulted'));
  await choose(page, 'Debrief');
  txt = await inspect(page, 'Options');

  const hasPeers = r !== 1 || c === 1;
  const optionLabels = await page.locator('tw-passage .choices tw-link').allTextContents();
  assert.equal(optionLabels.length, hasPeers ? 4 : 3, 'Conditional peer option count mismatch');
  assert.equal(optionLabels.some(t => t.includes('safer peer practices')), hasPeers, 'Joint peer initiative availability mismatch');
  if (!hasPeers) assert(txt.includes('A joint peer initiative is not currently available'));
  assert(!(a === 2 && !hasPeers), 'Test attempted an unavailable peer initiative');
  const actualOptionIndex = a === 3 && !hasPeers ? 2 : a;
  await choose(page, 'Options', actualOptionIndex);

  const action = ['Report', 'Exit', 'Peers', 'Silence'][a];
  await inspect(page, action);
  await choose(page, action, a === 1 ? x : 0);
  const end = a === 0
    ? (((f === 1 && c === 0) || consent) ? 'E1' : 'E2')
    : ['', 'E3', 'E4', 'E5'][a];
  txt = await inspect(page, end);
  assert(txt.includes(`ENDING ${end.slice(1)} OF 5`), `Unexpected ending: ${end}`);
  if (a === 1) assert(txt.includes(x === 0 ? 'You leave Priya a factual account' : 'You choose not to submit an exit account'));
  if (r === 1) assert(txt.includes('regression') || txt.includes('rushed') || txt.includes('manuscript still') || txt.includes('authorship') || txt.includes('excludes your name'), 'Solo continuity missing from ending');
  if (end === 'E2') assert(txt.includes('REVIEW UNRESOLVED'), 'Ending 2 not visible');
  routes.push({ route: routes.length + 1, first, repair, credit, consent,
    action, exitAccount: a === 1 ? (x === 0) : 'n/a', ending: end, status: 'PASS' });
  await choose(page, end); await inspect(page, 'Intro');
  if (routes.length % 12 === 0) console.log(`PASS ${routes.length} complete routes`);
}

(async () => {
  fs.mkdirSync(review, {recursive:true});
  const browser = await chromium.launch({headless:true, channel:process.env.BROWSER_CHANNEL || 'msedge'});
  try {
    const context = await browser.newContext({viewport:{width:1280,height:900}, offline:true});
    const page = await context.newPage();
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', msg => { if (msg.type() === 'error') errors.push(msg.text()); });
    page.on('request', req => { if (/^https?:/.test(req.url())) requests.push(req.url()); });
    for (let f=0; f<3; f++)
      for (let r=0; r<3; r++)
        for (let c=0; c<3; c++)
          for (let s=0; s<(r===0 && c===1 ? 2 : 1); s++)
            for (let a=0; a<4; a++)
              for (let x=0; x<(a===1 ? 2 : 1); x++) {
                if (a === 2 && r === 1 && c !== 1) continue;
                await run(page, f,r,c,s,a,x);
              }
    assert.equal(routes.length, 144, 'Expected 144 complete revised combinations');
    assert.equal(seenPassages.size, 25, 'All 25 playable passages must be visited');
    assert.equal(seenChoices.size, 43, `Expected 43 distinct choices, found ${seenChoices.size}`);
    assert.deepStrictEqual(errors, [], 'Browser errors');
    assert.deepStrictEqual(requests, [], 'Unexpected external requests');
    for (let ending=1; ending<=5; ending++)
      assert(routes.some(r => r.ending === `E${ending}`), `E${ending} not reached`);

    // In-game restart must clear previous state without a page reload.
    await run(page, 1,0,1,0,1,0); // Record / Pair / Support+consent / Exit with account.
    await run(page, 2,1,2,0,0,0, false); // Quiet / Solo / Accept / Report => E2, same browser session.
    assert.equal(routes.at(-1).ending, 'E2', 'Restart failed to reset evidence/consent');
    assert.deepStrictEqual(errors, []);

    const header = Object.keys(routes[0]);
    fs.writeFileSync(path.join(review, 'ROUTE_CHECKLIST.csv'), header.join(',') + '\n' +
      routes.map(r => header.map(k => String(r[k])).join(',')).join('\n') + '\n');
    const result = {status:'PASS', revisedGame:true,
      htmlSHA256: crypto.createHash('sha256').update(fs.readFileSync(html)).digest('hex'),
      exhaustiveRoutes:144, totalRuns:routes.length, endingCoverage:['E1','E2','E3','E4','E5'],
      distinctChoiceLabels:seenChoices.size, visitedPassages:seenPassages.size,
      offline:true, noInjectedStoryState:true, restartReplay:'PASS', errors, externalRequests:requests};
    fs.writeFileSync(path.join(review, 'browser-results.json'), JSON.stringify(result,null,2));
    console.log(JSON.stringify(result,null,2));
  } finally { await browser.close(); }
})().catch(err => { console.error(err.stack || err); process.exitCode = 1; });
