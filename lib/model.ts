import type {StockingReview} from './stocking.ts';
import {seasonAssessment} from './seasonality.ts';
import type {Seasonality,SeasonalOverride} from './seasonality.ts';
export const SCORE_LABELS = {seclusion:'Privacy & space',bankQuantity:'Usable bank',bankQuality:'Casting quality',accessEase:'Ease of access',waterManageability:'Manageable water',scenery:'Scenery',seasonalProspects:'Current-season prospects',evidence:'Research confidence'} as const;
export type ScoreKey=keyof typeof SCORE_LABELS;
export type ScoreValues=Record<ScoreKey,number|null>;
export type Source={id:string;title:string;url:string;checkedAt:string;publishedAt?:string;kind:string;supports:string};
export type Pin={lat:number;lng:number;label:string;confidence:string;notes:string;sourceIds:string[]};
export type AccessAudit={status:'supported'|'unresolved'|'blocked';checkedAt:string;summary:string;parkingVerified:boolean;fishingVerified:boolean;routeVerified:boolean;sourceIds:string[];findings:string[]};
export type Availability={active:boolean;reason:string;checkedAt:string;nextReviewAt?:string;inactiveFrom?:string;sourceUrls:string[];revision?:number};
export type WaterQuality={category?:'fish-consumption'|'cyanobacteria'|'bacteria'|'combined';status:'none-reported'|'none-found'|'caution'|'active'|'unavailable';summary:string;limitation?:string;checkedAt:string;nextReviewAt:string;nextReviewAction:string;sourceIds:string[];sourceUpdatedAt?:string;lastSampleDate?:string};
export type PrivacyReview={checkedAt:string;sourceIds:string[];limitations:string[];physicalSpaceScore:number|null;physicalSpaceReason:string;physicalSpaceReviewedAt?:string};
export type PaidFishing={kind:"catch"|"day-access"|"membership"|"stay";summary:string;checkedAt:string;sourceIds:string[];licenseRequired?:boolean};
export type Spot={paidFishing?:PaidFishing;stocking?:StockingReview;pinGaps?:{parking?:string;fishing?:string};fishingBackground?:string;privacyReview?:PrivacyReview;accessAudit?:AccessAudit;waterQuality?:WaterQuality;seasonality?:Seasonality;seasonalOverride?:SeasonalOverride;seasonalCheckedAt?:string;availability?:Availability;id:string;name:string;generalAreaName?:string;state:'WA'|'OR';waterType:string;waterSpeed:string[];waterSpeedNote?:string;waterSpeedBasis?:'observed'|'inferred';waterSpeedCheckedAt?:string;region:string;lat:number;lng:number;driveMinutes:[number,number]|null;species:string[];description:string;scores:ScoreValues;scoreReasons:Record<ScoreKey,string>;sources:Source[];parking:Pin|null;fishing:Pin|null;visualVerification:{status:string;method:string;notes:string;sourceIds:string[]};walk:{minutes:[number,number]|null;description:string};accessNotes:string;currentStatus:{label:string;summary:string;checkedAt:string};retentionNotes:string;seasonNotes:string;crowdNotes:string;history:{visited:boolean;notes:string;scope?:string};unknowns:string[];researchLog:string[];overallReason?:string;checkedAt?:string};
export type JournalRecord={visited:boolean;rating:number|null;notes:string;lastVisited:string;favorite:boolean;revision:number};
export type Journal=Record<string,JournalRecord>;
export type ScoreWeights=Record<ScoreKey,number>;
export const WEIGHTS:ScoreWeights={seclusion:12,bankQuantity:16,bankQuality:3,accessEase:7,waterManageability:10,scenery:7,evidence:0,seasonalProspects:20};
export const FIT_KEYS=Object.keys(WEIGHTS) as ScoreKey[];
export function normalizeWeights(input:unknown):ScoreWeights{const source=input&&typeof input==='object'?input as Partial<ScoreWeights>:{};const result={...WEIGHTS};for(const k of FIT_KEYS){const v=source[k];if(typeof v==='number'&&Number.isFinite(v)&&v>=0&&v<=100)result[k]=Math.round(v)}return FIT_KEYS.some(k=>result[k]>0)?result:{...WEIGHTS};}
export const WEIGHTS_REVISION=5;
const LEGACY_WEIGHTS={fishProspects:30,seclusion:15,quietness:10,bankQuantity:4,bankQuality:8,accessEase:3,waterManageability:15,scenery:10,evidence:0,seasonalProspects:0,travelFit:3,speciesFit:2};
export function normalizeSavedWeights(input:unknown,revision?:unknown):ScoreWeights{
 const source=input&&typeof input==='object'?input as Record<string,unknown>:{};
 const previous={fishProspects:20,seclusion:12,quietness:7,bankQuantity:16,bankQuality:1,accessEase:2,waterManageability:10,scenery:7,evidence:0,seasonalProspects:20,travelFit:3,speciesFit:2};
 const matches=(baseline:Record<string,number>)=>Object.keys(baseline).every(k=>source[k]===baseline[k]);
 const old=revision===undefined||revision===null||revision===1||revision===2;
 return normalizeWeights(old&&(matches(LEGACY_WEIGHTS)||matches(previous))?WEIGHTS:input);
}
export function normalizeSort(input:unknown):string{
 if(input==='score:travelFit')return 'drive';
 if(input==='score:fishProspects')return 'score:seasonalProspects';
 return typeof input==='string'&&(['overall','drive','name','rating'].includes(input)||Object.keys(SCORE_LABELS).some(k=>input==='score:'+k))?input:'overall';
}
export function weightShare(weights:ScoreWeights,key:ScoreKey){const total=FIT_KEYS.reduce((sum,k)=>sum+weights[k],0);return total?weights[key]/total*100:0;}
export function effectiveWeightShare(spot:Spot,weights:ScoreWeights,key:ScoreKey){const scores=scoresFor(spot);const total=FIT_KEYS.reduce((sum,k)=>sum+(scores[k]!==null&&Number.isFinite(scores[k])?weights[k]:0),0);return total&&scores[key]!==null&&Number.isFinite(scores[key])?weights[key]/total*100:0;}
export function formatScore(score:number|null){return score===null?'?':score.toFixed(1);}
export const SCORE_GUIDE='7 = good fit; 8 = excellent fit with ordinary trade-offs; 9 = outstanding fit; 10 = an exceptional match. Scores use reasonable judgment about the fishery and access.';
export const SPECIES=['trout','smallmouth bass','salmon','crappie','perch'];
export const WATER_TYPES=['lake','pond','river','reservoir'];
export const WATER_SPEEDS=['still','slow','fast'];
export const AVAILABILITY_STATES=['active','inactive'];
export const VISIT_STATES=['visited','unvisited'];
export const PIN_LEVELS=['both','fishing','parking','visual'];
export function selectionValues(value:unknown,allowed:readonly string[]):string[]{const values=Array.isArray(value)?value:typeof value==='string'?[value]:[];return [...new Set(values.flatMap(x=>x==='mixed'?['slow','fast']:[x]).filter(x=>allowed.includes(x)))];}
export type Filters={payment:"all"|"paid"|"unpaid";availability:string[];query:string;states:string[];species:string[];waterType:string[];waterSpeed:string[];visited:string[];drive:number;walk:number;minOverall:number;minRating:number;minScores:Partial<Record<ScoreKey,number>>;includeUnknown:boolean;favorites:boolean;pinQuality:string[]};
export const DEFAULT_FILTERS:Filters={payment:"all",availability:['active'],query:'',states:['WA','OR'],species:[],waterType:[],waterSpeed:[],visited:[],drive:90,walk:120,minOverall:1,minRating:0,minScores:{},includeUnknown:false,favorites:false,pinQuality:[]};
export function clearedFilters():Filters{return {...DEFAULT_FILTERS,availability:[],states:[],species:[],waterType:[],waterSpeed:[],visited:[],drive:120,walk:120,minScores:{},includeUnknown:true,pinQuality:[]};}
export function activeFilterCount(f:Filters){return Number(f.payment!=="all")+Number(!!f.query)+Number(f.drive<120)+Number(f.walk<120)+Number(f.states.length===1)+Number(f.availability.length===1)+Number(f.visited.length===1)+f.species.length+(f.waterType.length<WATER_TYPES.length?f.waterType.length:0)+(f.waterSpeed.length<WATER_SPEEDS.length?f.waterSpeed.length:0)+Number(f.minOverall>1)+Number(f.minRating>0)+Object.values(f.minScores).filter(x=>(x??1)>1).length+Number(f.favorites)+f.pinQuality.length;}
export function normalizeFilters(input:unknown):Filters{const f=input&&typeof input==='object'?input as Partial<Filters>:{};return {...DEFAULT_FILTERS,...f,payment:f.payment==="paid"||f.payment==="unpaid"?f.payment:"all",availability:f.availability===undefined?['active']:selectionValues(f.availability,AVAILABILITY_STATES),states:f.states===undefined?[...DEFAULT_FILTERS.states]:selectionValues(f.states,['WA','OR']),species:selectionValues(f.species,SPECIES),waterType:selectionValues(f.waterType,WATER_TYPES),waterSpeed:selectionValues(f.waterSpeed,WATER_SPEEDS),visited:selectionValues(f.visited,VISIT_STATES),pinQuality:selectionValues(f.pinQuality,PIN_LEVELS),minScores:Object.fromEntries(Object.entries(f.minScores??{}).filter(([k])=>k in SCORE_LABELS))};}
export const REGION_CENTER:[number,number]=[45.86,-122.65];
export const CORPUS_DATE='2026-11-05';
export function scoresFor(spot:Spot):ScoreValues{
 const assessed=Object.fromEntries(Object.keys(SCORE_LABELS).map(key=>{const value=spot.scores[key as ScoreKey];return [key,typeof value==='number'&&Number.isFinite(value)&&value>=1&&value<=10?value:null]})) as ScoreValues;
 return {...assessed,seasonalProspects:seasonAssessment(spot).score};
}
export function fitAssessment(spot:Spot,weights:ScoreWeights=WEIGHTS){const s=scoresFor(spot);let sum=0,w=0;for(const k of FIT_KEYS){if(s[k]!==null&&Number.isFinite(s[k])){sum+=s[k]!*weights[k];w+=weights[k]}}let cap=10;let limitingFactor='';for(const k of ['seclusion','waterManageability'] as ScoreKey[]){const v=k==='seclusion'&&spot.privacyReview?spot.privacyReview.physicalSpaceScore:s[k];const c=v===null?10:v<=2?4:v===3?5:v===4?6:10;if(c<cap){cap=c;limitingFactor=k==='seclusion'?'Physical separation':SCORE_LABELS[k]}}const raw=w?sum/w:null;return {raw,cap,limitingFactor,value:raw===null?null:Math.min(cap,raw),score:raw===null?null:Math.round(Math.min(cap,raw)*10)/10};}
export function overall(spot:Spot,weights:ScoreWeights=WEIGHTS){return fitAssessment(spot,weights).score;}
export function scoreInk(score:number|null){return score!==null&&score>=3.5&&score<7.5?'#122d21':'#ffffff';}
export function coverage(spot:Spot,weights:ScoreWeights=WEIGHTS){const scores=scoresFor(spot);return FIT_KEYS.filter(k=>weights[k]>0&&scores[k]!==null).length;}
export function color(score:number|null){if(score===null)return '#64736c';const colors=['#bd493d','#c25337','#c66032','#bc7426','#a68520','#8f922b','#679444','#3b8b55','#208260','#087b59'];const position=Math.max(0,Math.min(9,score-1)),lo=Math.floor(position),hi=Math.ceil(position),fraction=position-lo;const rgb=[1,3,5].map(i=>Math.round(parseInt(colors[lo].slice(i,i+2),16)*(1-fraction)+parseInt(colors[hi].slice(i,i+2),16)*fraction));return '#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('')}
export function accessIsSupported(s:Spot):boolean{return s.accessAudit?.status==='supported'&&s.accessAudit.routeVerified===true;}
export function availabilityFor(s:Spot,today=new Date().toLocaleDateString('en-CA',{timeZone:'America/Los_Angeles'})):Availability{
 const a=s.availability??{active:true,reason:'Included as a candidate. Review the dated access and fishing conditions below.',checkedAt:s.currentStatus.checkedAt,sourceUrls:[]};
 const audit=s.accessAudit;
 if(!accessIsSupported(s)){
  if(!a.active&&(!audit||a.checkedAt>=audit.checkedAt))return {...a,active:false};
  return {...a,active:false,reason:audit?.summary||'Legal parking, the walking route and a usable bank need an access review.',checkedAt:audit?.checkedAt||a.checkedAt,sourceUrls:audit?s.sources.filter(source=>audit.sourceIds.includes(source.id)).map(source=>source.url):a.sourceUrls};
 }
 return a.inactiveFrom&&today>=a.inactiveFrom?{...a,active:false}:a;
}
export function supportedPin(s:Spot,kind:'parking'|'fishing'):Pin|null{
 const audit=s.accessAudit,pin=s[kind];
 return audit?.status==='supported'&&audit.routeVerified&&audit[kind==='parking'?'parkingVerified':'fishingVerified']&&pin&&Number.isFinite(pin.lat)&&Number.isFinite(pin.lng)?pin:null;
}
export function pinIsApproximate(pin:Pin):boolean{return /approx|area|entry|entrance/i.test(pin.confidence);}
export function visuallyInspected(s:Spot):boolean{return ['checked','partial'].includes(s.visualVerification.status)&&s.visualVerification.sourceIds.some(id=>s.sources.some(source=>source.id===id));}
export function missingPinReason(s:Spot,kind:'parking'|'fishing'):string{return s.pinGaps?.[kind]||s.accessAudit?.summary||s.accessNotes||'The research does not yet identify a supported '+(kind==='parking'?'public parking area':'fishing position')+'.';}
export function navigationFor(s:Spot,kind:'parking'|'fishing'){
 const pin=supportedPin(s,kind),availability=availabilityFor(s);
 if(!availability.active)return {href:null,label:'Unavailable',reason:availability.reason};
 if(!pin)return {href:null,label:'Pin unavailable',reason:missingPinReason(s,kind)};
 return {href:mapsPin(pin),label:pinIsApproximate(pin)?'Approx. point':'Open map pin',reason:pin.label+' · '+pin.confidence};
}

export function recordFor(s:Spot,j:Journal):JournalRecord{return j[s.id]??{visited:s.history.visited,rating:null,notes:'',lastVisited:'',favorite:false,revision:0}}
export function scorePass(value:number|null,min:number,includeUnknown:boolean){return min<=1||value!==null&&value>=min||value===null&&includeUnknown;}
export function estimatedDriveMinutes(s:Pick<Spot,'driveMinutes'>){return s.driveMinutes?Math.round((s.driveMinutes[0]+s.driveMinutes[1])/2):null;}
export type DriveLookup=(spot:Spot)=>number|null;
export function filterSpots(spots:Spot[],f:Filters,j:Journal,weights:ScoreWeights=WEIGHTS,drive:DriveLookup=estimatedDriveMinutes){return spots.filter(s=>{const r=recordFor(s,j),scores=scoresFor(s);return (f.payment==='all'||(f.payment==='paid'?!!s.paidFishing:!s.paidFishing))&&(!f.availability.length||f.availability.includes(availabilityFor(s).active?'active':'inactive'))&&(!f.query||[s.name,s.region,s.state,s.description,...s.species].join(' ').toLowerCase().includes(f.query.toLowerCase()))&&(!f.states.length||f.states.includes(s.state))&&(!f.species.length||f.species.some(x=>s.species.includes(x)))&&(!f.waterType.length||f.waterType.includes(s.waterType))&&(!f.waterSpeed.length||f.waterSpeed.some(x=>s.waterSpeed.includes(x)))&&(!f.visited.length||f.visited.includes(r.visited?'visited':'unvisited'))&&(drive(s)===null||drive(s)!<=f.drive)&&(s.walk.minutes===null||s.walk.minutes[1]<=f.walk)&&scorePass(overall(s,weights),f.minOverall,f.includeUnknown)&&(!f.minRating||(r.rating!==null&&r.rating>=f.minRating))&&Object.entries(f.minScores).filter(([k])=>k in SCORE_LABELS).every(([k,v])=>scorePass(scores[k as ScoreKey],v??1,f.includeUnknown))&&(!f.favorites||r.favorite)&&(!f.pinQuality.length||f.pinQuality.some(x=>x==='visual'?visuallyInspected(s):x==='fishing'?!!supportedPin(s,'fishing'):x==='parking'?!!supportedPin(s,'parking'):!!supportedPin(s,'parking')&&!!supportedPin(s,'fishing')))});}
export function sortSpots(spots:Spot[],sort:string,j:Journal,weights:ScoreWeights=WEIGHTS,drive:DriveLookup=estimatedDriveMinutes){sort=normalizeSort(sort);return [...spots].sort((a,b)=>{let d=0;if(sort==='name')return a.name.localeCompare(b.name);if(sort==='drive')d=(drive(a)??Infinity)-(drive(b)??Infinity);else if(sort==='rating')d=(recordFor(b,j).rating??-1)-(recordFor(a,j).rating??-1);else if(sort.startsWith('score:')){const k=sort.slice(6) as ScoreKey;d=(scoresFor(b)[k]??-1)-(scoresFor(a)[k]??-1)}else d=(fitAssessment(b,weights).value??-1)-(fitAssessment(a,weights).value??-1);return d||(drive(a)??Infinity)-(drive(b)??Infinity)||a.name.localeCompare(b.name)});}
export function mapsPin(p:Pin){return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(p.lat+','+p.lng)}`}
export function mapsArea(s:Spot){return `https://www.google.com/maps/@?api=1&map_action=map&center=${s.lat},${s.lng}&zoom=16`}
export function isStale(date:string,now=Date.now()){return (now-new Date(date+'T12:00:00Z').getTime())/86400000>14}
