import {useEffect,useRef,useState} from 'react'
import {motion,AnimatePresence,useScroll,useSpring,useInView,useMotionValue,useMotionValueEvent,useTransform,animate,useReducedMotion} from 'framer-motion'
import Lenis from 'lenis'
import pProfile from './assets/profile.webp'
import pCheck from './assets/checkin.webp'
import pPost from './assets/post.webp'
import pFeed from './assets/feed.webp'
import imgFraud from './assets/fraud.webp'
import imgExp from './assets/expense.webp'
import pAryan from './assets/aryan.webp'

const LI='https://www.linkedin.com/in/aryan-sharma-6a4ab52a4/',MAIL='mailto:aryanvp400@gmail.com'
const ease=[.2,.7,.2,1]

/* ---------- small building blocks ---------- */
const Sec=({id,children,tight})=><section id={id} className={"relative mx-auto max-w-6xl px-5 md:px-8 "+(tight?"py-14 md:py-16":"py-24 md:py-36")}>{children}</section>
const H=({children,sub,s})=><div className={"max-w-3xl "+(s?"mb-6 md:mb-8":"mb-12 md:mb-16")}><h2 className={"font-display font-bold leading-[1.02] tracking-tight "+(s?"text-3xl md:text-4xl":"text-4xl md:text-6xl")}>{children}</h2>{sub&&<p className={"leading-relaxed text-mute "+(s?"mt-3 text-base":"mt-5 text-lg")}>{sub}</p>}</div>
const Rise=({children,i=0,className=''})=><motion.div className={className} initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:.7,delay:i*.08,ease}}>{children}</motion.div>

function Count({to}){
  const r=useRef(),v=useInView(r,{once:true}),rd=useReducedMotion()
  useEffect(()=>{if(!v)return;if(rd){r.current.textContent=to;return}
    const c=animate(0,to,{duration:1.6,ease:'easeOut',onUpdate:x=>{if(r.current)r.current.textContent=Math.round(x)}});return()=>c.stop()},[v])
  return <span ref={r}>{rd?to:0}</span>
}

function Tilt({children,className=''}){
  const x=useMotionValue(0),y=useMotionValue(0),rd=useReducedMotion()
  const rx=useSpring(useTransform(y,[-.5,.5],[5,-5]),{stiffness:200,damping:20}),ry=useSpring(useTransform(x,[-.5,.5],[-5,5]),{stiffness:200,damping:20})
  return <motion.div className={'glow '+className} style={rd?{}:{rotateX:rx,rotateY:ry,transformPerspective:900}}
    onMouseMove={e=>{const b=e.currentTarget.getBoundingClientRect();x.set((e.clientX-b.left)/b.width-.5);y.set((e.clientY-b.top)/b.height-.5)}}
    onMouseLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.div>
}

function Mag({children,className='',...p}){
  const x=useMotionValue(0),y=useMotionValue(0),sx=useSpring(x,{stiffness:220,damping:14}),sy=useSpring(y,{stiffness:220,damping:14})
  return <motion.a {...p} style={{x:sx,y:sy}} className={'inline-block rounded-full px-6 py-3 font-medium transition-colors '+className}
    onMouseMove={e=>{const b=e.currentTarget.getBoundingClientRect();x.set((e.clientX-b.left-b.width/2)*.25);y.set((e.clientY-b.top-b.height/2)*.35)}}
    onMouseLeave={()=>{x.set(0);y.set(0)}}>{children}</motion.a>
}

function Bars({rows,den,labels}){ // rows: [label,a,b?]; den: denominators
  const max=Math.max(...den)
  return <div className="space-y-5">{rows.map(([l,a,b])=><div key={l}>
    <p className="mb-2 text-sm text-[#D9D4C9]">{l}</p>
    {[a,b].map((v,j)=>v===undefined?null:<div key={j} className="mb-1.5 flex items-center gap-3">
      <div className="h-3 flex-1 rounded-full bg-[#211F1D]"><motion.div className="h-3 rounded-full" style={{background:j?'#D8C7A6':'#E8A33D'}} initial={{width:0}} whileInView={{width:`${v/den[j]*100}%`}} viewport={{once:true}} transition={{duration:1.1,ease}}/></div>
      <span className="w-20 shrink-0 text-right font-display text-sm">{v} of {den[j]}{labels&&b!==undefined?<span className="sr-only"> {labels[j]}</span>:null}</span></div>)}
  </div>)}{labels&&<p className="flex gap-4 pt-1 text-xs text-mute"><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-accent"/>{labels[0]}</span><span><i className="mr-1.5 inline-block h-2 w-2 rounded-full bg-soft"/>{labels[1]}</span></p>}</div>
}

function Funnel({title,date,joins,ins,note,top}){
  return <div className="glow p-5"><p className="font-display text-xl">{title}</p><p className="mb-3 text-sm text-mute">{date}</p>
    <div className="h-10 rounded-xl bg-[#211F1D]" style={{width:`${joins/top*100}%`}}><motion.div className="flex h-10 items-center rounded-xl bg-accent px-4 font-display text-ink" initial={{width:0}} whileInView={{width:`${ins/joins*100}%`}} viewport={{once:true}} transition={{duration:1.2,ease}}><span className="whitespace-nowrap">{ins} in</span></motion.div></div>
    <p className="mt-2 font-display text-2xl">{ins} of {joins}</p><p className="text-sm text-mute">joins checked in. {note}</p></div>
}

/* ---------- global chrome ---------- */
function Chrome(){
  const x=useMotionValue(-100),y=useMotionValue(-100),sx=useSpring(x,{stiffness:300,damping:28}),sy=useSpring(y,{stiffness:300,damping:28})
  const [on,setOn]=useState(false),[big,setBig]=useState(false)
  useEffect(()=>{if(!matchMedia('(pointer:fine)').matches)return;setOn(true)
    const m=e=>{x.set(e.clientX);y.set(e.clientY);setBig(!!e.target.closest?.('a,button,[data-hover]'))}
    addEventListener('mousemove',m,{passive:true});return()=>removeEventListener('mousemove',m)},[])
  const {scrollYProgress}=useScroll(),bar=useSpring(scrollYProgress,{stiffness:120,damping:30})
  return <>
    {on&&<><motion.div aria-hidden style={{x:sx,y:sy,background:"radial-gradient(circle,rgba(232,163,61,.14),transparent 62%)"}} className="pointer-events-none fixed left-0 top-0 z-[5] -ml-[360px] -mt-[360px] h-[720px] w-[720px] will-change-transform"/><motion.div style={{x:sx,y:sy}} className="pointer-events-none fixed left-0 top-0 z-[70]"><div className={'-ml-4 -mt-4 h-8 w-8 rounded-full border border-soft transition-transform duration-200 '+(big?'scale-[2]':'')}/></motion.div></>}
    <header style={{paddingTop:"env(safe-area-inset-top,0px)"}} className="fixed inset-x-0 top-0 z-50 border-b border-line/60 bg-ink/70 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8" aria-label="Main">
        <a href="#top" className="font-display text-lg font-bold">Aryan Sharma</a>
        <div className="hidden items-center gap-7 text-sm text-mute md:flex">{['Work','Teardown','Experience','Skills','Contact'].map(l=><a key={l} href={'#'+l.toLowerCase()} className="transition-colors hover:text-white">{l}</a>)}</div>
        <a href={MAIL} className="rounded-full bg-white px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-soft">Email me</a>
      </nav>
      <motion.div style={{scaleX:bar}} className="absolute bottom-0 left-0 h-[2px] w-full origin-left bg-gradient-to-r from-accent to-soft"/>
    </header></>
}

/* ---------- 2. hero ---------- */
const VERBS=['test','interview','pilot']
function Hero(){
  const rd=useReducedMotion(),[k,setK]=useState(0)
  useEffect(()=>{if(rd)return;const t=setInterval(()=>setK(n=>(n+1)%VERBS.length),2400);return()=>clearInterval(t)},[rd])
  const words="product ideas with real users before I build them.".split(' ')
  const W=({children,d})=><span className="inline-block overflow-hidden align-bottom pb-[.08em]"><motion.span className="inline-block" initial={{y:'110%'}} animate={{y:0}} transition={{duration:.8,delay:d,ease}}>{children}</motion.span></span>
  return <div id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
    <div aria-hidden className="absolute inset-0"><div className="blob" style={{width:'46vw',height:'46vw',left:'-8vw',top:'-6vw',background:'#E8A33D'}}/><div className="blob" style={{width:'34vw',height:'34vw',right:'-4vw',top:'14vw',background:'#D8C7A6',opacity:.28,animationDelay:'-9s'}}/><div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-ink to-transparent"/></div>
    <div className="relative mx-auto grid w-full max-w-6xl flex-1 items-center gap-8 px-5 pb-4 pt-24 md:grid-cols-[1fr_auto] md:gap-12 md:px-8">
      <div>
        <h1 className="font-display text-2xl font-bold md:text-3xl">Aryan Sharma</h1>
        <p className="mt-1 text-lg text-[#D9D4C9]">Associate Product Manager</p>
        <p className="mt-5 font-display font-bold leading-[1.04] tracking-tight md:mt-8" style={{fontSize:"clamp(2rem,min(6.4vw,8.2vh),4.6rem)"}}>
          <span className="block">
            <W d={.1}>I</W>{' '}
            <span className="relative inline-block overflow-hidden align-bottom pb-[.08em]"><AnimatePresence mode="wait"><motion.span key={VERBS[k]} className="inline-block bg-gradient-to-r from-accent to-soft bg-clip-text text-transparent" initial={{y:'100%'}} animate={{y:0}} exit={{y:'-100%'}} transition={{duration:.45,ease}}>{VERBS[k]}</motion.span></AnimatePresence></span>
          </span>
          {words.map((w,i)=><span key={i}><W d={.25+i*.07}>{w}</W>{' '}</span>)}
        </p>
        <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
          <Mag href="#work" className="bg-accent text-ink hover:bg-[#F0B258]">View work</Mag>
          <Mag href={LI} target="_blank" rel="noreferrer" className="border border-line hover:border-accent">LinkedIn</Mag>
          <Mag href={MAIL} className="border border-line hover:border-accent">Email</Mag>
        </div>
      </div>
      <div className="relative hidden md:block"><div aria-hidden className="absolute left-1/2 top-1/2 aspect-square w-[130%] -translate-x-1/2 -translate-y-1/2 rounded-full" style={{background:"radial-gradient(circle,rgba(232,163,61,.28) 0%,rgba(232,163,61,.08) 50%,transparent 70%)"}}/><div className="relative overflow-hidden rounded-[32px] border border-[#3A3733] shadow-[0_30px_80px_-30px_rgba(0,0,0,.9)]" style={{height:"min(62vh,540px)",aspectRatio:"3/4"}}><img src={pAryan} alt="Aryan Sharma" width="720" height="958" fetchpriority="high" draggable="false" className="block h-full w-full object-cover object-top" style={{filter:"brightness(.8) contrast(1.06) saturate(.95)"}}/><div aria-hidden className="absolute inset-0" style={{background:"linear-gradient(to top,rgba(20,19,17,.55) 0%,transparent 38%),linear-gradient(135deg,rgba(232,163,61,.10),transparent 45%)"}}/></div></div>
    </div>
    <div className="relative mx-auto grid w-full max-w-6xl grid-cols-4 gap-x-3 border-t border-line px-5 py-5 md:gap-x-6 md:px-8 md:py-7">
      {[[15,'interviews'],[30,'survey responses'],[40,'pilot participants'],[54,'applications audited']].map(([n,l])=><div key={l}><p className="font-display text-3xl font-bold md:text-5xl"><Count to={n}/></p><p className="mt-1 text-xs text-mute md:text-base">{l}</p></div>)}
    </div>
  </div>
}

/* ---------- 3. showup ---------- */
const STEPS=[
 {k:'Problem',t:'Saying yes is easy. Showing up is the gap.',b:'Showup is a concept for a campus app that helps students find activity partners and shows who turns up. I wrote a PRD first, then tested its riskiest assumptions before building anything.',n:'11 of 15',l:'interviewees say yes and then don’t show up'},
 {k:'Research',t:'Two instruments, never pooled.',b:'15 interviews from my network, 14 to 19 Oct. A 30-response survey reached through referral chains, so it is not random.',n:'24 of 30',l:'tried to find people for a plan in the last month'},
 {k:'Pilot',t:'Two days, three free tools.',b:'Google Forms, a WhatsApp group and a Google Sheet. Round 1 on 21 Oct was the baseline. Round 2 on 22 Oct added visible show-up counts and a 2-hour reminder.',n:'17 of 29, then 22 of 36',l:'joins checked in. Two changes at once, so I can’t name a cause.'},
 {k:'Decision',t:'Change the rules before building.',b:'Late cancel or silence counts as a no-show, but a cancel 2 or more hours ahead has no penalty. Show-up counts are visible only to the pilot group, with consent. The location pin is visible only to the organiser.',n:'0',l:'safety reports, 2 comfort complaints'}]

let LEN=null
function Pinned(){
  const ref=useRef(),sk=useRef(),[i,setI]=useState(0)
  const pos=()=>[ref.current.getBoundingClientRect().top+scrollY,ref.current.offsetHeight-sk.current.offsetHeight]
  useEffect(()=>{
    const on=()=>{const[t,r]=pos();setI(Math.max(0,Math.min(3,Math.floor((scrollY-t)/r*4))))}
    on();addEventListener('scroll',on,{passive:true});addEventListener('resize',on)
    return()=>{removeEventListener('scroll',on);removeEventListener('resize',on)}
  },[])
  const jump=j=>{const[t,r]=pos(),y=t+(j+.5)/4*r;LEN?LEN.scrollTo(y,{duration:.9}):scrollTo({top:y,behavior:'smooth'})}
  const s=STEPS[i]
  return <div ref={ref} style={{height:'320svh'}} className="relative"><div ref={sk} className="sticky top-0 flex h-[100svh] items-center">
    <div className="mx-auto grid w-full max-w-6xl gap-8 px-5 pt-14 md:grid-cols-[200px_1fr] md:px-8">
      <ol className="flex gap-3 md:flex-col md:gap-3" aria-label="Case study steps">{STEPS.map((x,j)=><li key={x.k}><button type="button" onClick={()=>jump(j)} aria-current={j===i?'step':undefined} className={'flex w-full items-center gap-3 rounded-full py-2 pr-4 text-left font-display text-sm transition-colors hover:text-white md:text-xl '+(j===i?'text-white':'text-[#6B675E]')}><span className={'h-2.5 w-2.5 shrink-0 rounded-full transition-all '+(j<=i?'bg-accent':'bg-[#302D2A]')+(j===i?' scale-150':'')}/>{x.k}</button></li>)}</ol>
      <AnimatePresence mode="wait"><motion.div key={i} initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-20}} transition={{duration:.3,ease}}>
        <h3 className="font-display text-3xl font-bold leading-tight md:text-5xl">{s.t}</h3>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute md:text-lg">{s.b}</p>
        <p className="mt-6 font-display text-4xl font-bold text-soft md:text-6xl">{s.n}</p><p className="max-w-md text-mute">{s.l}</p>
        <p className="mt-8 text-xs text-mute">{i<3?'Keep scrolling, or click a step':'Keep scrolling to continue'}</p>
      </motion.div></AnimatePresence>
    </div></div></div>
}

const FLIPS=[
 ['A visible show-up rate will make people trust a plan.','14 of 30 liked the feature, 11 were neutral, 5 disliked it. In the pilot, 7 of 37 opted out of showing their count.'],
 ['Everyone should see everyone’s show-up record.','Of 9 follow-up replies, 5 said everyone, 4 said only the organiser, 0 said nobody.'],
 ['Fear of strangers is the main reason plans fail.','7 of 15 interviewees were nervous about strangers. In the survey, 22 of 24 named a reason: time or place led with 7.'],
 ['Sharing a location pin with the group is fine.','2 comfort complaints in the pilot, one about a location pin shared with the whole group. Now only the organiser sees it.']]
function Flip({a,b}){const [on,setOn]=useState(false)
  return <button className={'flip h-64 w-full text-left '+(on?'on':'')} onClick={()=>{if(!matchMedia("(hover:hover)").matches)setOn(o=>!o)}} aria-label="Flip card"><div className="h-full"><div className="face glow flex h-full flex-col justify-between p-6"><p className="text-sm text-mute">I assumed</p><p className="font-display text-2xl leading-snug">{a}</p></div><div className="face back glow flex flex-col justify-between border-accent/50 p-6"><p className="text-sm text-soft">What I found</p><p className="leading-relaxed text-[#E6E1D6]">{b}</p></div></div></button>}

function Showup(){
  return <div id="work">
    <Sec>
      <H sub="Concept, research and manual pilot, Oct 2026. I tested the idea with real people first.">Showup: a campus app idea, tested before it was built</H>
    </Sec>
    <Pinned/>
    <Sec>
      <H sub="Interviews and survey are separate instruments. I never add them together.">What people told me</H>
      <div className="grid gap-6 md:grid-cols-2">
        <Rise><Tilt className="p-6"><h3 className="mb-1 font-display text-2xl">Interviews</h3><p className="mb-6 text-sm text-mute">15 people from my network (9 current students, 6 not), 14 to 19 Oct. No direct quotes.</p>
          <Bars den={[15,9]} labels={['All 15','Students of 9']} rows={[['Say yes, then don’t show up',11,7],['Plan fell through: others backed out or never confirmed',8,5],['Nervous about meeting strangers',7,3],['Positive about a show-up rate, with conditions',12,7],['Use WhatsApp groups to organise',5,2]]}/></Tilt></Rise>
        <Rise i={1}><Tilt className="p-6"><h3 className="mb-1 font-display text-2xl">Survey</h3><p className="mb-6 text-sm text-mute">30 responses, ages 18 to 25, 23 cities. Referral chains in five clusters of 6, so not random. 24 of 30 tried to find people in the last month.</p>
          <p className="mb-3 font-display">Did the plans happen? (of those 24)</p><Bars den={[24]} rows={[['Always',2],['Mostly',12],['Sometimes',8],['Rarely',2]]}/>
          <p className="mb-3 mt-8 font-display">Main reason a plan fell through (22 of 24 named one)</p><Bars den={[24]} rows={[['Time or place',7],['Said yes but didn’t come',6],['Not enough people',4],['Changed my mind',3],['Weather',2]]}/></Tilt></Rise>
        <Rise><Tilt className="p-6"><h3 className="mb-1 font-display text-2xl">What would make strangers feel safe</h3><p className="mb-6 text-sm text-mute">Survey, all 30. Comfort rated 4 or 5: 15 of 30.</p>
          <Bars den={[30]} rows={[['A public place',17],['Seeing how often people show up',13]]}/>
          <p className="mb-3 mt-8 font-display">The show-up rate feature</p><Bars den={[30]} rows={[['Like',14],['Neutral',11],['Dislike',5]]}/></Tilt></Rise>
        <Rise i={1}><Tilt className="p-6"><h3 className="mb-1 font-display text-2xl">Follow-up to the 15 interviewees</h3><p className="mb-6 text-sm text-mute">9 of 15 replied.</p>
          <p className="mb-3 font-display">Would use an app instead of their WhatsApp group</p><Bars den={[9]} rows={[['Yes (3 of them with conditions)',6],['Not sure',3]]}/>
          <p className="mb-3 mt-8 font-display">Who should see the show-up record</p><Bars den={[9]} rows={[['Everyone',5],['Only the organiser',4],['Nobody',0]]}/></Tilt></Rise>
      </div>
    </Sec>
    <Sec tight>
      <H s sub="Built with Google Forms, a WhatsApp group and a Google Sheet. Recruited from college WhatsApp groups. 40 people joined, 37 were active in Round 2.">The manual pilot</H>
      <div className="grid gap-4 md:grid-cols-2">
        <Funnel title="Round 1, baseline" date="21 Oct 2026. No counts, no reminder." joins={29} ins={17} top={36} note="Baseline."/>
        <Funnel title="Round 2" date="22 Oct 2026. Visible show-up counts and a 2-hour reminder." joins={36} ins={22} top={36} note="Two changes at once."/>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-5">
        {[['13 of 19','Round 1 joiners joined again'],['7 of 37','opted out of showing their count'],['18 of 22','who replied would do it again'],['0','safety reports'],['2','comfort complaints: an unknown walk-in, and a location pin shared with the whole group']].map(([n,l],i)=><Rise key={l} i={i}><div className="glow h-full p-4"><p className="font-display text-2xl font-bold text-soft">{n}</p><p className="mt-1 text-sm text-mute">{l}</p></div></Rise>)}
      </div>
    </Sec>
    <Sec>
      <H sub="Tap or hover a card to flip it.">What I assumed vs what I found</H>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{FLIPS.map(([a,b],i)=><Rise key={a} i={i}><Flip a={a} b={b}/></Rise>)}</div>
    </Sec>
    <Sec>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="glow border-[#c9954a] p-7" style={{borderColor:'#c9954a'}}><h3 className="font-display text-2xl text-soft">Honest limits</h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[#D9D4C9]"><li>The sample is tiny.</li><li>Two changes at once, so no cause can be named.</li><li>Cancellations were not tracked, so show-up is likely understated.</li><li>No organiser baseline.</li><li>The survey had no age or student screening.</li></ul></div>
        <div className="glow p-7"><h3 className="font-display text-2xl">Decision: change before building</h3>
          <p className="mt-2 text-mute">PRD rules rewritten after the pilot:</p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-[#D9D4C9]"><li>Cancel at least 2 hours before: no penalty.</li><li>Late cancel or silence counts as a no-show.</li><li>Organiser can mark excused reasons.</li><li>Show-up counts visible only to the pilot group, with consent and a “New” label for newcomers.</li><li>Location pin visible only to the organiser.</li><li>Phone-number warning added.</li><li>Consent text rewritten.</li></ul></div>
      </div>
    </Sec>
    <Sec tight>
      <H s sub="A 4-screen mobile prototype designed in Figma from the PRD. Not clickable, not user-tested.">The prototype</H>
      <div className="grid grid-cols-2 justify-items-center gap-x-4 gap-y-6 md:grid-cols-4">{[['Profile',pProfile],['Home Feed',pFeed],['Post a Need',pPost],['Check-in',pCheck]].map(([n,src],i)=><Rise key={n} i={i}><figure className="w-[132px] sm:w-[150px]"><div className="overflow-hidden rounded-[22px] border-2 border-line bg-panel"><img src={src} alt={n+' screen of the Showup prototype'} loading="lazy" className="block w-full"/></div><figcaption className="mt-2 text-center text-sm text-mute">{n}</figcaption></figure></Rise>)}</div>
      <div className="mt-8 flex flex-wrap gap-3"><Mag href="https://drive.google.com/file/d/1hxAhubxQEJ_wLe3wAn7jDzefkUerACVc/view?usp=sharing" target="_blank" rel="noreferrer" className="bg-accent text-ink shadow-[0_10px_40px_-12px_rgba(232,163,61,.8)] hover:bg-[#F2B658]">Read the PRD ↗</Mag></div>
    </Sec>
  </div>
}

/* ---------- 4. teardown ---------- */
const LIT={7:'',23:'Easy Apply job, still shows Submitted',41:''}
function Teardown(){
  const [s,setS]=useState(0)
  const T=[['Problem','All 54 of my applications show only “Submitted application”, the oldest about 4 weeks old. 3 of 54 replied to me outside LinkedIn. 1 of those 3 was an Easy Apply job that still shows Submitted.'],
    ['Cause','A status is an access event, not a review. Coverage depends on the employer’s setup. After 4 weeks, rejected, ignored and untracked look identical. The “Actively reviewing” badge describes the company, not my application.'],
    ['Fix','Force a closing state (“Closed, not selected”) tied to the “Actively reviewing” badge. Show a per-application timeline where the employer’s system supports it.']]
  return <Sec id="teardown" tight>
    <H s sub="LinkedIn Application Tracking, Oct 2026. After you apply, LinkedIn shows where your application stands. The goal is to reduce the black-hole feeling and keep job seekers on LinkedIn.">Product teardown: what “Submitted” really tells you</H>
    <p className="mb-5 max-w-3xl text-[#D9D4C9]">The tension: job seekers want to know if anyone looked. Recruiters want to hire without extra admin work.</p>
    <div className="grid gap-4 md:grid-cols-2">
      <Tilt className="p-5"><p className="font-display text-xl">My own data: 54 applications (51 through Easy Apply)</p>
        <div className="mt-4 grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1.5 sm:gap-2" role="img" aria-label="54 dots. All 54 show Submitted. 3 replied outside LinkedIn.">{Array.from({length:54},(_,i)=>{const lit=i in LIT;return <motion.div key={i} title={LIT[i]||undefined} className={'aspect-square rounded-full '+(lit?'bg-soft':'bg-[#302D2A]')} initial={{scale:0}} whileInView={{scale:1}} viewport={{once:true}} transition={{delay:i*.015,type:'spring',stiffness:260,damping:18}} style={lit?{boxShadow:'0 0 18px #D8C7A6'}:{}}/>})}</div>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-mute"><span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-[#302D2A]"/>54 show “Submitted application”</span><span><i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-full bg-soft"/>3 replied elsewhere</span></p>
        <p className="mt-4 border-t border-line pt-4 text-[#D9D4C9]">All 54 still say “Submitted application”. 3 of 54 replied to me outside LinkedIn, and 1 of those 3 was an Easy Apply job.</p></Tilt>
      <div className="glow p-5"><p className="font-display text-xl">Proposed closing state</p>
        <div className="mt-3 space-y-2"><div><p className="mb-1.5 text-xs text-mute">Before</p><div className="rounded-xl bg-[#211F1D] p-3"><p className="font-medium">Job title</p><p className="text-sm text-mute">Company name</p><p className="mt-2 inline-block rounded-full bg-[#302D2A] px-3 py-1 text-sm">Submitted application</p></div></div>
          <div><p className="mb-1.5 text-xs text-soft">After</p><div className="rounded-xl border border-accent/50 bg-[#211F1D] p-3"><p className="font-medium">Job title</p><p className="text-sm text-mute">Company name</p><div className="mt-2 flex flex-wrap gap-2"><span className="rounded-full bg-accent px-3 py-1 text-sm text-ink">Closed, not selected</span><span className="rounded-full border border-line px-3 py-1 text-sm text-mute">Actively reviewing: ended</span></div><p className="mt-2 text-xs text-mute">Timeline (where the employer’s system supports it): Submitted, In review, Closed</p></div></div></div></div>
    </div>
    <div className="glow mt-4 p-5"><div className="flex gap-2" role="tablist">{T.map(([k],i)=><button key={k} role="tab" aria-selected={s===i} onClick={()=>setS(i)} className={'rounded-full px-5 py-2 font-display transition-colors '+(s===i?'bg-accent text-ink':'border border-line text-mute hover:text-white')}>{k}</button>)}</div>
      <AnimatePresence mode="wait"><motion.p key={s} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:.25}} className="mt-5 max-w-3xl text-lg leading-relaxed text-[#E6E1D6]">{T[s][1]}</motion.p></AnimatePresence></div>
    <div className="mt-4 grid gap-4 md:grid-cols-3">
      <div className="glow p-5"><p className="font-display text-xl">Why it is built this way</p><p className="mt-2 text-[#D9D4C9]">Employers are the paying side.</p><p className="mt-2 inline-block rounded-full border border-line px-3 py-1 text-xs text-soft">My inference, not verified</p></div>
      <div className="glow p-5"><p className="font-display text-xl">How I’d measure it</p><p className="mt-2 text-[#D9D4C9]">Success: share of applications that reach a final state within a set window.</p><p className="mt-2 text-[#D9D4C9]">Guardrail: employer posting volume.</p></div>
      <div className="glow p-5"><p className="font-display text-xl">Limits</p><p className="mt-2 text-[#D9D4C9]">One account, 54 applications, and I can’t see employers’ notification settings.</p></div>
    </div>
  </Sec>
}

/* ---------- 5-9 ---------- */
const SKILLS={Product:['High Agency & Ownership','Product Sense','Problem Framing','User Research','Customer Empathy','PRD Writing','Prioritization','Hypothesis-Driven Thinking','Product Metrics','Experiment Design','Data Analysis','Decision Making','Cross-functional Collaboration','Stakeholder Communication','Written Communication','Roadmapping'],Technical:['Node.js','MongoDB','HTML','CSS','JavaScript','Python','React','Express.js','FastAPI','REST APIs'],Tools:['SQL','Jira','Amplitude','Figma','Excel','Google Sheets','Google Forms','PowerPoint / Slides']}
const PROJ=[
 {n:'FraudShield v2',d:'Oct 2026',img:imgFraud,url:'https://fraudshield-v2.vercel.app',problem:'Fraudulent payments are hard to spot by eye in a long list of transactions.',how:'A Python Random Forest model, trained on the PaySim dataset, scores each transaction. The dashboard sorts them into fraud, suspicious and safe. Each user logs in with their own JWT login and sees only their own data.',stack:'MERN, Python, MongoDB Atlas. Deployed on Render and Vercel.',gh:'https://github.com/aryanvp00/fraudshield-v2'},
 {n:'AI Expense Tracker',d:'',img:imgExp,url:'https://ai-expense-tracker-swart-eight.vercel.app',problem:'Logging an expense means filling in the amount, description and category one by one. It is slow.',how:'You type one plain sentence, like “Spent ₹450 on dinner with friends”, and AI sorts it into amount, description and category. An assistant also explains your spending patterns in plain language.',stack:'FastAPI, MongoDB, Gemini API. Deployed on Render, Vercel and MongoDB Atlas.',gh:'https://github.com/aryanvp00/ai-expense-tracker'}]
const EXP=[
 {when:'Sep 2025 – Dec 2025',tag:'Internship',icon:'A',role:'Web Development Intern',org:'Astryx',label:'Owned end-to-end',lead:'A three-page real estate website for a live client.',pts:['Sole developer for the Home, About Us and Contact Us pages.','Built the frontend in HTML, CSS and JavaScript.','Built a Node.js backend serving property listings from MongoDB.','Deployment was handled by a full-time Astryx developer.'],chips:['HTML','CSS','JavaScript','Node.js','MongoDB']},
 {when:'Galgotias University',tag:'Leadership',role:'Club Head',org:'Book My Club',label:'How I led',lead:'Clear ownership. Regular check-ins. Feedback loops.',pts:['Led a student team to plan and run club events.','Coordinated responsibilities, timelines and execution.','Identified student interests to improve event planning and promotion.','Used student feedback and participation to decide what to improve next.'],flow:['Listen','Plan','Run','Improve']}]
function Rest(){
  const all=Object.values(SKILLS).flat()
  return <>
    <Sec id="technical" tight>
      <div className="mb-8 max-w-3xl"><h2 className="font-display text-3xl font-bold leading-tight tracking-tight md:text-5xl">I can work close to the implementation.</h2><p className="mt-3 text-lg text-mute">Smaller builds that connect product questions to shipped software.</p></div>
      <div className="grid gap-5 md:grid-cols-2">{PROJ.map((p,i)=><Rise key={p.n} i={i} className="h-full"><Tilt className="flex h-full flex-col overflow-hidden">
        <a href={p.url} target="_blank" rel="noreferrer" aria-label={'Open '+p.n+' live site'} className="block overflow-hidden border-b border-line"><img src={p.img} alt={p.n+' screenshot'} loading="lazy" className="aspect-[16/10] w-full object-cover object-top transition-transform duration-500 hover:scale-[1.03]"/></a>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-display text-2xl font-bold">{p.n}{p.d&&<span className="ml-2 text-sm font-normal text-mute">{p.d}</span>}</h3>
          <h4 className="mt-5 flex items-center gap-2.5 font-display text-xl font-bold text-accent"><span className="h-5 w-1 rounded-full bg-accent"/>The problem</h4><p className="mt-1.5 text-[#E6E1D6]">{p.problem}</p>
          <h4 className="mt-5 flex items-center gap-2.5 font-display text-xl font-bold text-accent"><span className="h-5 w-1 rounded-full bg-accent"/>How it works</h4><p className="mt-1.5 text-[#E6E1D6]">{p.how}</p>
          <p className="mt-3 text-sm text-mute">{p.stack}</p>
          <div className="mt-auto flex flex-wrap gap-3 pt-5"><a href={p.url} target="_blank" rel="noreferrer" className="rounded-full bg-accent px-5 py-2 text-sm font-medium text-ink transition-colors hover:bg-[#F2B658]">Open live site ↗</a><a href={p.gh} target="_blank" rel="noreferrer" className="rounded-full border border-line px-5 py-2 text-sm font-medium text-[#ECE8DF] transition-colors hover:border-accent hover:text-accent">GitHub ↗</a></div>
        </div></Tilt></Rise>)}</div>
    </Sec>
    <Sec id="experience" tight>
      <div className="mb-8 grid gap-4 md:mb-10 md:grid-cols-[210px_1fr] md:gap-8">
        <p className="font-mono text-xs uppercase tracking-[.2em] text-mute md:pt-3">Experience &amp; leadership</p>
        <div><h2 className="font-display text-4xl font-bold leading-[1.02] tracking-tight md:text-6xl">Ownership, from brief to follow-through<span className="text-accent">.</span></h2><p className="mt-4 text-lg text-mute">A small amount of work done end-to-end is worth describing precisely.</p></div>
      </div>
      <div className="grid gap-5 md:grid-cols-2">{EXP.map((e,i)=><Rise key={e.role} i={i} className="h-full"><Tilt className="flex h-full flex-col p-5 md:p-7">
        <div className="flex items-center justify-between gap-3"><p className="font-mono text-xs uppercase tracking-[.15em] text-mute">{e.when}</p><span className="rounded-md border border-line px-2.5 py-1 font-mono text-xs uppercase">{e.tag}</span></div>
        <div className="mt-6 flex items-center gap-4"><div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-line font-display text-2xl font-bold">{e.icon||<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#E8A33D" strokeWidth="2" aria-hidden><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="2.5" fill="#E8A33D"/></svg>}</div><div><h3 className="font-display text-2xl font-bold md:text-3xl">{e.role}</h3><p className="text-mute">{e.org}</p></div></div>
        <div className="mt-6 rounded-xl border border-line bg-[#161513] p-5"><p className="font-mono text-xs uppercase tracking-[.15em] text-mute">{e.label}</p><p className="mt-2 font-display text-xl font-bold leading-snug md:text-2xl">{e.lead}</p></div>
        <ul className="mt-6 space-y-3.5">{e.pts.map(t=><li key={t} className="flex gap-3 text-lg font-semibold leading-snug text-white"><span className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-accent"/>{t}</li>)}</ul>
        <div className="mt-auto pt-6"><div className="border-t border-line pt-5">{e.chips?<div className="flex flex-wrap gap-2">{e.chips.map(c=><span key={c} className="rounded-md border border-line px-2.5 py-1.5 font-mono text-xs">{c}</span>)}</div>:<p className="flex flex-wrap items-center gap-x-2 font-mono text-sm">{e.flow.map((f,j)=><span key={f}>{j>0&&<span className="mr-2 text-accent">→</span>}{f}</span>)}</p>}</div></div>
      </Tilt></Rise>)}</div>
    </Sec>
    <section id="skills" className="py-24 md:py-32">
      <div className="overflow-hidden border-y border-line py-6" aria-hidden><div className="marq flex font-display text-3xl md:text-5xl">{[...all,...all].map((s,i)=><span key={i} className={'pr-10 '+(i%2?'text-white':'text-[#5A5650]')}>{s}</span>)}</div></div>
      <div className="mx-auto mt-16 grid max-w-6xl gap-6 px-5 md:grid-cols-[1.5fr_1fr_1fr] md:px-8">{Object.entries(SKILLS).map(([k,v],i)=><Rise key={k} i={i}><div className="glow h-full p-6"><h3 className="font-display text-2xl">{k}</h3><ul className="mt-4 flex flex-wrap gap-2">{v.map(s=><li key={s} className="rounded-full border border-line px-3 py-1.5 text-sm text-[#D9D4C9]">{s}</li>)}</ul></div></Rise>)}</div>
    </section>
    <Sec id="contact" tight>
      <p className="mb-5 font-mono text-xs uppercase tracking-[.2em] text-accent">Contact</p>
      <h2 className="max-w-3xl font-display text-3xl font-bold leading-[1.1] tracking-tight md:text-5xl">If you are hiring an APM who will talk to users before writing tickets, write to me.</h2>
      <div className="mt-8 flex flex-wrap gap-3"><Mag href={MAIL} className="bg-accent text-ink hover:bg-[#F0B258]">aryanvp400@gmail.com</Mag><Mag href={LI} target="_blank" rel="noreferrer" className="border border-line hover:border-accent">LinkedIn</Mag><Mag href="https://github.com/aryanvp00" target="_blank" rel="noreferrer" className="border border-line hover:border-accent">GitHub</Mag></div>
    </Sec>
    <footer className="mx-auto max-w-6xl border-t border-line px-5 py-8 text-sm text-mute md:px-8"><p>Aryan Sharma, Noida / Delhi NCR.</p></footer>
  </>
}

export default function App(){
  useEffect(()=>{if(matchMedia('(prefers-reduced-motion: reduce)').matches)return
    const l=new Lenis({anchors:{offset:-64}});LEN=l;let f;const raf=t=>{l.raf(t);f=requestAnimationFrame(raf)};f=requestAnimationFrame(raf)
    return()=>{cancelAnimationFrame(f);LEN=null;l.destroy()}},[])
  return <><Chrome/><main><Hero/><Showup/><Teardown/><Rest/></main></>
}
