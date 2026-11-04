export const MAP_STATE_KEY='bank-bend-map-view-v1';
export type MapState={center?:[number,number];zoom?:number;spotId?:string|null;tab?:string;detailHidden?:boolean};
// Storage sanity bound only. Each map provider enforces its own supported zoom.
export function readMapState(raw:string|null):MapState{
 try{
  const v=JSON.parse(raw||'{}'),state:MapState={};if(!v||typeof v!=='object')return state;
  if(Array.isArray(v.center)&&v.center.length===2&&v.center.every((n:unknown)=>typeof n==='number'&&Number.isFinite(n))&&Math.abs(v.center[0])<=85&&Math.abs(v.center[1])<=180&&typeof v.zoom==='number'&&Number.isFinite(v.zoom)&&v.zoom>=6&&v.zoom<=30){state.center=v.center;state.zoom=v.zoom;}
  if(v.spotId===null||typeof v.spotId==='string'&&/^[a-z0-9-]{1,150}$/.test(v.spotId))state.spotId=v.spotId;
  if(['overview','stocking','scores','journal','sources'].includes(v.tab))state.tab=v.tab;
  if(typeof v.detailHidden==='boolean')state.detailHidden=v.detailHidden;
  return state;
 }catch{return {};}
}
export function mergeMapState(raw:string|null,patch:MapState):MapState{return readMapState(JSON.stringify({...readMapState(raw),...patch}));}
export function shouldCenterSelection(id:string|null,previous:string|null|undefined,saved:MapState):boolean{
 return !!id&&id!==previous&&!(previous===undefined&&saved.center&&saved.spotId===id);
}
