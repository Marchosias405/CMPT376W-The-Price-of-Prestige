// Small Twee 3 compiler, implementing the IFTech Twine 2 format-template contract.
// Game logic stays in story.twee; this compiler embeds the unmodified Harlowe runtime.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import crypto from 'node:crypto';
const root=path.dirname(fileURLToPath(import.meta.url));
const raw=fs.readFileSync(path.join(root,'story.twee'),'utf8').replace(/\r\n?/g,'\n');
const chunks=[...raw.matchAll(/^:: ([^\n]+)\n([\s\S]*?)(?=^:: |$(?![\s\S]))/gm)];
const passages=chunks.map(m=>{const h=m[1].match(/^(.+?)(?: \[([^\]]*)\])?(?: (\{.*\}))?$/);if(!h)throw Error(m[1]);return {name:h[1],tags:h[2]||'',meta:h[3]?JSON.parse(h[3]):{},text:m[2].trim()};});
const title=passages.find(p=>p.name==='StoryTitle').text;
const data=JSON.parse(passages.find(p=>p.name==='StoryData').text);
const story=passages.filter(p=>!['StoryTitle','StoryData'].includes(p.name));
if(new Set(story.map(p=>p.name)).size!==story.length)throw Error('Duplicate passages');
const runtime=fs.readFileSync(path.join(root,'vendor/harlowe-3.3.9.js'),'utf8');
// The pinned official wrapper contains JSON; parse data, do not execute it at build time.
const format=JSON.parse(runtime.slice(runtime.indexOf('(')+1,runtime.indexOf(',"setup":'))+'}');
if(format.name!==data.format||format.version!==data['format-version'])throw Error('Runtime version mismatch');
const esc=s=>s.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;').replaceAll('>','&gt;');
const edges=[];
for(const p of story){
 for(const m of p.text.matchAll(/\[\[([^\]]+)->([^\]]+)\]\]/g))edges.push({from:p.name,to:m[2],label:m[1]});
 for(const m of p.text.matchAll(/\(go-to: "([^"]+)"\)/g))edges.push({from:p.name,to:m[1],label:'state-setting choice'});
 if(p.text.includes('(restart:)'))edges.push({from:p.name,to:data.start,label:'fresh restart'});
}
for(const e of edges)if(!story.some(p=>p.name===e.to))throw Error('Missing destination '+e.to);
const start=story.findIndex(p=>p.name===data.start)+1;
if(!start)throw Error('Missing start');
let htmlData=`<tw-storydata name="${esc(title)}" startnode="${start}" creator="Group15 Twee compiler" creator-version="1.0.0" ifid="${data.ifid}" zoom="${data.zoom}" format="${format.name}" format-version="${format.version}" options="" hidden>`;
htmlData+=`<style role="stylesheet" id="twine-user-stylesheet" type="text/twine-css">${fs.readFileSync(path.join(root,'style.css'),'utf8')}</style><script role="script" id="twine-user-script" type="text/twine-javascript"></script>`;
story.forEach((p,i)=>htmlData+=`<tw-passagedata pid="${i+1}" name="${esc(p.name)}" tags="${esc(p.tags)}" position="${p.meta.position||'0,0'}" size="${p.meta.size||'100,100'}">${esc(p.text)}</tw-passagedata>`);
htmlData+='</tw-storydata>';
const html=format.source.replaceAll('{{STORY_NAME}}',esc(title)).replaceAll('{{STORY_DATA}}',htmlData);
const out=path.resolve(root,'../submission/Group15_Twine_Story.html');fs.mkdirSync(path.dirname(out),{recursive:true});fs.writeFileSync(out,html);
fs.writeFileSync(path.join(root,'graph.json'),JSON.stringify({passages:story.map(({name,tags,meta})=>({name,tags,...meta})),edges},null,2));
fs.writeFileSync(path.join(root,'vendor/runtime-metadata.json'),JSON.stringify({name:format.name,version:format.version,author:format.author,license:format.license,url:'https://twinery.org/2/story-formats/harlowe-3.3.9/format.js',sha256:crypto.createHash('sha256').update(runtime).digest('hex')},null,2));
console.log(`Built ${out}: ${story.length} passages; ${edges.length} graph edges; Harlowe ${format.version}`);
