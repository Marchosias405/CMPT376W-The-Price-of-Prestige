"""Rebuild matching design PDF and editable/rendered flow diagrams.
Run: python source/generate_pdf.py from the package root, or any directory.
Requires Python 3, reportlab, pypdf. Reads graph.json compiled from story.twee.
Fill team_contributions.csv and perspective_notes.json with real team data.
"""
from pathlib import Path
import csv, json, math, re, shutil
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_CENTER
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
from reportlab.graphics.shapes import Drawing, Rect, Line, Polygon, String
from reportlab.graphics import renderSVG
from pypdf import PdfReader

SRC = Path(__file__).resolve().parent
ROOT = SRC.parent
OUT = ROOT / 'submission' / 'Group15_Design_Document.pdf'
DIAG = SRC / 'diagrams'
OUT.parent.mkdir(exist_ok=True); DIAG.mkdir(exist_ok=True)
data = json.loads((SRC/'design_content.json').read_text(encoding='utf-8'))
graph = json.loads((SRC/'graph.json').read_text(encoding='utf-8'))
story = (SRC/'story.twee').read_text(encoding='utf-8')
rows = list(csv.DictReader((SRC/'team_contributions.csv').open(encoding='utf-8-sig',newline='')))
notes = json.loads((SRC/'perspective_notes.json').read_text(encoding='utf-8'))
keys = ['Kazi_Boni_Amin_percent','Krrish_Setia_percent','Andy_Wang_percent']
complete = True
for row in rows:
    vals = [row[k].strip() for k in keys]
    if not all(vals): complete=False; continue
    nums = [float(v) for v in vals]
    if any(v<0 or v>100 for v in nums) or abs(sum(nums)-100)>0.001:
        raise ValueError('Contribution row must total 100: '+row['Section'])
complete = complete and all(n['confirmed'] and n['perspective_elements'].strip() and n['passage_or_example'].strip() for n in notes.values())
status = 'DESIGN DOCUMENT' if complete else 'REVIEW DRAFT | TEAM CONTRIBUTIONS PENDING'
NAVY=colors.HexColor('#183245'); TEAL=colors.HexColor('#076C72'); PALE=colors.HexColor('#EAF4F4'); INK=colors.HexColor('#233C4D'); MUTED=colors.HexColor('#526875'); GOLD=colors.HexColor('#A66723'); LINE=colors.HexColor('#CCDDE1')
styles={
 'title':ParagraphStyle('title',fontName='Helvetica-Bold',fontSize=31,leading=34,textColor=NAVY,spaceAfter=12),
 'h1':ParagraphStyle('h1',fontName='Helvetica-Bold',fontSize=20,leading=24,textColor=NAVY,spaceAfter=12),
 'h2':ParagraphStyle('h2',fontName='Helvetica-Bold',fontSize=12,leading=15,textColor=TEAL,spaceBefore=9,spaceAfter=5),
 'body':ParagraphStyle('body',fontName='Helvetica',fontSize=10,leading=14,textColor=INK,spaceAfter=8),
 'small':ParagraphStyle('small',fontName='Helvetica',fontSize=8.6,leading=12,textColor=INK,spaceAfter=6),
 'tiny':ParagraphStyle('tiny',fontName='Helvetica',fontSize=8,leading=10.5,textColor=INK,spaceAfter=4),
 'bullet':ParagraphStyle('bullet',fontName='Helvetica',fontSize=10,leading=14,textColor=INK,leftIndent=13,firstLineIndent=-12,spaceAfter=14),
 'label':ParagraphStyle('label',fontName='Helvetica-Bold',fontSize=9,leading=12,textColor=TEAL,spaceAfter=10),
}
def p(s,kind='body'): return Paragraph(s,styles[kind])
def plain(s): return escape(s)
def table(cells,widths,header=True,fs='small'):
    tab=Table([[p(plain(str(c)),fs) for c in row] for row in cells],colWidths=widths,hAlign='LEFT')
    st=[('VALIGN',(0,0),(-1,-1),'TOP'),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),7),('BOTTOMPADDING',(0,0),(-1,-1),5),('LINEBELOW',(0,0),(-1,-1),.4,LINE)]
    if header: st += [('BACKGROUND',(0,0),(-1,0),PALE)]
    tab.setStyle(TableStyle(st));return tab

class Flow:
    def __init__(self,height): self.d=Drawing(504,height); self.h=height;self.nodes={}
    def node(self,id,x,y,w,h,label,fill=PALE,size=9):
        # Coordinates measured down from drawing top.
        yy=self.h-y-h; self.nodes[id]=(x,yy,w,h)
        self.d.add(Rect(x,yy,w,h,rx=6,ry=6,fillColor=fill,strokeColor=LINE,strokeWidth=.8))
        lines=label.split('\n'); step=size+3
        for i,line in enumerate(lines):
            self.d.add(String(x+w/2,yy+h/2+(len(lines)-1)*step/2-i*step-3,line,textAnchor='middle',fontName='Helvetica-Bold' if i==0 else 'Helvetica',fontSize=size,fillColor=INK))
    def edge(self,a,b,label='',label_x=None,label_y=None,mid_y=None):
        x,y,w,h=self.nodes[a]; xx,yy,ww,hh=self.nodes[b]
        sx=x+w/2;sy=y;ex=xx+ww/2;ey=yy+hh;mid=(sy+ey)/2 if mid_y is None else self.h-mid_y
        self.d.add(Line(sx,sy,sx,mid,strokeColor=MUTED,strokeWidth=.8));self.d.add(Line(sx,mid,ex,mid,strokeColor=MUTED,strokeWidth=.8));self.d.add(Line(ex,mid,ex,ey,strokeColor=MUTED,strokeWidth=.8))
        self.d.add(Polygon([ex,ey,ex-2.4,ey+5,ex+2.4,ey+5],fillColor=MUTED,strokeColor=MUTED))
        if label:self.d.add(String(label_x if label_x is not None else (sx+ex)/2+4,self.h-label_y if label_y is not None else mid+4,label,fontName='Helvetica',fontSize=8,fillColor=TEAL))
    def export(self,name):renderSVG.drawToFile(self.d,str(DIAG/(name+'.svg')));return self.d

# Faithful transcription of the supplied proposal's page 3; no final-stage additions.
f=Flow(544)
f.node('a',137,0,230,32,'Intro / offer / first outburst')
for id,x,l in [('j',0,'Tell Jean\nManagement dismisses concern'),('r',173,'Record events\nKeep a factual account'),('q',346,'Stay quiet for now\nProtect immediate position')]:f.node(id,x,53,158,39,l,size=8);f.edge('a',id)
f.node('b',91,113,322,30,'Bug discovered before the demonstration')
for id in ['j','r','q']:f.edge(id,'b')
for id,x,l in [('p',0,'Review with Eli\nMore confidence; risk delay'),('s',173,'Repair alone\nRushed fix creates a regression'),('o',346,'Raise the defect publicly\nRisk visible; Max targets Eli')]:f.node(id,x,165,158,39,l,size=8);f.edge('b',id)
f.node('c',91,225,322,30,"Unfair research credit and Eli's concerns")
for id in ['p','s','o']:f.edge(id,'c')
for id,x,l in [('ch',0,'Challenge the credit decision\nUse contribution evidence'),('su',173,'Support Eli privately\nAsk what he wants shared'),('ac',346,'Accept the decision\nPreserve short-term stability')]:f.node(id,x,276,158,39,l,size=8);f.edge('c',id)
f.node('d',91,336,322,30,'Choose a longer-term response')
for id in ['ch','su','ac']:f.edge(id,'d')
for id,x,l in [('re',0,'Formal report to Priya\nReview available accounts'),('ex',130,'Request transfer\nor plan departure'),('pe',260,'Stay and improve\npeer practices'),('si',390,'Keep working\nwithout challenging it')]:f.node(id,x,390,114,39,l,size=7.5);f.edge('d',id)
for id,x,l in [('e1',0,'E1\nAccountability\nbegins'),('e2',103,'E2\nReview remains\nunresolved'),('e3',206,'E3\nA safer exit'),('e4',309,'E4\nLocal progress;\nleadership unresolved'),('e5',412,'E5\nSuccess with a cost')]:f.node(id,x,482,92,51,l,fill=colors.HexColor('#FFF3DE'),size=7.8)
for a,b in [('re','e1'),('re','e2'),('ex','e3'),('pe','e4'),('si','e5')]:f.edge(a,b)
proposal=f.export('proposed_flow')

# Final diagrams select actual compiler graph edges. Annotations come from story.twee.
edge_pairs={(e['from'],e['to']) for e in graph['edges']}
covered=set()
def checked(f,a,b,label='',mid_y=None):
    assert (a,b) in edge_pairs,(a,b)
    covered.add((a,b)); f.edge(a,b,label,mid_y=mid_y)
f=Flow(480)
f.node('Intro',173,0,158,32,'Intro | reset all 8 variables')
f.node('Offer',173,53,158,32,'Offer | join the AR lab');checked(f,'Intro','Offer')
f.node('Outburst',137,106,230,33,'Outburst | first response');checked(f,'Offer','Outburst')
for id,x,l in [('Jean',0,'Jean\nAsk manager to intervene\n$first = jean'),('Record',173,'Record\nWrite a factual account\n$documented = true'),('Quiet',346,'Quiet\nProtect immediate position\n$first = quiet')]:f.node(id,x,165,158,55,l,size=8.5);checked(f,'Outburst',id)
f.node('Defect',117,249,270,38,'Defect | how to handle the tracker bug\nRecalls the actual first response',size=8.5)
for id in ['Jean','Record','Quiet']:checked(f,id,'Defect')
for id,x,l in [('Pair',0,'Pair\nReview and test with Eli\n$repair = pair; +1 morning'),('Solo',173,'Solo\nRush, regress, then correct\n$repair = solo; +2 days'),('Open',346,'Open\nRaise risk at team review\n$repair = open; +1 day')]:f.node(id,x,319,158,55,l,size=8.5);checked(f,'Defect',id)
f.node('Credit',117,411,270,39,'Credit | both names missing from the paper\nContinues on final diagram B',size=8.5)
for id in ['Pair','Solo','Open']:checked(f,id,'Credit')
finala=f.export('final_flow_A')

f=Flow(370)
f.node('Credit',137,0,230,35,'Credit | immediate response')
for id,x,l in [('Challenge',0,'Challenge\nObject with work records\n$challenged = true'),('Accept',364,'Accept\nProtect immediate stability\n$credit = accept')]:f.node(id,x,71,140,57,l,size=8);checked(f,'Credit',id)
f.node('Support',149,71,206,140,'Support\nAsk Eli what he wants shared\n$supported = true\n\nIf $repair = pair:\naccept statement: $consent = true\nor keep private: $consent = false\nOtherwise respect refusal:\n$consent = false',size=8)
checked(f,'Credit','Support')
f.node('Debrief',117,250,270,40,'Debrief | take stock of records and permission\nEarlier facts persist across this merge',size=8.5)
for id in ['Challenge','Support','Accept']:checked(f,id,'Debrief',mid_y=233)
f.node('Options',117,323,270,35,"Options | hear Priya's choices (diagram C)",size=9);checked(f,'Debrief','Options')
finalb=f.export('final_flow_B')

f=Flow(440)
f.node('Options',137,0,230,35,'Options | choose the longer-term response')
for id,x,l in [('Report',0,'Report\nFile factual report'),('Exit',130,'Exit\nPlan a transfer'),('Peers',260,'Peers\nBuild peer practices'),('Silence',390,'Silence\nNo further action')]:f.node(id,x,72,114,42,l,size=8.5);checked(f,'Options',id)
for id,x,y,l in [('E1',0,224,'E1\nAccountability\nbegins'),('E2',103,224,'E2\nReview unresolved'),('E3',206,224,'E3\nA safer exit'),('E4',309,224,'E4\nLocal progress'),('E5',412,224,'E5\nSuccess with a cost')]:f.node(id,x,y,92,55,l,fill=colors.HexColor('#FFF3DE'),size=8.4)
for a,b in [('Report','E1'),('Report','E2'),('Exit','E3'),('Peers','E4'),('Silence','E5')]:checked(f,a,b)
f.node('Intro',137,355,230,38,'Intro | fresh restart from every ending\nHarlowe (restart:) clears story history',size=8.5)
for id in ['E1','E2','E3','E4','E5']:checked(f,id,'Intro')
finalc=f.export('final_flow_C')
assert covered==edge_pairs, ('Unmapped graph edges', edge_pairs-covered)
# Editable graph source retains all actual edges and full current labels.
mm=['flowchart TD']
for n in graph['passages']:
    if n['name']!='Frame':mm.append(f'  {n["name"]}["{n["name"]}"]')
support_index=0
exit_index=0
for e in graph['edges']:
    label=e['label'].replace('"',"'")
    if e['from']=='Options' and e['to']=='Silence':label='Keep working without further action'
    if e['from']=='Report':label=('if documented AND challenged, OR consent' if e['to']=='E1' else 'otherwise')
    if e['from']=='Support':
        label=['if not pair: respect refusal; consent=false','if pair: accept scoped statement; consent=true','if pair: keep statement private; consent=false'][support_index]
        support_index+=1
    if e['from']=='Exit':
        label=['leave factual exit account; exitAccount=true','no exit account; exitAccount=false'][exit_index]
        exit_index+=1
    mm.append(f'  {e["from"]} -->|"{label}"| {e["to"]}')
mm += ['  %% Support: after Pair, accept named statement or keep private; otherwise respect refusal.', '  %% Exit: choose factual exit account true or false before E3.', '  %% Frame is an automatically rendered header, not a navigable story node.']
(DIAG/'final_flow.mmd').write_text('\n'.join(mm)+'\n',encoding='utf-8')

content=[]
def add(s,kind='body'):content.append(p(s,kind))
def page(title,kicker=None):
    if content:content.append(PageBreak())
    if kicker:add(kicker,'label')
    add(title,'h1')

add('CMPT 376W / GROUP 15','label');add(data['title'],'title')
add(status,'label');add('G1 - ACM Code of Ethics Case Study (Twine)','body')
add('<b>Source case:</b> ACM, <i>Abusive Workplace Behavior</i>.','body')
add('<link href="https://www.acm.org/code-of-ethics/case-studies/abusive-workplace-behavior" color="#076C72">acm.org/code-of-ethics/case-studies/abusive-workplace-behavior</link>','small')
content.append(Spacer(1,10))
content.append(table([['Team member','Supplied role'],['Kazi Boni Amin','Programmer and art designer'],['Krrish Setia','Main writer'],['Andy Wang','Editor and secondary writer']],[175,329]))
add('1. Scenario Description','h2');add(plain(data['scenario']))
add('Adaptation and scope','h2')
add('The handoff identifies Diane, Max, Jean, the AR setting, workplace abuse, and punitive credit removal as the original premise. This adaptation adds Eli and Priya, specific technical review consequences, documentation and consent choices, a fictional reporting process, and five distinct endings. All game dialogue is newly authored for this build; no source quotations are claimed.')
add('The implemented story uses Harlowe 3.3.9, 25 navigable passages, a shared header passage, four main decision stages, and five endings. The separate test report records performed checks and limitations.')
add('Review status','h2')
add('Actual section contribution percentages and ownership of perspective-elements are awaiting team confirmation. Known roles do not establish percentages or authorship. See Section 6 for the precise missing facts. This document is a review candidate, not a claim of team approval.' if not complete else 'The contribution fields below have been supplied and marked confirmed in the editable inputs. This does not itself record approval or submission.','small')

page('2. Characters','PERSPECTIVES / MOTIVATIONS / INTERACTIONS')
for name,desc in data['characters']:add(plain(name),'h2');add(plain(desc))
add('Perspective boundaries','h2')
add('Diane can protect herself without being framed as cowardly. Eli is a person with choices rather than a resource to unlock an ending. Jean and Max have intelligible incentives, but those incentives are not ethical justification. Priya offers a constrained process rather than a guaranteed rescue.')

page('3. Ethical Dilemmas','FOUR DECISION STAGES')
for title,desc in data['dilemmas']:add('&#8226; <b>'+plain(title)+'.</b> '+plain(desc),'bullet')
add('Every ending asks a route-specific ethical question. Earlier choices change later text or outcomes even when passages merge. There is no moral score and no universally rewarded answer.','small')

page('4. Lesson Goals','WHAT THE PLAYER SHOULD BE ABLE TO EXPLAIN')
for i,(title,desc) in enumerate(data['goals'],1):add(f'{i}. '+plain(title),'h2');add(plain(desc))
add('How the ACM principles are applied','h2')
content.append(table([['Principle','Application in this adaptation'],['1.2 / 1.4','Reducing harm and treating people fairly inform the response to intimidation and abuses of authority.'],['1.5','Authorship should recognize real work; mistakes do not erase completed contributions.'],['2.4 / 2.6','Constructive review and recognizing the need for expertise counter fear-driven isolated work.'],['3.3 / 3.4','Leaders are responsible for working conditions and organizational processes that make ethical commitments usable.']],[86,418]))
add('These are paraphrased applications, not quotations. The accessible ACM chapter index supports the principle headings; direct access to the main case and Code pages was blocked. See the source note in Section 6.','small')

page('5. Story Flow | proposed','GENUINE PRE-IMPLEMENTATION SKETCH')
add('Redrawn from page 3 of the supplied initial design PDF. Boxes represent proposed stages, not final passage names. The initial PDF is preserved unchanged in the review package.','small')
content.append(proposal)
add('<b>Original annotations:</b> report outcomes depend on information and corroboration, with no guaranteed victory. Endings include ACM reflections and restart. Separate final diagrams follow.','small')

page('5. Story Flow | final A','IMPLEMENTED PASSAGES / FIRST RESPONSE AND TECHNICAL WORK')
add('Each box names an actual passage. Arrows follow compiled links; box descriptions label the important choices. The shared Frame header renders automatically and is omitted from navigation.','small')
content.append(finala)
add('<b>Unchanged:</b> the three responses to abuse and the three approaches to the defect remain as proposed. <b>Made concrete:</b> Intro and Offer are separate passages; the first response is remembered in Defect; every repair route states its testing and delay. A solo regression is corrected before any successful demo.','small')
add('Notation: $names are internal Harlowe state, not a player-visible score. Record also sets $first = record. No other first response creates an outburst record.','small')

page('5. Story Flow | final B','IMPLEMENTED PASSAGES / CREDIT, CONSENT, AND OPTIONS')
add('The three immediate credit responses remain. The Support passage now has explicit conditional choices, followed by a separate Debrief and an options conversation with Priya.','small')
content.append(finalb)
add('Conditional links within Support','h2')
add('After Pair, Eli authorizes only a named statement for Priya. The player may accept the permission ($consent = true) or keep it private ($consent = false). After Solo or Open, Eli refuses a private statement and the only continuation respects that boundary. All three displayed variants lead to Debrief; they are distinct tested-choice targets even though the destination is the same.','small')
add('Annotation: Challenge sets $credit = challenge; Support sets $credit = support; Accept sets $credit = accept. Only Challenge sets $challenged. Only Support sets $supported. Debrief separates the outburst note, the authorship objection, and Eli\'s private account.','small')
add('<b>Added precision:</b> a limited consent decision and an evidence summary replace an implicit assumption that supporting Eli always provides a statement. Hearing Priya\'s options is not filing a complaint.','small')

page('5. Story Flow | final C','IMPLEMENTED PASSAGES / RESPONSES AND FIVE ENDINGS')
add('Four longer-term responses and all five planned outcome concepts are retained. Every ending includes a reflection and a true restart.','small')
content.append(finalc)
add('State-dependent routes and in-passage choices','h2')
add('<b>Report to E1:</b> ($documented and $challenged) or $consent. <b>Report to E2:</b> otherwise. This is an authored fictional branching rule, not a prediction of a real HR process. E1 without Eli\'s statement includes Jean separately confirming the deferral of the written authorship objection.','small')
add('<b>Exit to E3:</b> choose a factual exit account ($exitAccount = true) or transfer without it (false). Both reach E3, whose account text changes. The implemented exit is a confirmed transfer after handover; a job search is the contingency discussed in Exit.','small')

page('5. Story Flow | consequences','FIVE DISTINCT OUTCOMES / NO GUARANTEED CLEAN VICTORY')
for name,desc in data['outcomes']:add(plain(name),'h2');add(plain(desc))
add('What changed, and what did not','h2')
add('The revised proposal\'s four-stage structure and five ending concepts remain intact. The build adds explicit consent and exit-account choices, separate Debrief and Options passages, concrete repair delays, and a precise report guard. The older outline\'s automatic lawsuit payout, graduate-to-lead promotion, team collapse, and inconsistent Ada naming are absent. Those were already rejected by the revised proposal, not new post-build discoveries.','small')

page('5. Story Flow | state contract','WHY MERGED PASSAGES REMEMBER CHOICES')
content.append(table([['State and initial value','Set by / persistent consequence'],['$first = none','Jean, Record, or Quiet identifies the first response. Defect and Debrief recall only conversations that occurred.'],['$documented = false','Record sets true. Debrief and Report distinguish a fresh note from recollection. With $challenged, enables the E1 report route without Eli.'],['$repair = none','Pair, Solo, or Open records the technical route. Credit, Support, Peers, Silence, and endings carry review, trust, repair, or delay consequences.'],['$credit = none; $challenged = false','Challenge sets credit=challenge and challenged=true. Support/Accept set the corresponding credit label. The challenged flag preserves the objection in Debrief, Report, and E3-E5. $credit is an explicit route record; the matching flags drive the prose.'],['$supported = false','Support sets true. Peer cooperation and exit/ending text recall the private conversation without inventing a statement.'],['$consent = false','Only Pair followed by Support and acceptance of the scoped permission sets true. Report shares only that account. It provides an alternate route to E1.'],['$exitAccount = false','Exit explicitly sets true or false before E3, changing what Priya retains.']],[150,354]))
add('Reset and implementation discipline','h2')
add('Intro initializes all eight variables. Each ending uses Harlowe\'s (restart:) macro, returning to fresh initialization and clearing story history. The canonical Twee source supplies the HTML build; graph.json is generated from its passage links. The final diagrams assert that every distinct source-to-destination pair in graph.json is represented across A-C.','small')
add('Repeated destination links in Support and Exit are annotated explicitly rather than drawn as overlapping arrows. The Mermaid export retains every compiled edge. Report guards are read from the implemented story and stated above; a plain graph edge alone does not imply unconditional reachability.','small')
add('Visual and interaction design','h2')
add('The AR-office interface uses labelled green choices for support or protection, amber for uncertain tradeoffs, and red for heightened risk or continuing harm. Scene backgrounds echo the situation. Ending screens use green for accountability, teal-green for a safer exit or local progress, amber for unresolved review, and red for success with continuing harm. Text labels and reflections preserve the tradeoffs; colour is not a guarantee or moral score. System fonts, readable line lengths, speaker labels, and visible keyboard focus support navigation. It has no timer, moral-score meter, remote media, or external instructions required to play. The full Harlowe runtime is embedded in the playable HTML.','small')

page('6. Team Contributions','REAL CONTRIBUTIONS / CONFIRMATION REQUIRED')
add('The supplied roles on page 1 are known. They do not establish actual percentages or who developed a particular perspective. Proposed allocations in the initial plan are not evidence of completed work.','body')
cells=[['Design section','Kazi\nBoni Amin','Krrish\nSetia','Andy\nWang','Actual\ntotal','Required\ntotal']]
for row in rows:
    vals=[row[k].strip() for k in keys]
    total=(f'{sum(float(v) for v in vals):g}%' if all(vals) else 'Pending')
    cells.append([row['Section']]+[(v+'%' if v else 'Pending') for v in vals]+[total,'100%'])
content.append(table(cells,[135,70,70,70,77,82],fs='tiny'))
add('Perspective-element ownership','h2')
for name,n in notes.items():
    desc=(n['perspective_elements']+' Example/passage: '+n['passage_or_example']) if n['confirmed'] and n['perspective_elements'] and n['passage_or_example'] else 'Awaiting team confirmation: identify the perspective-element actually contributed and a specific example or passage.'
    add('<b>'+plain(name)+':</b> '+plain(desc),'small')
add('Exactly what the team needs to supply','h2')
add('Provide each member\'s actual percentage for each of the five rows, with every row totaling 100%, and identify each person\'s actual perspective-element(s), with a concrete passage or example. Edit source/team_contributions.csv and source/perspective_notes.json, then rerun source/generate_pdf.py. Blank data remains visibly pending; the script validates completed percentage rows and does not invent missing values.','small')
add('Sources and attribution','h2')
add('<b>Primary assignment authority:</b> the supplied reference/04_assignment_and_rubric.txt. <b>Design baseline:</b> 05_revised_build_spec.md and the unchanged five-page G15_Initial_Design_and_Build_Plan.pdf. Earlier story, design, and feedback files provide context; the historical feedback\'s unverified design-section point values are not used.','tiny')
add('<b>ACM source case:</b> <link href="https://www.acm.org/code-of-ethics/case-studies/abusive-workplace-behavior" color="#076C72">Abusive Workplace Behavior</link>. <b>Code:</b> <link href="https://www.acm.org/code-of-ethics" color="#076C72">ACM Code of Ethics and Professional Conduct</link>. <b>Accessible principle index:</b> <link href="https://bw.acm.org/code-of-ethics" color="#076C72">ACM chapter Code of Ethics</link>. Direct automated retrieval of the main case and Code returned HTTP 403 during this build; the case premise is attributed using the supplied handoff. No claim is made to have read a fully retrieved case page or to quote its text.','tiny')
add('<b>Technical references:</b> <link href="https://twinery.org/reference/en/" color="#076C72">Twine editor reference</link>; <link href="https://twine2.neocities.org/" color="#076C72">Harlowe manual</link>; <link href="https://github.com/iftechfoundation/twine-specs" color="#076C72">IF Technology Foundation Twine/Twee specifications</link>. Local build instructions, runtime license, and actual checks accompany the package.','tiny')

def decorate(canvas,doc):
    canvas.saveState();canvas.setStrokeColor(TEAL);canvas.setLineWidth(2);canvas.line(54,750,558,750)
    canvas.setFont('Helvetica-Bold',8);canvas.setFillColor(GOLD if not complete else TEAL);canvas.drawString(54,763,status)
    canvas.setStrokeColor(LINE);canvas.setLineWidth(.5);canvas.line(54,42,558,42)
    canvas.setFont('Helvetica',8);canvas.setFillColor(MUTED);canvas.drawString(54,28,'THE PRICE OF PRESTIGE | CMPT 376W | GROUP 15');canvas.drawRightString(558,28,str(doc.page));canvas.restoreState()
doc=SimpleDocTemplate(str(OUT),pagesize=(612,792),rightMargin=54,leftMargin=54,topMargin=57,bottomMargin=57,title=data['title']+' - Design Document',author='Group 15 | review candidate',subject=status)
doc.build(content,onFirstPage=decorate,onLaterPages=decorate)
pages=len(PdfReader(OUT).pages)
assert pages>=11, f'Unexpected missing content: {pages} pages.'
print(json.dumps({'pdf':str(OUT),'pages':pages,'review_draft':not complete,'distinct_graph_edges_covered':len(covered),'flow_svgs':4},indent=2))

