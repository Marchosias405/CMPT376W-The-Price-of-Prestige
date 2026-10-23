/* Real-browser exhaustive route tests. No story-state injection or mocked Harlowe. */
const fs=require('fs'),path=require('path'),assert=require('assert');
const {pathToFileURL}=require('url');
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const base=path.resolve(__dirname,'..'), report=path.join(base,'review');
const html=path.resolve(process.argv[2]||path.join(base,'submission/Group15_Twine_Story.html'));
const routes=[],seenPassages=new Set(),seenChoices=new Set(),variants=new Map(),consoleErrors=[],network=[];
const names=['Intro','Offer','Outburst','Jean','Record','Quiet','Defect','Pair','Solo','Open','Credit','Challenge','Support','Accept','Debrief','Options','Report','Exit','Peers','Silence','E1','E2','E3','E4','E5'];
const headings=Object.fromEntries([...fs.readFileSync(path.join(__dirname,'story.twee'),'utf8').matchAll(/^:: (\w+)[^\n]*\n([\s\S]*?)(?=^:: |$(?![\s\S]))/gm)].filter(m=>m[2].includes('<h1>')).map(m=>[m[1],m[2].match(/<h1>([\s\S]*?)<\/h1>/)[1].replace(/<[^>]+>/g,'')]));
let steps=0;
async function inspect(page,name){
 await page.waitForFunction(h=>document.querySelector('tw-passage h1')?.textContent===h,headings[name]);
 assert.deepEqual(await page.locator('tw-error').allTextContents(),[],`Harlowe error in ${name}`);
 const txt=await page.locator('tw-passage').innerText();
 seenPassages.add(name);if(!variants.has(name))variants.set(name,new Set());variants.get(name).add(txt);
 assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),`Horizontal overflow ${name}`);
 steps++;return txt;
}
async function choose(page,name,index=0){
 const links=page.locator('tw-passage .choices tw-link');
 const label=await links.nth(index).innerText();seenChoices.add(`${name}: ${label}`);
 await links.nth(index).click();
}
async function run(page,first,repair,credit,share,action,exitAccount){
 await page.evaluate(()=>{try{sessionStorage.clear()}catch{}});
 await page.goto(pathToFileURL(html).href);await inspect(page,'Intro');
 await choose(page,'Intro');await inspect(page,'Offer');await choose(page,'Offer');await inspect(page,'Outburst');
 await choose(page,'Outburst',first);const f=['Jean','Record','Quiet'][first];await inspect(page,f);await choose(page,f);
 let txt=await inspect(page,'Defect');
 assert(txt.includes(first===0?"Jean's refusal":first===1?'Your record is saved':'No manager has heard'));
 await choose(page,'Defect',repair);const r=['Pair','Solo','Open'][repair];await inspect(page,r);await choose(page,r);await inspect(page,'Credit');
 await choose(page,'Credit',credit);const c=['Challenge','Support','Accept'][credit];txt=await inspect(page,c);
 if(c==='Support'&&repair!==0)assert(txt.includes("Please keep this conversation between us"));
 await choose(page,c,c==='Support'&&repair===0?share:0);txt=await inspect(page,'Debrief');
 const consent=repair===0&&credit===1&&share===0;
 assert(txt.includes(consent?'Eli has authorized sharing':'You have no permission'));
 assert(txt.includes(first===1?'dated account':first===0?'conversation with Jean':'not previously told Jean'));
 await choose(page,'Debrief');await inspect(page,'Options');await choose(page,'Options',action);
 const a=['Report','Exit','Peers','Silence'][action];await inspect(page,a);
 await choose(page,a,action===1?exitAccount:0);
 const end=action===0?((first===1&&credit===0)||consent?'E1':'E2'):['','E3','E4','E5'][action];
 txt=await inspect(page,end);assert(txt.includes(`ENDING ${end.slice(1)} OF 5`));
 if(action===1)assert(txt.includes(exitAccount===0?'Your factual exit account':'You leave no exit account'));
 if(repair===1&&action!==1)assert(/(?:two-day|reset test|two days)/.test(txt),'Regression continuity');
 routes.push({route:routes.length+1,first:f,repair:r,credit:c,consent,action:a,exitAccount:action===1?exitAccount===0:'n/a',ending:end,status:'PASS'});
 await choose(page,end);await inspect(page,'Intro');
 // Verify restart by a fresh silent route below and by static Intro initialization.
 if(routes.length%10===0)console.log(`PASS ${routes.length} complete routes`);
}
(async()=>{
 fs.mkdirSync(report,{recursive:true});
 const browser=await chromium.launch({headless:true,channel:process.env.BROWSER_CHANNEL||'msedge'});
 const context=await browser.newContext({viewport:{width:1280,height:900},offline:true});
 const page=await context.newPage();
 page.on('pageerror',e=>consoleErrors.push(String(e)));page.on('console',m=>{if(m.type()==='error')consoleErrors.push(m.text())});
 page.on('request',r=>{if(/^https?:/.test(r.url()))network.push(r.url())});
 for(let f=0;f<3;f++)for(let r=0;r<3;r++)for(let c=0;c<3;c++)for(let s=0;s<(r===0&&c===1?2:1);s++)for(let a=0;a<4;a++)for(let e=0;e<(a===1?2:1);e++)await run(page,f,r,c,s,a,e);
 assert.equal(routes.length,150);assert.equal(seenPassages.size,25);assert.equal(seenChoices.size,37);assert.deepEqual(consoleErrors,[]);assert.deepEqual(network,[]);
 // Restart from an all-flags route, then follow quiet/solo/accept with no reload.
 await run(page,1,0,1,0,1,0); // sets documented, supported, consent, exitAccount; restarts.
 await choose(page,'Intro');await inspect(page,'Offer');await choose(page,'Offer');await inspect(page,'Outburst');await choose(page,'Outburst',2);await inspect(page,'Quiet');await choose(page,'Quiet');
 let txt=await inspect(page,'Defect');assert(txt.includes('No manager has heard'));
 await choose(page,'Defect',1);await inspect(page,'Solo');await choose(page,'Solo');await inspect(page,'Credit');await choose(page,'Credit',2);await inspect(page,'Accept');await choose(page,'Accept');
 txt=await inspect(page,'Debrief');assert(txt.includes('not previously told Jean'));assert(txt.includes('You have no permission'));assert(txt.includes('You have not challenged'));
 await choose(page,'Debrief');await inspect(page,'Options');await choose(page,'Options',1);await inspect(page,'Exit');await choose(page,'Exit',1);txt=await inspect(page,'E3');assert(txt.includes('You leave no exit account'));await choose(page,'E3');await inspect(page,'Intro');
 // A separate replay starts with challenged=true and proves that flag also clears.
 await run(page,1,1,0,0,0,0);
 await choose(page,'Intro');await inspect(page,'Offer');await choose(page,'Offer');await inspect(page,'Outburst');await choose(page,'Outburst',2);await inspect(page,'Quiet');await choose(page,'Quiet');await inspect(page,'Defect');await choose(page,'Defect',2);await inspect(page,'Open');await choose(page,'Open');await inspect(page,'Credit');await choose(page,'Credit',2);await inspect(page,'Accept');await choose(page,'Accept');txt=await inspect(page,'Debrief');assert(txt.includes('You have not challenged'));assert(txt.includes('You have no permission'));await choose(page,'Debrief');await inspect(page,'Options');await choose(page,'Options',0);await inspect(page,'Report');await choose(page,'Report');await inspect(page,'E2');await choose(page,'E2');await inspect(page,'Intro');
 // Keyboard navigation uses the actual focused link; no synthetic click.
 await page.keyboard.press('Tab');let focus=await page.evaluate(()=>({tag:document.activeElement.tagName,text:document.activeElement.textContent,outline:getComputedStyle(document.activeElement).outlineWidth}));
 assert.equal(focus.tag,'TW-LINK');assert(focus.text.includes('Begin'));assert.equal(focus.outline,'3px');await page.keyboard.press('Enter');await inspect(page,'Offer');
 // Representative visual captures at desktop and 390px widths. Every passage also exercised at 390 via route set below.
 for(const width of [1280,390]){
  await page.setViewportSize({width,height:900});await page.evaluate(()=>sessionStorage.clear());await page.goto(pathToFileURL(html).href);await inspect(page,'Intro');await page.screenshot({path:path.join(report,`preview_intro_${width}.png`),fullPage:true});
  await choose(page,'Intro');await inspect(page,'Offer');await page.screenshot({path:path.join(report,`preview_dialogue_${width}.png`),fullPage:true});await choose(page,'Offer');await inspect(page,'Outburst');await page.screenshot({path:path.join(report,`preview_decision_${width}.png`),fullPage:true});
  await run(page,1,0,0,0,0,0); // ending captured separately below via actual route links
  await choose(page,'Intro');await inspect(page,'Offer');await choose(page,'Offer');await inspect(page,'Outburst');await choose(page,'Outburst',1);await inspect(page,'Record');await choose(page,'Record');await inspect(page,'Defect');await choose(page,'Defect',0);await inspect(page,'Pair');await choose(page,'Pair');await inspect(page,'Credit');await choose(page,'Credit',0);await inspect(page,'Challenge');await choose(page,'Challenge');await inspect(page,'Debrief');await choose(page,'Debrief');await inspect(page,'Options');await choose(page,'Options',0);await inspect(page,'Report');await choose(page,'Report');await inspect(page,'E1');await page.screenshot({path:path.join(report,`preview_ending_${width}.png`),fullPage:true});
 }
 for(const v of [[0,1,1,0,0,0],[2,2,2,0,1,1],[0,0,1,1,2,0],[2,1,2,0,3,0]])await run(page,...v);
 // 200% page zoom equivalent: desktop 1280 layout viewport reduced to 640 CSS pixels.
 await page.setViewportSize({width:640,height:450});await page.goto(pathToFileURL(html).href);await inspect(page,'Intro');await page.screenshot({path:path.join(report,'preview_zoom_equivalent.png'),fullPage:true});
 assert.deepEqual(consoleErrors,[]);assert.deepEqual(network,[]);
 fs.writeFileSync(path.join(report,'ROUTE_CHECKLIST.csv'),Object.keys(routes[0]).join(',')+'\n'+routes.map(x=>Object.values(x).join(',')).join('\n')+'\n');
 const result={browser:await browser.version(),sha256:require('crypto').createHash('sha256').update(fs.readFileSync(html)).digest('hex'),localFile:html,offline:true,exhaustiveRoutes:150,totalCompleteRoutes:routes.length,passageRenderChecks:steps,passages:[...seenPassages],choices:[...seenChoices],renderedVariantCounts:Object.fromEntries([...variants].map(([k,v])=>[k,v.size])),consoleErrors,networkRequests:network,restartReplay:'PASS',keyboardTabEnter:'PASS',viewports:[1280,390,640],notes:['640 CSS pixels is a layout equivalent of 200% zoom at 1280, not browser menu zoom.','No screen-reader or human team playtest claimed.']};
 fs.writeFileSync(path.join(report,'browser-results.json'),JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));await browser.close();
})().catch(e=>{fs.writeFileSync(path.join(report,'browser-failure.txt'),e.stack);console.error(e);process.exit(1)});
