'use client';
import {useEffect,useRef,type RefObject} from 'react';
export default function useDialogFocus(ref:RefObject<HTMLElement|null>,open:boolean,onClose:()=>void){
 const close=useRef(onClose);close.current=onClose;
 useEffect(()=>{
  if(!open||!ref.current)return;
  const previous=document.activeElement as HTMLElement|null,root=ref.current;
  root.focus();
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){e.preventDefault();close.current();return;}
   if(e.key!=='Tab')return;
   const controls=Array.from(root.querySelectorAll<HTMLElement>('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')).filter(el=>el.getClientRects().length>0);
   const first=controls[0],last=controls[controls.length-1];
   if(!first){e.preventDefault();root.focus();}
   else if(e.shiftKey&&(document.activeElement===first||document.activeElement===root)){e.preventDefault();last.focus();}
   else if(!e.shiftKey&&(document.activeElement===last||!root.contains(document.activeElement))){e.preventDefault();first.focus();}
  };
  const focus=(e:FocusEvent)=>{if(e.target instanceof Node&&!root.contains(e.target))root.focus();};
  document.addEventListener('keydown',key);document.addEventListener('focusin',focus);
  return()=>{document.removeEventListener('keydown',key);document.removeEventListener('focusin',focus);if(previous?.isConnected)previous.focus();};
 },[open,ref]);
}
