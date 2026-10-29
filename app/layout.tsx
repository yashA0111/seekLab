import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'SeekLab — Interactive Disk Scheduling Laboratory',
  description: 'Understand the movement. Master disk scheduling algorithms through interactive experiments.',
};

const nav=[['/','Overview'],['/learn','Learn'],['/lab','Laboratory'],['/compare','Compare'],['/practice','Practice'],['/about','About']];

export default function RootLayout({children}:{children:ReactNode}) {
 return <html lang="en"><body><div className="shell">
  <aside className="sidebar"><Link href="/" className="brand"><span className="brand-mark">◉</span><span><strong>SeekLab</strong><small>DISK SCHEDULING LAB</small></span></Link>
   <div className="nav-label">WORKSPACE</div><nav className="nav" aria-label="Main navigation">{nav.map(([href,label],i)=><Link key={href} href={href} className={i===0?'active':''}><span aria-hidden="true">{['⌂','▤','◉','⇄','✓','ⓘ'][i]}</span>{label}</Link>)}</nav>
   <div className="side-note"><b>Learn through movement.</b>Explore six scheduling strategies with deterministic traces and transparent assumptions.</div>
  </aside><main className="main">{children}</main>
 </div></body></html>;
}
