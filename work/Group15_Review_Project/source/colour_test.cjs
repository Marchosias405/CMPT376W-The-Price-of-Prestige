const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const fs=require('fs'),path=require('path'),assert=require('assert');const{pathToFileURL}=require('url');
(async()=>{
const root=path.resolve(__dirname,'..'),b=await chromium.launch({headless:true,channel:'msedge'}),ctx=await b.newContext({offline:true,viewport:{width:1000,height:850}}),p=await ctx.newPage();let errors=[];p.on('pageerror',e=>errors.push(e.message));const results=[];
async function click(i=0){const old=await p.locator('h1').innerText();await p.locator('.choices tw-link').nth(i).click();await p.waitForFunction(t=>document.querySelector('h1')?.innerText!==t,old);assert.deepEqual(await p.locator('tw-error').allTextContents(),[]);}
for(let end=1;end<=5;end++){
await p.evaluate(()=>{try{sessionStorage.clear()}catch{}});await p.goto(pathToFileURL(path.join(root,'submission/Group15_Twine_Story.html')).href);await p.locator('h1').waitFor();await click();await click();
await click(end===1?1:2);await click();
if(end===1){await p.mouse.move(0,0);const cues=await p.locator('.choices tw-link').evaluateAll(es=>es.map(e=>({bg:getComputedStyle(e).backgroundColor,label:getComputedStyle(e,'::before').content})));assert.deepEqual(cues.map(x=>x.bg),['rgb(23, 62, 44)','rgb(72, 37, 44)','rgb(68, 53, 29)']);assert(cues[1].label.includes('HEIGHTENED RISK'));await p.screenshot({path:path.join(root,'review/colour_choices_defect.png'),fullPage:true});results.push({choiceCues:cues});}
await click();await click();await click(end===1?0:2);await click();await click();await click(end<=2?0:end-2);await click();
const label=await p.locator('.eyebrow').innerText();assert(label.includes('ENDING '+end+' OF 5'));
const tint=await p.locator('body').evaluate(e=>getComputedStyle(e).backgroundImage);const badge=await p.locator('.eyebrow').evaluate(e=>getComputedStyle(e,'::after').content);results.push({ending:end,tint,badge});
await p.screenshot({path:path.join(root,`review/colour_ending_${end}.png`),fullPage:true});
}
assert.equal(new Set(results.filter(x=>x.tint).map(x=>x.tint)).size,5);assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'review/colour-results.json'),JSON.stringify({status:'PASS',offline:true,results,errors},null,2));console.log('PASS: green/red/amber choice cues and all five distinct ending tints, actual offline routes.');await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
