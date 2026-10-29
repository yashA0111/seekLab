# SeekLab — Interactive Disk Scheduling Laboratory

**Understand the movement. Master the algorithm.**

SeekLab is a client-side educational application for exploring six classic operating-system disk scheduling algorithms with interactive configuration, trace tables, movement metrics, comparison charts, lessons, and practice questions.

## Features

- FCFS, SSTF, SCAN, C-SCAN, LOOK, and C-LOOK algorithm engine
- Editable request queue, initial head, cylinder bounds, and initial direction
- Calculated movement totals and explicit trace events
- Algorithm comparison on identical input configuration
- Progressive lessons, knowledge checks, and academic project overview
- Responsive dark interface; no backend, database, authentication, or API key required

## Run locally

Requirements: Node.js 20.9+ (Node 22 recommended) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm test
npm run lint
npm run build
```

## Modeling conventions

- Cylinder numbers are integer logical positions in the inclusive configured range.
- SSTF ties choose the lower cylinder number.
- SCAN and C-SCAN travel to the relevant physical disk boundary before reversing or wrapping. Boundary visits are not request service events.
- LOOK and C-LOOK turn or wrap at the last outstanding request in the current direction.
- Circular wrap is a logical discontinuity and is marked explicitly; its distance is excluded from physical movement totals.
- Movement is calculated from trace step distances, which use absolute differences between consecutive physical head positions.
- This is a conceptual seek-movement model, not a hardware benchmark. It does not simulate rotational latency, transfer time, caching, firmware, or real-device performance.

## Routes

- `/` dashboard and live experiment
- `/learn` guided lessons
- `/lab` laboratory entry point
- `/compare` side-by-side algorithm comparison
- `/practice` knowledge checks
- `/about` academic project context and glossary

## Academic references

- Abraham Silberschatz, Peter B. Galvin, and Greg Gagne, *Operating System Concepts*.
- William Stallings, *Operating Systems: Internals and Design Principles*.
- Linux kernel documentation, block layer: https://docs.kernel.org/block/

Verify bibliographic editions against the materials prescribed by your course.
