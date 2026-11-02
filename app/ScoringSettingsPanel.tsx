'use client';
import {useEffect,useRef} from 'react';
import {X} from 'lucide-react';
import {SCORE_LABELS,WEIGHTS} from '../lib/model';
import type {ScoreKey,ScoreWeights} from '../lib/model';
import {SCORE_DEFINITIONS} from '../lib/score-definitions';

type Props={weights:ScoreWeights;state:string;error:string;conflict:boolean;onChange:(weights:ScoreWeights)=>void;onRetry:()=>void;onReload:()=>void;onClose:()=>void};
export default function ScoringSettingsPanel(p:Props){
 const panel=useRef<HTMLElement>(null),close=useRef(p.onClose);close.current=p.onClose;
 useEffect(()=>{
  const previous=document.activeElement as HTMLElement|null;
  panel.current?.querySelector<HTMLButtonElement>('button')?.focus();
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){event.preventDefault();close.current();return;}
   if(event.key!=='Tab')return;
   const controls=Array.from(panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),a[href]')??[]);
   const first=controls[0],last=controls[controls.length-1];
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  };
  document.addEventListener('keydown',key);return()=>{document.removeEventListener('keydown',key);previous?.focus();};
 },[]);
 return <div className="modal-backdrop" onClick={p.onClose}><section ref={panel} className="research-modal scoring-settings" role="dialog" aria-modal="true" aria-label="Scoring settings" onClick={e=>e.stopPropagation()}>
  <button className="modal-close icon-button" aria-label="Close scoring settings" onClick={p.onClose}><X size={20}/></button>
  <div className="eyebrow">OWNER SETTINGS</div><h2>What matters to you?</h2>
  <p>Each bar sets an independent importance from 0 to 100. Two settings at 80 have equal influence. The calculation divides each setting by the total for the scores available at that location.</p>
  <p>Changes update the map and rankings immediately, then save across the site. Only your signed-in owner account can edit these settings.</p>
  <div className="scoring-save-state" role="status"><b>{p.state}</b>{p.error&&<p>{p.error}</p>}{p.error&&(p.conflict||p.state==='Settings unavailable'?<button onClick={p.onReload}>Load saved settings</button>:p.state==='Changes are unsaved'?<button onClick={p.onRetry}>Retry saving</button>:null)}</div>
  <button className="text-link" disabled={p.conflict} onClick={()=>p.onChange({...WEIGHTS})}>Restore starting baseline</button>
  {Object.entries(SCORE_LABELS).map(([key,label])=>{const k=key as ScoreKey;return <div className="importance-setting" key={k}>
   <div><label htmlFor={'importance-'+k}>{label}</label><output htmlFor={'importance-'+k}>{p.weights[k]}%</output></div>
   <p id={'importance-description-'+k}>{SCORE_DEFINITIONS[k].description}</p>
   <input id={'importance-'+k} aria-label={label+' importance'} aria-describedby={'importance-description-'+k} type="range" disabled={p.conflict} min="0" max="100" step="1" value={p.weights[k]} onChange={e=>p.onChange({...p.weights,[k]:Number(e.target.value)})}/>
   <div className="importance-endpoints"><span>0% · Ignore</span><span>100% · Highest importance</span></div>
  </div>;})}
  <p>A missing score shows “?” and contributes no weight. Severe physical-space or water-control limits still cap overall fit. The score details explain each cap.</p>
 </section></div>;
}
