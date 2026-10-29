'use client';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
import { Suspense } from 'react';

type Props={head?:number;queue?:number[];min?:number;max?:number;path?:number[]};
function Platter({head,queue,min,max,path}:Required<Props>){
 const radius=(c:number)=>1.15+((c-min)/(max-min))*2.35;
 const angle=(c:number)=>((c-min)/(max-min))*Math.PI*1.65-Math.PI*.82;
 const point=(c:number,y:number)=>[Math.cos(angle(c))*radius(c),y,Math.sin(angle(c))*radius(c)] as [number,number,number];
 return <>
  <mesh rotation={[-Math.PI/2,0,0]} position={[0,-.22,0]}><cylinderGeometry args={[3.65,3.65,.18,96]}/><meshStandardMaterial color="#1c2a31" metalness={.72} roughness={.32}/></mesh>
  {Array.from({length:12},(_,i)=><mesh key={i} rotation={[-Math.PI/2,0,0]} position={[0,-.115+i*.0004,0]}><torusGeometry args={[.55+i*.255,.008,6,100]}/><meshStandardMaterial color={i%3===0?'#347e79':'#33444d'} metalness={.5} roughness={.45}/></mesh>)}
  <mesh position={[0,-.05,0]}><cylinderGeometry args={[.42,.42,.42,48]}/><meshStandardMaterial color="#8b9aa4" metalness={.8} roughness={.24}/></mesh>
  <mesh position={[0,.18,0]}><cylinderGeometry args={[.19,.19,.12,48]}/><meshStandardMaterial color="#55dec8" metalness={.6} roughness={.22}/></mesh>
  {queue.map((c,i)=>{const p=point(c,.02+i*.0002);return <group key={i} position={p}><mesh><sphereGeometry args={[.085,16,16]}/><meshStandardMaterial color="#55dec8" emissive="#17483f" emissiveIntensity={.65}/></mesh><Text position={[0,.16,0]} fontSize={.13} color="#dce8eb" anchorX="center" anchorY="middle">{String(c)}</Text></group>})}
  {path.map((c,i)=>{const p=point(c,.09);return <mesh key={i} position={p}><sphereGeometry args={[.055,12,12]}/><meshStandardMaterial color="#a69aff" emissive="#463d85" emissiveIntensity={.7}/></mesh>})}
  {(()=>{const p=point(head,.2);return <group position={p}><mesh><sphereGeometry args={[.14,20,20]}/><meshStandardMaterial color="#f4bc73" emissive="#7a4c1e" emissiveIntensity={.55}/></mesh><Text position={[0,.24,0]} fontSize={.16} color="#ffe0ad" anchorX="center">HEAD {head}</Text></group>})()}
  <mesh position={[0,.08,0]}><torusGeometry args={[.47,.035,8,64]}/><meshStandardMaterial color="#a69aff" metalness={.4}/></mesh>
  <Text position={[0,.22,0]} fontSize={.16} color="#9baab5" anchorX="center">SPINDLE</Text>
 </>;
}
export default function DiskScene({head=53,queue=[98,183,37,122,14,124,65,67],min=0,max=199,path=[]}:Props){
 return <div style={{height:320,width:'100%',borderRadius:12,overflow:'hidden',background:'radial-gradient(ellipse at center,#18292e,#10151a)'}}>
  <Canvas camera={{position:[5.8,6.3,7.4],fov:42}} dpr={[1,1.5]} gl={{antialias:true,alpha:true}}>
   <color attach="background" args={['#10151a']}/><ambientLight intensity={1.15}/><directionalLight position={[4,8,5]} intensity={2.1}/><pointLight position={[-4,3,-4]} intensity={.7} color="#55dec8"/>
   <Suspense fallback={null}><Platter head={head} queue={queue} min={min} max={max} path={path}/></Suspense>
   <OrbitControls enablePan={false} minDistance={5} maxDistance={13} target={[0,0,0]}/>
  </Canvas>
 </div>;
}
