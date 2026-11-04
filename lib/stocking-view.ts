import type {StockingEvent,StockingReview} from './stocking.ts';

export type StockingSize='catchable'|'young'|'unknown';
export type StockingOptions={days:number;sizes:StockingSize[];species:string[];sort:string};
export const DEFAULT_STOCKING:StockingOptions={days:0,sizes:['catchable'],species:[],sort:'recent'};
export const STOCKING_DAYS=[0,7,14,30,60,90,180,365];
export const STOCKING_SIZES:StockingSize[]=['catchable','young','unknown'];
export function normalizeStocking(input:unknown):StockingOptions{
 const x=(input&&typeof input==='object'?input:{}) as Partial<StockingOptions>;
 return {days:STOCKING_DAYS.includes(x.days??-1)?x.days!:0,sizes:Array.isArray(x.sizes)?[...new Set(x.sizes.filter(s=>STOCKING_SIZES.includes(s)))]:['catchable'],species:Array.isArray(x.species)?[...new Set(x.species.filter(s=>typeof s==='string'&&s.length<=80))].slice(0,40):[],sort:typeof x.sort==='string'&&['recent','overall','drive','name','rating'].includes(x.sort)?x.sort:'recent'};
}
/** Calendar-day arithmetic avoids daylight-saving shifts in Pacific dates. */
export function stockingDaysAgo(date:string,today:string):number|null{
 const valid=(value:string)=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value;
 if(!valid(date)||!valid(today))return null;
 const days=Math.round((Date.parse(today)-Date.parse(date))/86400000);
 return days>=0?days:null;
}
export function stockingSpecies(species:string):string{
 const value=species.trim().toLowerCase();
 return ['rainbow','brown','cutthroat','brook','tiger'].includes(value)?value+' trout':value;
}
export function stockingSize(event:StockingEvent):StockingSize{
 const text=`${event.lifeStage??''} ${event.size??''}`.toLowerCase();
 if(/fry|fingerling|smolt|juvenile/.test(text))return 'young';
 if(/legal|catchable|jumbo|brood|adult|trophy/.test(text))return 'catchable';
 return 'unknown';
}
function matchesEvent(event:StockingEvent,options:StockingOptions):boolean{
 return (!options.sizes.length||options.sizes.includes(stockingSize(event)))&&(!options.species.length||options.species.includes(stockingSpecies(event.species)));
}
/** A historical delivery alone never qualifies a discontinued stocking program. */
export function activelyStocked(review:StockingReview|undefined,today:string):boolean{
 if(!review||review.status==='discontinued')return false;
 return review.events.some(event=>{
  if(event.quantity===0)return false;
  if(event.status==='confirmed'){const days=stockingDaysAgo(event.date,today);return days!==null&&days<=365;}
  return (event.through??event.date)>=today&&event.date<=`${Number(today.slice(0,4))+1}${today.slice(4)}`;
 });
}
export function stockingSummary(review:StockingReview|undefined,options:StockingOptions,today:string){
 const events=(review?.events??[]).filter(e=>e.quantity!==0&&matchesEvent(e,options));
 const confirmed=events.filter(e=>e.status==='confirmed'&&stockingDaysAgo(e.date,today)!==null).sort((a,b)=>b.date.localeCompare(a.date));
 const date=confirmed[0]?.date??null;
 // Multiple species or sizes delivered on the same day remain separate rows.
 const latest=confirmed.filter(e=>e.date===date);
 const plans=events.filter(e=>e.status==='scheduled'&&(e.through??e.date)>=today).sort((a,b)=>a.date.localeCompare(b.date));
 const days=date?stockingDaysAgo(date,today):null;
 const qualifies=activelyStocked(review,today)&&(options.days?days!==null&&days<=options.days:confirmed.some(e=>(stockingDaysAgo(e.date,today)??Infinity)<=365)||plans.length>0);
 return {date,days,latest,plans,previous:confirmed.find(e=>e.date!==date)??null,qualifies};
}
export function stockingRecency(days:number|null):string{return days===null?'No confirmed date':days===0?'Today':days===1?'1 day ago':`${days} days ago`;}
export function stockingFlag(review:StockingReview|undefined,options:StockingOptions,today:string):string{
 const s=stockingSummary(review,options,today);return s.days===null?'Planned':s.days===0?'Today':`${s.days}d`;
}
export function stockingFilterCount(options:StockingOptions):number{return Number(options.days>0)+Number(options.sizes.length>0)+Number(options.species.length>0);}
export function recentStockingFirst<T extends {name:string;stocking?:StockingReview}>(spots:T[],options:StockingOptions,today:string):T[]{
 return [...spots].sort((a,b)=>(stockingSummary(a.stocking,options,today).date??'').localeCompare(stockingSummary(b.stocking,options,today).date??'')*-1||a.name.localeCompare(b.name));
}
