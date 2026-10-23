"""Structural checks on the canonical source and compiled artifact (stdlib only)."""
from pathlib import Path
from html.parser import HTMLParser
import re, json, hashlib
root=Path(__file__).resolve().parent.parent
class StoryParser(HTMLParser):
    def __init__(self):
        super().__init__(); self.passages={}; self.current=None; self.data={}; self.remote=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag=='tw-storydata':self.data=a
        if tag=='tw-passagedata':self.current=a['name'];self.passages[self.current]={'attrs':a,'text':''}
        if tag in ('script','img','audio','video','iframe','link') and (a.get('src') or a.get('href')):self.remote.append((tag,a))
    def handle_endtag(self,tag):
        if tag=='tw-passagedata':self.current=None
    def handle_data(self,text):
        if self.current:self.passages[self.current]['text']+=text
p=StoryParser(); artifact=root/'submission/Group15_Twine_Story.html';p.feed(artifact.read_text(encoding='utf-8'))
graph=json.loads((root/'source/graph.json').read_text());src=(root/'source/story.twee').read_text(encoding='utf-8')
assert len(p.passages)==26 and p.data['format']=='Harlowe' and p.data['format-version']=='3.3.9'
assert p.data['ifid']=='B93175A9-0E76-43A8-9832-B1308B8BBE15'
assert p.passages['Intro']['attrs']['pid']==p.data['startnode'];assert p.passages['Frame']['attrs']['tags']=='header'
assert not p.remote, p.remote
for e in graph['edges']:assert e['to'] in p.passages
seen={'Intro'}
while True:
    nxt=seen|{e['to'] for e in graph['edges'] if e['from'] in seen}
    if nxt==seen:break
    seen=nxt
assert seen==set(p.passages)-{'Frame'}
used=set(re.findall(r'\$([A-Za-z][A-Za-z0-9]*)',src));initial=set(re.findall(r'\$([A-Za-z][A-Za-z0-9]*) to ',p.passages['Intro']['text']))
assert used==initial and len(used)==8
for name in ('E1','E2','E3','E4','E5'):
    assert '(restart:)' in p.passages[name]['text'];assert 'reflection' in p.passages[name]['text']
result={'status':'PASS','compiledPassages':26,'playableReachablePassages':len(seen),'uniqueGraphEdges':len({(e['from'],e['to']) for e in graph['edges']}),'linkOccurrencesIncludingRestart':len(graph['edges']),'stateVariablesInitialized':sorted(initial),'conditionalIfBlocks':len(re.findall(r'\(if:',src)),'externalResourceTags':p.remote,'htmlSha256':hashlib.sha256(artifact.read_bytes()).hexdigest(),'notes':['Static graph reachability is supplemented by actual exhaustive browser routes.','Ordinary ACM anchor is allowed and requires internet only if opened.']}
(root/'review/structural-results.json').write_text(json.dumps(result,indent=2),encoding='utf-8');print(json.dumps(result,indent=2))
