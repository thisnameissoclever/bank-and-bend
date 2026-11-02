'use client';
import {lazy,Suspense,useEffect,useRef,useState} from 'react';
import type {ComponentProps} from 'react';
import type LeafletMap from './LeafletFishingMap';
import {MAP_STATE_KEY,readMapState,type MapState} from '../lib/map-state';
import {GOOGLE_AUTH_FAILURE} from '../lib/google-maps-loader';
const LeafletFishingMap=lazy(()=>import('./LeafletFishingMap'));
const GoogleFishingMap=lazy(()=>import('./GoogleFishingMap'));
export type FishingMapProps=ComponentProps<typeof LeafletMap>;
export default function FishingMap(props:FishingMapProps){
 const initialView=useRef<MapState>({});
 const [config,setConfig]=useState<{browserKey:string|null}|null>(null);
 const [error,setError]=useState('');
 const [fallback,setFallback]=useState(false);
 useEffect(()=>{
  try{initialView.current=readMapState(localStorage.getItem(MAP_STATE_KEY))}catch{}
  const controller=new AbortController();
  const timeout=setTimeout(()=>{setConfig({browserKey:null});controller.abort()},8000);
  fetch('/api/maps-config',{cache:'no-store',signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json() as Promise<{browserKey:string|null}>}).then(value=>{clearTimeout(timeout);setConfig(value)}).catch(()=>{if(!controller.signal.aborted)setConfig({browserKey:null})});
  const authFailed=()=>setError('Google Maps could not authorize this site.');
  window.addEventListener(GOOGLE_AUTH_FAILURE,authFailed);
  return()=>{clearTimeout(timeout);controller.abort();window.removeEventListener(GOOGLE_AUTH_FAILURE,authFailed)};
 },[]);
 const useGoogle=!!config?.browserKey&&!fallback;
 return <>
  <Suspense fallback={<div className="map-loading">Opening the map…</div>}>
   {config?(useGoogle?<GoogleFishingMap {...props} initialView={initialView.current} browserKey={config.browserKey!} onError={setError}/>:<LeafletFishingMap {...props} initialView={initialView.current}/>):<div className="map-loading">Opening the map…</div>}
  </Suspense>
  {error&&useGoogle&&<div className="map-error google-provider-error" role="alert">{error} <button onClick={()=>{try{initialView.current=readMapState(localStorage.getItem(MAP_STATE_KEY))}catch{}setFallback(true)}}>Use the backup map</button></div>}
  {config&&props.layer==='satellite'&&<div className="imagery-note">{useGoogle?'Google satellite imagery':'USDA / USGS aerial imagery'}; capture dates vary. Waterlines and paths may have changed.</div>}
 </>;
}
