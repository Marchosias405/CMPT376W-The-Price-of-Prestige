/* Checks the revised design: neutral decision buttons, distinct ending themes.
 * No green/amber/red "correct answer" cues are permitted on selectable actions.
 */
'use strict';
const {chromium} = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('fs'), path = require('path'), assert = require('assert');
const {pathToFileURL} = require('url');
(async () => {
  const root = path.resolve(__dirname, '..');
  const html = path.resolve(root, 'submission/Group15_Twine_Story.html');
  const b = await chromium.launch({headless:true, channel:process.env.BROWSER_CHANNEL || 'msedge'});
  try {
    const context = await b.newContext({offline:true, viewport:{width:1100,height:850}});
    const p = await context.newPage();
    const errors = [], results = [], endingBackgrounds = [];
    p.on('pageerror', e => errors.push(String(e)));
    async function click(i=0) {
      const old = await p.locator('tw-passage h1').innerText();
      const links = p.locator('tw-passage .choices tw-link');
      assert(i < await links.count(), `Missing choice ${i}`);
      await links.nth(i).click();
      await p.waitForFunction(t => document.querySelector('tw-passage h1')?.innerText !== t, old);
      assert.deepStrictEqual(await p.locator('tw-error').allTextContents(), []);
    }
    async function checkNeutral(stage) {
      // After clicking the previous passage, the pointer may hover one of the
      // new choices. Hover is an ordinary interaction state, not a biased
      // choice colour. Move the pointer off all buttons before comparison.
      await p.mouse.move(0, 0);
      await p.evaluate(() => new Promise(resolve => requestAnimationFrame(resolve)));
      const cues = await p.locator('tw-passage .choices tw-link').evaluateAll(es => es.map(e => ({
        background:getComputedStyle(e).backgroundColor,
        border:getComputedStyle(e).borderLeftColor,
        label:getComputedStyle(e, '::before').content
      })));
      assert(cues.length >= 2, `Expected several choices at ${stage}`);
      assert.equal(new Set(cues.map(c=>c.background)).size, 1, `${stage}: unequal idle button backgrounds: ${JSON.stringify(cues)}`);
      assert.equal(new Set(cues.map(c=>c.border)).size, 1, `${stage}: unequal idle button borders: ${JSON.stringify(cues)}`);
      assert(cues.every(c => !/SUPPORT|PROTECTION|TRADEOFF|HEIGHTENED RISK/.test(c.label)), `${stage}: choice still gives a directional colour hint`);
      results.push({stage, choices:cues.length, background:cues[0].background, border:cues[0].border});
    }
    // Exercise every ending via a real route, without injecting Twine variables.
    for (let ending=1; ending<=5; ending++) {
      await p.evaluate(()=>{try{sessionStorage.clear()}catch{}});
      await p.goto(pathToFileURL(html).href);
      await p.locator('tw-passage h1').waitFor();
      await click(); await click(); // Intro, Offer.
      await checkNeutral('Outburst');
      await click(ending === 1 ? 1 : 2); await click(); // Record for E1, Quiet otherwise.
      await checkNeutral('Defect');
      await click(ending === 1 || ending === 4 ? 0 : ending === 2 ? 1 : 2);
      await click(); // Pair/Solo/Open, then Credit.
      await checkNeutral('Credit');
      await click(ending === 1 ? 0 : 2); await click(); // Challenge for E1, Accept otherwise.
      await click(); // Debrief to Options.
      await checkNeutral('Options');
      await click(ending <= 2 ? 0 : ending === 3 ? 1 : ending === 4 ? 2 : 3);
      await click(); // Report/Exit/Peers/Silence to ending.
      const desc = await p.locator('tw-passage .eyebrow').innerText();
      assert(desc.includes(`ENDING ${ending} OF 5`), `Expected E${ending}, got ${desc}`);
      const background = await p.locator('body').evaluate(e => getComputedStyle(e).backgroundImage);
      endingBackgrounds.push(background);
      results.push({ending, background});
      assert.deepStrictEqual(await p.locator('tw-error').allTextContents(), []);
    }
    assert.equal(new Set(endingBackgrounds).size, 5, 'Five ending themes should still be visually distinct');
    assert.deepStrictEqual(errors, []);
    fs.mkdirSync(path.join(root,'review'),{recursive:true});
    fs.writeFileSync(path.join(root,'review/colour-results.json'),JSON.stringify({status:'PASS',choiceButtons:'neutral',endingThemes:5,results,errors},null,2));
    console.log('PASS: neutral choice buttons across key decisions; five distinct ending backgrounds.');
  } finally { await b.close(); }
})().catch(e => { console.error(e.stack || e); process.exitCode=1; });
