import type {Spot} from './model.ts';

// Historical research stays on the server. Public responses omit the original
// owner's travel origin and visit history, while retaining anonymous evidence.
export function publicText(text:string,privateName=process.env.RESEARCH_PRIVATE_NAME??'',privateOrigin=process.env.RESEARCH_PRIVATE_ORIGIN??''):string{
 const escape=(value:string)=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 if(/^https?:\/\//.test(text)){
  if(privateOrigin&&text.includes('/maps/dir/')&&text.toLowerCase().includes(privateOrigin.toLowerCase()))return 'https://www.google.com/maps';
  return text;
 }
 let prose=text;
 if(privateName){
  const names=[privateName,privateName.split(' ')[0]].map(escape).join('|');
  prose=prose.replace(new RegExp(`\\b(?:${names})[’']s\\b`,'g'),"an angler's").replace(new RegExp(`\\b(?:${names})\\b`,'g'),'an angler');
 }
 if(privateOrigin)prose=prose.replace(new RegExp(`\\b${escape(privateOrigin)}\\b`,'gi'),'the former travel origin');
 return prose;
}
export function publicResearch<T>(input:T,key=''):T{
 if(typeof input==='string'){
  if(key==='id'||key==='spotId'||key==='sourceIds')return input;
  return publicText(input) as T;
 }
 if(Array.isArray(input))return input.map(value=>publicResearch(value,key)).filter(value=>value!=='') as T;
 if(input&&typeof input==='object')return Object.fromEntries(Object.entries(input).map(([k,v])=>[k,publicResearch(v,k)])) as T;
 return input;
}
export function publicSpot(raw:Spot):Spot{
 const spot=publicResearch(raw) as Spot&{driveTimeBasis?:string};
 delete spot.driveTimeBasis;
 return {...spot,driveMinutes:null,history:{visited:false,notes:''},
  researchLog:spot.researchLog.filter(line=>!/(?:drive|travel).*(?:estimate|range|minute)|(?:estimate|range).*drive|timeline|location history/i.test(line)),
  sources:spot.sources.map(source=>source.kind==='user'?{...source,title:'Angler field observation',url:''}:source),
 };
}
