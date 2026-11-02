import {filtersSchema} from './preferences.ts';
import {normalizeSort,type Filters} from './model.ts';

export type SharedView={filters?:Filters;sort?:string;spot?:string};
export const DETAIL_VIEW_KEY='bank-bend-detail-view-v1';
export type DetailView='panel'|'modal'|'fullscreen';
export function detailView(value:unknown):DetailView{return value==='modal'||value==='fullscreen'?value:'panel';}
export function readSharedView(hash:string):SharedView{
 if(hash.length>12000)return {};
 const params=new URLSearchParams(hash.replace(/^#/,'')),view:SharedView={};
 const spot=params.get('spot');if(spot&&/^[a-z0-9-]{1,150}$/.test(spot))view.spot=spot;
 try{const raw=params.get('filters');if(raw){const result=filtersSchema.safeParse(JSON.parse(raw));if(result.success){view.filters=result.data as Filters;view.sort=normalizeSort(params.get('sort')||'overall');}}}catch{}
 return view;
}
export function shareLink(base:string,view:SharedView):string{
 const url=new URL(base);url.search='';url.hash='';const params=new URLSearchParams();
 if(view.filters){params.set('filters',JSON.stringify(filtersSchema.parse(view.filters)));params.set('sort',normalizeSort(view.sort));}
 if(view.spot)params.set('spot',view.spot);
 url.hash=params.toString();return url.toString();
}
