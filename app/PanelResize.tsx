'use client';
import {useEffect,useState} from 'react';
import type {CSSProperties,KeyboardEvent,PointerEvent} from 'react';
type Layout={left:number;right:number;height:number};
const INITIAL:Layout={left:370,right:418,height:88};
export function usePanelLayout(){
 const [layout,setLayout]=useState(INITIAL),[loaded,setLoaded]=useState(false),[viewport,setViewport]=useState(1440);
 useEffect(()=>{try{const value=JSON.parse(localStorage.getItem('bank-bend-layout-v1')||'{}');setLayout({left:Number.isFinite(value.left)?Math.max(260,Math.min(640,value.left)):370,right:Number.isFinite(value.right)?Math.max(300,Math.min(720,value.right)):418,height:Number.isFinite(value.height)?Math.max(40,Math.min(92,value.height)):88})}catch{}setLoaded(true);const measure=()=>setViewport(window.innerWidth);measure();window.addEventListener('resize',measure);return()=>window.removeEventListener('resize',measure)},[]);
 useEffect(()=>{if(loaded)try{localStorage.setItem('bank-bend-layout-v1',JSON.stringify(layout))}catch{}},[layout,loaded]);
 const width=(side:'left'|'right')=>Math.min(layout[side],viewport<=760?viewport-24:Math.max(side==='left'?260:300,viewport*(side==='left'?.4:.48)));
 return {style:{'--sidebar-width':width('left')+'px','--detail-width':width('right')+'px','--detail-height':layout.height+'%'} as CSSProperties,handle:(side:'left'|'right'|'height')=><PanelResize viewport={viewport} side={side} value={side==='height'?layout.height:width(side)} onChange={value=>setLayout(p=>({...p,[side]:value}))}/>};
}
function PanelResize({side,value,onChange,viewport}:{viewport:number;side:'left'|'right'|'height';value:number;onChange:(n:number)=>void}){
 const vertical=side==='height';
 const min=vertical?40:side==='left'?260:300;
 const max=vertical?92:viewport<=760?viewport-24:Math.max(min,Math.min(side==='left'?640:720,viewport*(side==='left'?.4:.48)));
 const clamp=(n:number)=>Math.round(Math.max(Math.min(min,max),Math.min(max,n)));
 function pointer(e:PointerEvent<HTMLDivElement>){e.preventDefault();const target=e.currentTarget,start=vertical?e.clientY:e.clientX,initial=value;target.setPointerCapture(e.pointerId);const move=(event:globalThis.PointerEvent)=>{const delta=(vertical?event.clientY:event.clientX)-start;onChange(clamp(initial+(side==='left'?delta:vertical?-delta/window.innerHeight*100:-delta)))};const stop=()=>{target.removeEventListener('pointermove',move);target.removeEventListener('pointerup',stop);target.removeEventListener('pointercancel',stop);target.removeEventListener('lostpointercapture',stop)};target.addEventListener('pointermove',move);target.addEventListener('pointerup',stop);target.addEventListener('pointercancel',stop);target.addEventListener('lostpointercapture',stop);}
 function keyboard(e:KeyboardEvent){let next=value;const step=vertical?3:20;if(e.key==='Home')next=min;else if(e.key==='End')next=max;else if(e.key===(vertical?'ArrowUp':side==='left'?'ArrowRight':'ArrowLeft'))next+=step;else if(e.key===(vertical?'ArrowDown':side==='left'?'ArrowLeft':'ArrowRight'))next-=step;else return;e.preventDefault();onChange(clamp(next));}
 return <div className={'panel-resize resize-'+side} role="separator" tabIndex={0} aria-label={vertical?'Resize details height':side==='left'?'Resize locations panel':'Resize details panel'} aria-orientation={vertical?'horizontal':'vertical'} aria-valuemin={min} aria-valuemax={Math.round(max)} aria-valuenow={Math.round(value)} aria-valuetext={Math.round(value)+(vertical?' percent high':' pixels wide')} onPointerDown={pointer} onKeyDown={keyboard} title="Drag to resize, or use arrow keys"><i/></div>;
}
