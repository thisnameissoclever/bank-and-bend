'use client';
import {CheckCircle2,Clock,CalendarDays,MapPin} from 'lucide-react';
import type {Spot,JournalRecord} from '../lib/model';
import {overall,color,scoreInk,formatScore,availabilityFor,type ScoreWeights} from '../lib/model';
import {stockingSummary,stockingRecency,stockingSpecies,type StockingOptions,type StockingSize} from '../lib/stocking-view';
import FavoriteButton from './FavoriteButton';

function StockingChoices({label,value,options,onChange}:{label:string;value:string[];options:{value:string;label:string}[];onChange:(values:string[])=>void}){
 const selected=options.filter(o=>value.includes(o.value));
 return <details className="stocking-choice"><summary>{selected.length===1?selected[0].label:selected.length?`${label}: ${selected.length}`:`${label}: Any`}</summary><fieldset><legend>{label}</legend><button onClick={()=>onChange([])}>Any</button>{options.map(o=><label key={o.value}><input type="checkbox" checked={value.includes(o.value)} onChange={()=>onChange(value.includes(o.value)?value.filter(v=>v!==o.value):[...value,o.value])}/>{o.label}</label>)}</fieldset></details>;
}
export function StockingControls({value,onChange,species}:{value:StockingOptions;onChange:(patch:Partial<StockingOptions>)=>void;species:string[]}){
 return <div className="stocking-controls"><label>Stocked within<select aria-label="Stocked within" value={value.days} onChange={e=>onChange({days:Number(e.target.value)})}>{[0,7,14,30,60,90,180,365].map(n=><option key={n} value={n}>{n?`${n} days`:'Any time'}</option>)}</select></label><StockingChoices label="Fish size" value={value.sizes} options={[{value:'catchable',label:'Catchable fish'},{value:'young',label:'Fry & fingerlings'},{value:'unknown',label:'Size not reported'}]} onChange={sizes=>onChange({sizes:sizes as StockingSize[]})}/><StockingChoices label="Stocked species" value={value.species} options={species.map(s=>({value:s,label:s[0].toUpperCase()+s.slice(1)}))} onChange={species=>onChange({species})}/></div>;
}
export function StockingCard({spot,options,today,weights,record,selected,onSelect,onHistory,onFavorite,busy,disabled,travel}:{spot:Spot;options:StockingOptions;today:string;weights:ScoreWeights;record:JournalRecord;selected:boolean;onSelect:()=>void;onHistory:()=>void;onFavorite:()=>void;busy:boolean;disabled:boolean;travel:string}){
 const s=stockingSummary(spot.stocking,options,today),score=overall(spot,weights),status=availabilityFor(spot);
 const date=(d:string)=>new Date(d+'T12:00:00Z').toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric',timeZone:'UTC'});
 const eventText=(e:typeof s.latest[number])=>`${e.quantity===null?'Quantity not reported':e.quantity.toLocaleString('en-US')} ${stockingSpecies(e.species)}`;
 return <article className={'location-card stocking-card '+(selected?'selected':'')+(!status.active?' inactive-location':'')}>
  <button className="card-open" aria-label={'View details for '+spot.name} onClick={onSelect}><div className="card-main"><span className="score-badge" style={{background:color(score),color:scoreInk(score)}}>{formatScore(score)}</span><div><h2>{spot.name}</h2><div className="card-location">{spot.state} · {spot.waterType}{record.visited?' · Visited':''}</div></div></div><div className="stocking-card-body"><div className="stocking-recency"><b>{stockingRecency(s.days)}</b>{s.date&&<time dateTime={s.date}>{date(s.date)}</time>}{s.latest.length>0&&<span className="delivery-confirmed"><CheckCircle2 size={14}/>Confirmed</span>}</div>{s.latest.map((e,i)=><div key={i} className="stocking-delivery"><strong>{eventText(e)}</strong>{e.size&&<span>{e.size}</span>}</div>)}{s.previous&&<small>Previous delivery: {eventText(s.previous)} · {date(s.previous.date)}</small>}{s.plans.length>0&&<div className="stocking-plan"><b><CalendarDays size={14}/>Planned: {eventText(s.plans[0])}</b><span>{date(s.plans[0].date)}{s.plans[0].through?' to '+date(s.plans[0].through):''} · Delivery not confirmed</span></div>}<small className="stocking-travel">{travel}</small>{!status.active&&<p className="card-caution">Inactive · {status.reason}</p>}</div></button>
  <div className="stocking-card-actions"><button onClick={onHistory}><Clock size={14}/>Stocking history</button><button onClick={onSelect}><MapPin size={14}/>View spot</button></div><FavoriteButton compact name={spot.name} favorite={record.favorite} busy={busy} disabled={disabled} onClick={onFavorite}/>
 </article>;
}
