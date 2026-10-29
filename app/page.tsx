'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ALGORITHMS, schedule, type Algorithm, type Direction } from '@/lib/algorithms';

const initialQueue = [98, 183, 37, 122, 14, 124, 65, 67];
export default function Home() {
  const [algorithm,setAlgorithm] = useState<Algorithm>('SCAN');
  const [head,setHead] = useState(53);
  const [queueText,setQueueText] = useState(initialQueue.join(', '));
  const [direction,setDirection] = useState<Direction>('right');
  const [min,setMin] = useState(0);
  const [max,setMax] = useState(199);
  const parsed = queueText.split(',').map(v=>v.trim()).filter(Boolean).map(Number);
  const result = useMemo(()=>{try{return {trace:schedule(algorithm,{queue:parsed,head,min,max,direction}),error:''}}catch(e){return {trace:null,error:e instanceof Error?e.message:'Invalid configuration'}}},[algorithm,head,queueText,direction,min,max]);
  const trace = result.trace;
  const randomize=()=>setQueueText(Array.from({length:8},()=>Math.floor(Math.random()*(max-min+1))+min).join(', '));
  return <div>
    <div className="topline"><span>OPERATING SYSTEMS / PBL LAB</span><span className="online"><i className="dot"/> LOCAL SIMULATION</span></div>
    <div className="eyebrow">INTERACTIVE LEARNING ENVIRONMENT</div>
    <section className="hero">
      <div className="panel hero-main"><div className="kicker">SEEKLAB / 01</div><h1>Understand the movement.<br/>Master the algorithm.</h1><p className="lede">Explore how operating systems order disk I/O requests. Experiment with six scheduling strategies, follow every cylinder movement, and learn why the same queue can produce very different seek paths.</p><div className="actions"><Link className="btn" href="#lab">Open the laboratory ↗</Link><Link className="btn secondary" href="/learn">Start learning</Link></div></div>
      <div className="panel"><div className="eyebrow">THE CORE IDEA</div><h2 style={{marginTop:14}}>One queue. Six paths.</h2><p className="muted">Disk scheduling decides which pending request the read/write head services next. Less movement can reduce seek time on traditional hard drives, but no single algorithm wins for every workload.</p><div className="metrics"><div className="metric"><span>ALGORITHMS</span><strong>06</strong></div><div className="metric"><span>INPUT</span><strong>01</strong></div><div className="metric"><span>API KEYS</span><strong>0</strong></div></div><p className="muted">Everything runs locally in your browser. No account or backend required.</p></div>
    </section>
    <div className="eyebrow">CHOOSE YOUR NEXT STEP</div>
    <section className="grid3">
      <Link href="/learn" className="feature"><div className="num">01 / LEARN</div><h3 style={{marginTop:12}}>Build the mental model</h3><p>Move from tracks and cylinders to the decisions each algorithm makes.</p></Link>
      <Link href="#lab" className="feature"><div className="num">02 / EXPERIMENT</div><h3 style={{marginTop:12}}>Change the workload</h3><p>Adjust the head, queue, bounds, and direction to observe a new trace.</p></Link>
      <Link href="/compare" className="feature"><div className="num">03 / COMPARE</div><h3 style={{marginTop:12}}>Evaluate the trade-offs</h3><p>Compare movement totals without confusing a single result with universal performance.</p></Link>
    </section>
    <div id="lab" className="eyebrow">LIVE EXPERIMENT / DEFAULT WORKLOAD</div><h2 style={{marginTop:10}}>Disk scheduling laboratory</h2><p className="muted">Try the controls below. The trace and movement metrics recalculate from the selected algorithm.</p>
    <div className="workspace">
      <div>
        <div className="panel viz"><div style={{display:'flex',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}><div><div className="eyebrow">CYLINDER TRACE</div><h2 style={{marginTop:8}}>Head movement</h2></div><span className="pill">{algorithm}</span></div>
          <div style={{height:170,position:'relative',margin:'18px 4px 0'}}>
            <div style={{position:'absolute',top:76,left:0,right:0,height:2,background:'#33434b'}}/>
            {Array.from({length:11},(_,i)=>{const n=min+(max-min)*i/10;return <div key={i} style={{position:'absolute',left:(i*10)+'%',top:62,transform:'translateX(-50%)',textAlign:'center',fontSize:10,color:'#82929e'}}><div style={{height:29,width:1,background:'#43535c',margin:'0 auto 5px'}}/>{Math.round(n)}</div>})}
            {parsed.map((n,i)=><div key={i} title={'Request '+n} style={{position:'absolute',left:Math.max(0,Math.min(100,(n-min)/(max-min)*100))+'%',top:Math.floor(i%3)*19+10,transform:'translateX(-50%)',width:10,height:10,borderRadius:'50%',background:'#55dec8',border:'2px solid #0d1518',boxShadow:'0 0 0 1px #55dec8'}}/>)}
            {trace?.steps.map((s,i)=><div key={i} title={s.note+' at '+s.position} style={{position:'absolute',left:Math.max(0,Math.min(100,(s.position-min)/(max-min)*100))+'%',top:113+(i%2)*20,transform:'translateX(-50%)',width:8,height:8,borderRadius:2,background:s.kind==='wrap'?'#a69aff':s.kind==='boundary'?'#f4b860':'#f2f7f7'}}/>)}
          </div>
          <div className="queue"><span className="chip">● request</span><span className="chip">■ physical visit</span><span className="chip" style={{color:'var(--violet)'}}>■ circular wrap</span></div>
          <p className="muted">Conceptual cylinder axis. Each marker reflects the configured queue and computed trace; the drawing is not a hardware performance simulation.</p>
        </div>
        <div className="panel" style={{marginTop:14}}><div style={{display:'flex',justifyContent:'space-between',gap:10,flexWrap:'wrap'}}><h2>Execution trace</h2><span className="pill">{trace?.steps.length??0} visits</span></div>
          {result.error?<p style={{color:'#ff9c9c'}}>{result.error}</p>:<div style={{overflowX:'auto'}}><table className="trace"><thead><tr><th>STEP</th><th>CYLINDER</th><th>EVENT</th><th>MOVE</th><th>TOTAL</th></tr></thead><tbody>{trace?.steps.map((s,i)=><tr key={i}><td className="mono">{String(i+1).padStart(2,'0')}</td><td className="mono">{s.position}</td><td>{s.kind==='wrap'?'Circular wrap':s.kind==='boundary'?'Boundary visit':s.serviced.length?'Request serviced':'Head visit'}</td><td className="mono">{s.distance}</td><td className="mono">{s.cumulative}</td></tr>)}</tbody></table></div>}
        </div>
      </div>
      <aside className="panel"><div className="eyebrow">CONFIGURATION</div><div className="field"><label htmlFor="algorithm">Scheduling algorithm</label><select id="algorithm" value={algorithm} onChange={e=>setAlgorithm(e.target.value as Algorithm)}>{ALGORITHMS.map(a=><option key={a}>{a}</option>)}</select></div>
        <div className="field"><label htmlFor="head">Initial head cylinder</label><input id="head" type="number" value={head} min={min} max={max} onChange={e=>setHead(Number(e.target.value))}/></div>
        <div className="field"><label htmlFor="queue">Request queue (comma-separated)</label><input id="queue" value={queueText} onChange={e=>setQueueText(e.target.value)} /></div>
        <div className="actions" style={{marginTop:4}}><button className="btn secondary" onClick={randomize}>Generate queue ↻</button><button className="btn secondary" onClick={()=>{setQueueText(initialQueue.join(', '));setHead(53);setMin(0);setMax(199);setDirection('right');setAlgorithm('SCAN')}}>Reset</button></div>
        <div className="field"><label htmlFor="direction">Initial direction</label><select id="direction" value={direction} onChange={e=>setDirection(e.target.value as Direction)}><option value="right">Right / increasing</option><option value="left">Left / decreasing</option></select></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:9}}><div className="field"><label htmlFor="min">Min cylinder</label><input id="min" type="number" value={min} onChange={e=>setMin(Number(e.target.value))}/></div><div className="field"><label htmlFor="max">Max cylinder</label><input id="max" type="number" value={max} onChange={e=>setMax(Number(e.target.value))}/></div></div>
        <div className="eyebrow" style={{marginTop:22}}>LIVE METRICS</div>
        <div className="metrics" style={{gridTemplateColumns:'1fr 1fr'}}><div className="metric"><span>TOTAL MOVEMENT</span><strong>{trace?.totalMovement??'—'}</strong></div><div className="metric"><span>REQUESTS SERVICED</span><strong>{trace?.serviceOrder.length??'—'}</strong></div><div className="metric"><span>DIRECTION CHANGES</span><strong>{trace?.directionChanges??'—'}</strong></div><div className="metric"><span>AVG / REQUEST</span><strong>{trace&&trace.serviceOrder.length?(trace.totalMovement/trace.serviceOrder.length).toFixed(1):'0'}</strong></div></div>
        <div className="eyebrow">SERVICE ORDER</div><div className="queue">{trace?.serviceOrder.map((n,i)=><span className="chip" key={i}>{n}</span>)}</div><p className="muted">Average movement = counted physical movement divided by requests serviced. Circular wrap jumps are excluded from the physical total.</p>
      </aside>
    </div>
    <div className="footer-note">SeekLab is a client-side educational project. It models logical cylinder movement only; real storage latency also depends on rotational latency, transfer time, caching, firmware, and device characteristics.</div>
  </div>;
}
