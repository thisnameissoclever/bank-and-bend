'use client';
import {useState} from 'react';
import type {Availability} from '../lib/model';

export default function AvailabilityPanel({status,canEdit,accessLocked=false,onSave}:{status:Availability;canEdit:boolean;accessLocked?:boolean;onSave:(status:Availability)=>Promise<Availability>}){
 const [editing,setEditing]=useState(false),[draft,setDraft]=useState(status),[busy,setBusy]=useState(false),[message,setMessage]=useState('');
 async function save(){setBusy(true);setMessage('');try{const result=await onSave(draft);setDraft(result);setEditing(false);setMessage('Availability saved.')}catch(e){setMessage(e instanceof Error?e.message:'Could not save availability.')}finally{setBusy(false)}}
 return <section className={'availability-panel '+(status.active?'':'is-inactive')} aria-label="Location availability">
  <div className="availability-heading"><b>{status.active?'Active candidate':'Inactive'}</b>{canEdit&&<button className="text-link" onClick={()=>{setDraft({...status,checkedAt:new Date().toLocaleDateString('en-CA',{timeZone:'America/Los_Angeles'})});setEditing(!editing);setMessage('')}}>{editing?'Cancel':'Edit availability'}</button>}</div>
  <p>{status.reason}</p><small>Checked {status.checkedAt}{status.nextReviewAt?' · Review due '+status.nextReviewAt:''}{status.inactiveFrom?' · Inactive from '+status.inactiveFrom:''}</small>
  {status.sourceUrls.length>0&&<div className="availability-sources">{status.sourceUrls.map((url,i)=><a key={url} href={url} target="_blank" rel="noopener noreferrer">Status source {i+1}</a>)}</div>}
  {editing&&<div className="journal-form availability-form">
   <label className="journal-toggle"><b>Active candidate</b><input type="checkbox" disabled={accessLocked} checked={draft.active} onChange={e=>setDraft({...draft,active:e.target.checked})}/></label>
   {accessLocked&&<p className="field-help">A corrected parking-to-bank access review is required before this location can become active.</p>}
   <label className="field-label">Reason<textarea rows={3} maxLength={1600} value={draft.reason} onChange={e=>setDraft({...draft,reason:e.target.value})} placeholder="What makes this bank available or unavailable?"/></label>
   <div className="availability-dates"><label className="field-label">Checked<input type="date" value={draft.checkedAt} onChange={e=>setDraft({...draft,checkedAt:e.target.value})}/></label><label className="field-label">Review due<input type="date" value={draft.nextReviewAt??''} onChange={e=>setDraft({...draft,nextReviewAt:e.target.value||undefined})}/></label></div>
   <label className="field-label">Scheduled closure<input type="date" value={draft.inactiveFrom??''} onChange={e=>setDraft({...draft,inactiveFrom:e.target.value||undefined})}/><small>Clear this date when a new reopening is confirmed.</small></label>
   <label className="field-label">Sources, one URL per line<textarea rows={3} value={draft.sourceUrls.join('\n')} onChange={e=>setDraft({...draft,sourceUrls:e.target.value.split('\n').map(x=>x.trim()).filter(Boolean)})}/></label>
   <button className="primary-button" disabled={busy||!draft.reason.trim()} onClick={()=>void save()}>{busy?'Saving…':'Save availability'}</button>
  </div>}
  {message&&<p role="status">{message}</p>}
 </section>
}
