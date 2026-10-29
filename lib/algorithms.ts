export type Algorithm = 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK';
export type Direction = 'left' | 'right';
export type VisitKind = 'request' | 'boundary' | 'wrap';
export interface TraceStep { position:number; kind:VisitKind; serviced:number[]; direction:Direction; distance:number; cumulative:number; note:string }
export interface DiskConfig { queue:number[]; head:number; min:number; max:number; direction:Direction }
export interface Trace { algorithm:Algorithm; steps:TraceStep[]; serviceOrder:number[]; totalMovement:number; directionChanges:number }
export const ALGORITHMS:Algorithm[]=['FCFS','SSTF','SCAN','C-SCAN','LOOK','C-LOOK'];
export function validateConfig(c:DiskConfig):string[]{
 const errors:string[]=[];
 if(!Number.isInteger(c.min)||!Number.isInteger(c.max)||c.min<0||c.max<=c.min)errors.push('Disk bounds must be integers and maximum must exceed minimum.');
 if(!Number.isInteger(c.head)||c.head<c.min||c.head>c.max)errors.push('Initial head must be within disk bounds.');
 if(c.queue.some(n=>!Number.isInteger(n)||n<c.min||n>c.max))errors.push('Every request must be an integer within disk bounds.');
 if(c.queue.length>100)errors.push('Use at most 100 requests per experiment.');
 return errors;
}
export function schedule(algorithm:Algorithm,c:DiskConfig):Trace{
 const errors=validateConfig(c);if(errors.length)throw new Error(errors.join(' '));
 const pending=c.queue.map((position,id)=>({position,id}));const steps:TraceStep[]=[];const serviceOrder:number[]=[];
 let pos=c.head,dir=c.direction,total=0,directionChanges=0;
 const visit=(next:number,kind:VisitKind,note:string,countDistance=true)=>{
  const distance=countDistance?Math.abs(next-pos):0;total+=distance;pos=next;
  const serviced:number[]=[];
  if(kind==='request'){for(let i=pending.length-1;i>=0;i--)if(pending[i].position===next){serviced.unshift(pending[i].position);pending.splice(i,1)}serviceOrder.push(...serviced)}
  steps.push({position:pos,kind,serviced,direction:dir,distance,cumulative:total,note});
 };
 const serve=(p:number,note='Service request')=>visit(p,'request',note);
 const unique=(items:{position:number;id:number}[],ascending:boolean)=>[...new Set(items.map(x=>x.position))].sort((a,b)=>ascending?a-b:b-a);
 const serviceAtHead=()=>{if(pending.some(r=>r.position===pos))serve(pos,'Service request at initial/current head position')};
 if(algorithm==='FCFS'){for(const r of c.queue)serve(r,'FCFS arrival order');return{algorithm,steps,serviceOrder,totalMovement:total,directionChanges}}
 if(algorithm==='SSTF'){
  while(pending.length){pending.sort((a,b)=>Math.abs(a.position-pos)-Math.abs(b.position-pos)||a.position-b.position||a.id-b.id);serve(pending[0].position,'Nearest outstanding request; ties choose lower cylinder')}
  return{algorithm,steps,serviceOrder,totalMovement:total,directionChanges}
 }
 serviceAtHead();
 const scanDirection=(side:Direction)=>{
  const asc=side==='right';const values=unique(pending.filter(r=>asc?r.position>pos:r.position<pos),asc);
  for(const p of values)serve(p);
 };
 const hasOtherSide=()=>pending.some(r=>dir==='right'?r.position<pos:r.position>pos);
 scanDirection(dir);
 const circular=algorithm==='C-SCAN'||algorithm==='C-LOOK';
 const usesBoundary=algorithm==='SCAN'||algorithm==='C-SCAN';
 if(usesBoundary){
  const boundary=dir==='right'?c.max:c.min;
  if(pos!==boundary)visit(boundary,'boundary',`Travel to physical ${dir==='right'?'upper':'lower'} boundary`);
 }
 if(hasOtherSide()){
  if(circular){
   const wrapTarget=algorithm==='C-SCAN'?(dir==='right'?c.min:c.max):(dir==='right'?Math.max(...pending.map(r=>r.position)):Math.min(...pending.map(r=>r.position)));
   if(pos!==wrapTarget)visit(wrapTarget,'wrap','Circular wrap; excluded from physical movement',false);
   const values=unique(pending.filter(r=>dir==='right'?r.position<=wrapTarget:r.position>=wrapTarget),dir==='left');
   for(const p of values)serve(p);
  }else{
   dir=dir==='right'?'left':'right';directionChanges++;scanDirection(dir);
  }
 }
 return{algorithm,steps,serviceOrder,totalMovement:total,directionChanges};
}
