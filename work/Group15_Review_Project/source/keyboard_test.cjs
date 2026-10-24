/* Keyboard navigation and restart check for the revised game, real Tab/Enter. */
'use strict';
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const fs=require('fs'), path=require('path'), assert=require('assert');
const {pathToFileURL}=require('url');
(async()=>{
  const root=path.resolve(__dirname,'..');
  const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'msedge'});
  try {
    const ctx=await browser.newContext({offline:true});
    const p=await ctx.newPage();
    const errors=[], clicked=[];
    p.on('pageerror',e=>errors.push(String(e)));
    await p.goto(pathToFileURL(path.resolve(root,'submission/Group15_Twine_Story.html')).href);
    // Wait for the destination passage after every Enter. On the final
    // restart, Harlowe may reload the page and destroy the old JS context.
    // Never query tw-error until the next passage has fully appeared.
    const steps = [
      ["Begin Diane's first week", "A name on the door"],
      ["Join the next lab review", "More than criticism"],
      ["Write a factual record while it is fresh", "Facts you can stand behind"],
      ["Return to the milestone work", "The bridge slips"],
      ["Ask Eli to review and test a fix together", "Two sets of eyes"],
      ["Read the manuscript draft", "The manuscript"],
      ["Ask Eli how to respond to the warning", "Ask before sharing"],
      ["Accept his permission to share that statement", "What you can carry"],
      ["Hear Priya's options", "No guaranteed ending"],
      ["File a factual formal report", "The scope of the report"],
      ["Follow the review over the next six weeks", "A door opens slowly"],
      ["Restart with a fresh set of choices", "The Priceof Prestige"]
    ];
    for (const [label, nextHeading] of steps) {
      await p.waitForFunction(s=>[...document.querySelectorAll('tw-passage .choices tw-link')]
        .some(e=>e.textContent.trim()===s),label);
      let found=false;
      for(let i=0;i<15;i++){
        await p.keyboard.press('Tab');
        if(await p.evaluate(s=>document.activeElement?.textContent?.trim()===s,label)){found=true;break;}
      }
      assert(found,'Could not focus choice: '+label);
      assert.equal(await p.evaluate(()=>getComputedStyle(document.activeElement).outlineWidth),'3px');
      await p.keyboard.press('Enter');
      clicked.push(label);
      await p.waitForFunction(heading =>
        document.querySelector('tw-passage h1')?.textContent === heading,
        nextHeading);
      assert.deepStrictEqual(await p.locator('tw-error').allTextContents(),[],
        `Harlowe error after: ${label}`);
    }
    await p.waitForFunction(()=>document.querySelector('tw-passage h1')?.textContent==='The Priceof Prestige');
    assert.deepStrictEqual(errors,[]);
    fs.mkdirSync(path.resolve(root,'review'),{recursive:true});
    fs.writeFileSync(path.resolve(root,'review/keyboard-results.json'),JSON.stringify({status:'PASS',choicesActivated:clicked,offline:true,errors},null,2));
    console.log('PASS: 12 keyboard-only choices, Ending 1 and restart.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1});
