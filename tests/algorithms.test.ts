import { describe, expect, it } from 'vitest';
import { schedule, validateConfig, type Algorithm, type DiskConfig } from '../lib/algorithms';
const config:DiskConfig={queue:[98,183,37,122,14,124,65,67],head:53,min:0,max:199,direction:'right'};
describe('disk scheduling engine',()=>{
 it('preserves arrival order for FCFS',()=>expect(schedule('FCFS',config).serviceOrder).toEqual(config.queue));
 it('uses deterministic lower-cylinder tie breaking for SSTF',()=>{
  const t=schedule('SSTF',{...config,head:50,queue:[40,60]});
  expect(t.serviceOrder[0]).toBe(40);
 });
 it('handles empty request queues',()=>{for(const a of ['FCFS','SSTF','SCAN','C-SCAN','LOOK','C-LOOK'] as Algorithm[]){expect(schedule(a,{...config,queue:[]}).serviceOrder).toEqual([])}});
 it('services duplicate requests without losing multiplicity',()=>expect(schedule('SSTF',{...config,queue:[70,70,70]}).serviceOrder).toEqual([70,70,70]));
 it('rejects requests outside disk bounds',()=>expect(validateConfig({...config,queue:[200]}).length).toBeGreaterThan(0));
 it('derives cumulative movement from step distances',()=>{for(const a of ['FCFS','SSTF','SCAN','C-SCAN','LOOK','C-LOOK'] as Algorithm[]){const t=schedule(a,config);expect(t.steps.reduce((n,s)=>n+s.distance,0)).toBe(t.totalMovement);expect(t.steps.at(-1)?.cumulative??0).toBe(t.totalMovement)}});
 it('marks circular wraps as zero-counted physical movement',()=>{for(const a of ['C-SCAN','C-LOOK'] as Algorithm[]){const t=schedule(a,config);for(const s of t.steps.filter(x=>x.kind==='wrap'))expect(s.distance).toBe(0)}});
 it('handles a request at the current head position',()=>{const t=schedule('LOOK',{...config,head:53,queue:[53,60]});expect(t.serviceOrder).toContain(53)});
});
