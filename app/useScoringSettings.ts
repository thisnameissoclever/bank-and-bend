'use client';
import {useCallback,useEffect,useRef,useState} from 'react';
import {WEIGHTS} from '../lib/model';
import type {ScoreWeights} from '../lib/model';
import type {ScoringSettings} from '../lib/scoring-settings';

export default function useScoringSettings(){
 const [weights,setWeights]=useState<ScoreWeights>({...WEIGHTS}),[canEdit,setCanEdit]=useState(false),[state,setState]=useState('Loading saved settings'),[error,setError]=useState(''),[conflict,setConflict]=useState(false);
 const revision=useRef(0),pending=useRef<ScoreWeights|null>(null),saving=useRef(false),alive=useRef(true),timer=useRef<ReturnType<typeof setTimeout>|null>(null),allowed=useRef(false),loadEpoch=useRef(0);
 const refresh=useCallback(async(force=false)=>{
  if(saving.current||(!force&&pending.current))return;
  const epoch=++loadEpoch.current;
  try{
   const response=await fetch('/api/scoring',{cache:'no-store'});if(!response.ok)throw new Error('Saved scoring settings could not load. Keeping the last loaded values.');
   const data=await response.json() as ScoringSettings&{canEdit:boolean};
   if(!alive.current||epoch!==loadEpoch.current||(!force&&(pending.current||saving.current)))return;
   revision.current=data.revision;allowed.current=data.canEdit;setCanEdit(data.canEdit);
   setWeights(data.weights);setError('');setConflict(false);setState('Saved across the site');
   if(force)pending.current=null;
  }catch(e){if(alive.current&&epoch===loadEpoch.current){setError(e instanceof Error?e.message:'Could not load scoring settings.');setState('Settings unavailable');}}
 },[]);
 const flush=useCallback(async()=>{
  if(saving.current||!pending.current||!allowed.current)return;
  saving.current=true;setState('Saving');setError('');
  try{
   while(pending.current){
    const desired:ScoreWeights=pending.current;
    const response=await fetch('/api/scoring',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({weights:desired,expectedRevision:revision.current})});
    const data=await response.json() as ScoringSettings&{error?:string};
    if(!response.ok){if(response.status===409)setConflict(true);if(response.status===401||response.status===403){allowed.current=false;setCanEdit(false);}throw new Error(data.error??'Settings could not be saved.');}
    revision.current=data.revision;
    if(pending.current===desired)pending.current=null;
   }
   if(alive.current)setState('Saved across the site');
  }catch(e){if(alive.current){setError(e instanceof Error?e.message:'Settings could not be saved.');setState('Changes are unsaved');}}
  finally{saving.current=false;}
 },[]);
 const change=useCallback((next:ScoreWeights)=>{
  if(!allowed.current||conflict)return;
  if(!Object.values(next).some(v=>v>0)){setError('Keep at least one importance setting above zero.');return;}
  loadEpoch.current++;pending.current=next;setWeights(next);setError('');setState('Unsaved changes');
  if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>void flush(),450);
 },[flush,conflict]);
 useEffect(()=>{
  alive.current=true;void refresh();
  const focus=()=>{if(document.visibilityState==='visible')void refresh();};
  const leaving=(event:BeforeUnloadEvent)=>{if(pending.current){event.preventDefault();event.returnValue='';}};
  document.addEventListener('visibilitychange',focus);window.addEventListener('focus',focus);window.addEventListener('beforeunload',leaving);
  const interval=setInterval(()=>{if(document.visibilityState==='visible')void refresh();},300000);
  return()=>{alive.current=false;clearInterval(interval);if(timer.current)clearTimeout(timer.current);document.removeEventListener('visibilitychange',focus);window.removeEventListener('focus',focus);window.removeEventListener('beforeunload',leaving);};
 },[refresh]);
 return {weights,canEdit,state,error,conflict,change,retry:flush,reload:()=>refresh(true)};
}
