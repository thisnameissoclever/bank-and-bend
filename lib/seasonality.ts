export type Seasonality={monthlyScores:(number|null)[];rationale:string;sourceIds:string[];reviewedAt:string};
export type SeasonalOverride={score:number|null;from:string;through:string;reason:string;sourceIds:string[];checkedAt:string};
export type SeasonalSpotLike={
 seasonality?:Seasonality|null;
 seasonalOverride?:SeasonalOverride|null;
 seasonalCheckedAt?:string;
 scores?:{seasonalProspects?:number|null};
 scoreReasons?:{seasonalProspects?:string};
};
export type SeasonDate=string|Date;
export type SeasonAssessment={
 score:number|null;
 basis:'recent'|'calendar'|'unknown';
 reason:string;
 asOf:string;
 reviewedAt:string|null;
 sourceIds:string[];
 from?:string;
 through?:string;
};
export const MONTH_LABELS=['January','February','March','April','May','June','July','August','September','October','November','December'] as const;
export const MONTH_SHORT_LABELS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'] as const;
export const LEGACY_SEASONAL_MAX_AGE_DAYS=14;
const DAY_MS=86400000;
const pacificFormatter=new Intl.DateTimeFormat('en-US',{timeZone:'America/Los_Angeles',year:'numeric',month:'2-digit',day:'2-digit'});

export function validSeasonDate(value:unknown):value is string{
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return false;
 const parsed=new Date(value+'T00:00:00Z');
 return Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===value;
}
export function pacificDate(instant:Date=new Date()):string{
 if(!(instant instanceof Date)||!Number.isFinite(instant.getTime()))return '';
 const parts=pacificFormatter.formatToParts(instant);
 const part=(type:string)=>parts.find(value=>value.type===type)?.value??'';
 const value=`${part('year')}-${part('month')}-${part('day')}`;
 return validSeasonDate(value)?value:'';
}
function assessmentDate(value:SeasonDate):string{
 return value instanceof Date?pacificDate(value):validSeasonDate(value)?value:'';
}
function validScore(value:unknown):value is number|null{
 return value===null||typeof value==='number'&&Number.isFinite(value)&&value>=1&&value<=10;
}
function validSources(value:unknown):value is string[]{
 return Array.isArray(value)&&value.every(id=>typeof id==='string'&&id.trim().length>0);
}
function validText(value:unknown):value is string{return typeof value==='string'&&value.trim().length>0;}
export function validSeasonality(value:unknown):value is Seasonality{
 if(!value||typeof value!=='object')return false;
 const profile=value as Partial<Seasonality>;
 return Array.isArray(profile.monthlyScores)&&profile.monthlyScores.length===12&&Array.from(profile.monthlyScores).every(validScore)&&validText(profile.rationale)&&validSources(profile.sourceIds)&&validSeasonDate(profile.reviewedAt);
}
export function validSeasonalOverride(value:unknown):value is SeasonalOverride{
 if(!value||typeof value!=='object')return false;
 const override=value as Partial<SeasonalOverride>;
 return validScore(override.score)&&validSeasonDate(override.from)&&validSeasonDate(override.through)&&override.from<=override.through&&validSeasonDate(override.checkedAt)&&override.checkedAt<=override.through&&validText(override.reason)&&validSources(override.sourceIds);
}
export function seasonalCalendar(spot:SeasonalSpotLike):(number|null)[]{
 return validSeasonality(spot.seasonality)?[...spot.seasonality.monthlyScores]:Array<number|null>(12).fill(null);
}
function dayNumber(date:string):number{return Date.parse(date+'T00:00:00Z')/DAY_MS;}
function dateAfter(date:string,days:number):string{return new Date((dayNumber(date)+days)*DAY_MS).toISOString().slice(0,10);}
function unknown(asOf:string,reason:string,reviewedAt:string|null=null):SeasonAssessment{
 return {score:null,basis:'unknown',reason,asOf,reviewedAt,sourceIds:[]};
}

export function seasonAssessment(spot:SeasonalSpotLike,date:SeasonDate=new Date()):SeasonAssessment{
 const asOf=assessmentDate(date);
 if(!asOf)return unknown('','The assessment date is invalid.');
 const override=spot.seasonalOverride;
 if(validSeasonalOverride(override)&&override.checkedAt<=asOf&&override.from<=asOf&&asOf<=override.through){
  return {score:override.score,basis:'recent',reason:override.reason,asOf,reviewedAt:override.checkedAt,sourceIds:[...override.sourceIds],from:override.from,through:override.through};
 }
 if(spot.seasonality!==undefined&&spot.seasonality!==null){
  const profile=spot.seasonality;
  if(!validSeasonality(profile))return unknown(asOf,'The monthly profile needs valid ratings and a review date.');
  if(profile.reviewedAt>asOf)return unknown(asOf,'The monthly profile was reviewed after the selected date.',profile.reviewedAt);
  return {score:profile.monthlyScores[Number(asOf.slice(5,7))-1],basis:'calendar',reason:profile.rationale,asOf,reviewedAt:profile.reviewedAt,sourceIds:[...profile.sourceIds]};
 }
 const checkedAt=spot.seasonalCheckedAt;
 const score=spot.scores?.seasonalProspects;
 if(!validSeasonDate(checkedAt))return unknown(asOf,'A monthly profile or dated seasonal assessment is needed.');
 const age=dayNumber(asOf)-dayNumber(checkedAt);
 if(age<0)return unknown(asOf,'The seasonal assessment was checked after the selected date.',checkedAt);
 if(age>LEGACY_SEASONAL_MAX_AGE_DAYS)return unknown(asOf,'The dated seasonal assessment has expired. A monthly profile or fresh assessment is needed.',checkedAt);
 if(!validScore(score))return unknown(asOf,'The dated seasonal assessment has no valid rating.',checkedAt);
 return {score,basis:'recent',reason:spot.scoreReasons?.seasonalProspects?.trim()||'A dated seasonal assessment is available for this period.',asOf,reviewedAt:checkedAt,sourceIds:[],from:checkedAt,through:dateAfter(checkedAt,LEGACY_SEASONAL_MAX_AGE_DAYS)};
}
