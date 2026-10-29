export type Algorithm = 'FCFS' | 'SSTF' | 'SCAN' | 'C-SCAN' | 'LOOK' | 'C-LOOK';
export type Direction = 'left' | 'right';
export type VisitKind = 'request' | 'boundary' | 'wrap';
export interface TraceStep {
  position: number;
  kind: VisitKind;
  serviced: number[];
  direction: Direction;
  distance: number;
  cumulative: number;
  note: string;
}
export interface DiskConfig {
  queue: number[];
  head: number;
  min: number;
  max: number;
  direction: Direction;
}
export interface Trace {
  algorithm: Algorithm;
  steps: TraceStep[];
  serviceOrder: number[];
  totalMovement: number;
  directionChanges: number;
}
const abs = (n: number) => Math.abs(n);
export function validateConfig(c: DiskConfig): string[] {
  const errors: string[] = [];
  if (!Number.isInteger(c.min) || !Number.isInteger(c.max) || c.min < 0 || c.max <= c.min) errors.push('Disk bounds must be integers and maximum must exceed minimum.');
  if (!Number.isInteger(c.head) || c.head < c.min || c.head > c.max) errors.push('Initial head must be within disk bounds.');
  if (c.queue.some(n => !Number.isInteger(n) || n < c.min || n > c.max)) errors.push('Every request must be an integer within disk bounds.');
  if (c.queue.length > 100) errors.push('Use at most 100 requests per experiment.');
  return errors;
}
export function schedule(algorithm: Algorithm, config: DiskConfig): Trace {
  const errors = validateConfig(config);
  if (errors.length) throw new Error(errors.join(' '));
  const { min, max, head, direction } = config;
  const pending = config.queue.map((position, id) => ({ position, id }));
  const steps: TraceStep[] = [];
  const serviceOrder: number[] = [];
  let pos = head, dir = direction, cumulative = 0, directionChanges = 0;
  const visit = (next: number, kind: VisitKind, note: string, service = true, countDistance = true) => {
    const distance = countDistance ? abs(next - pos) : 0;
    cumulative += distance;
    pos = next;
    const serviced: number[] = [];
    if (service) {
      for (let i = pending.length - 1; i >= 0; i--) {
        if (pending[i].position === next) {
          serviced.unshift(pending[i].position);
          pending.splice(i, 1);
        }
      }
      serviceOrder.push(...serviced);
    }
    steps.push({ position: pos, kind, serviced, direction: dir, distance, cumulative, note });
  };
  const serve = (p: number, note = 'Service request') => visit(p, 'request', note, true);
  if (algorithm === 'FCFS') {
    for (const req of config.queue) serve(req, 'Requests are served in arrival order');
  } else if (algorithm === 'SSTF') {
    while (pending.length) {
      pending.sort((a,b) => abs(a.position-pos)-abs(b.position-pos) || a.position-b.position || a.id-b.id);
      serve(pending[0].position, 'Nearest request; ties choose the lower cylinder');
    }
  } else {
    const left = () => pending.filter(r=>r.position < pos).map(r=>r.position).sort((a,b)=>b-a);
    const right = () => pending.filter(r=>r.position > pos).map(r=>r.position).sort((a,b)=>a-b);
    const atHead = () => pending.some(r=>r.position === pos) && serve(pos, 'Request at current head position');
    atHead();
    if (dir === 'right') {
      for (const p of right()) serve(p);
      if (algorithm === 'SCAN' || algorithm === 'C-SCAN') {
        if (pos !== max) visit(max, 'boundary', 'Travel to physical upper boundary', false);
      }
      if (left().length) {
        if (algorithm === 'C-SCAN' || algorithm === 'C-LOOK') {
          dir = 'left';
          const wrapTarget = algorithm === 'C-SCAN' ? min : Math.max(...pending.map(r=>r.position));
          if (pos !== wrapTarget) visit(wrapTarget, 'wrap', 'Circular wrap; excluded from physical movement', false, false);
          const sorted = pending.filter(r=>r.position <= wrapTarget).map(r=>r.position).sort((a,b)=>b-a);
          for (const p of sorted) serve(p);
        } else {
          dir = 'left'; directionChanges++;
          const sorted = pending.map(r=>r.position).filter(p=>p < pos).sort((a,b)=>b-a);
          for (const p of sorted) serve(p);
        }
      }
    } else {
      for (const p of left()) serve(p);
      if (algorithm === 'SCAN' || algorithm === 'C-SCAN') {
        if (pos !== min) visit(min, 'boundary', 'Travel to physical lower boundary', false);
      }
      if (right().length) {
        if (algorithm === 'C-SCAN' || algorithm === 'C-LOOK') {
          dir = 'right';
          const wrapTarget = algorithm === 'C-SCAN' ? max : Math.min(...pending.map(r=>r.position));
          if (pos !== wrapTarget) visit(wrapTarget, 'wrap', 'Circular wrap; excluded from physical movement', false, false);
          const sorted = pending.filter(r=>r.position >= wrapTarget).map(r=>r.position).sort((a,b)=>a-b);
          for (const p of sorted) serve(p);
        } else {
          dir = 'right'; directionChanges++;
          const sorted = pending.map(r=>r.position).filter(p=>p > pos).sort((a,b)=>a-b);
          for (const p of sorted) serve(p);
        }
      }
    }
  }
  return { algorithm, steps, serviceOrder, totalMovement: cumulative, directionChanges };
}
export const ALGORITHMS: Algorithm[] = ['FCFS','SSTF','SCAN','C-SCAN','LOOK','C-LOOK'];
