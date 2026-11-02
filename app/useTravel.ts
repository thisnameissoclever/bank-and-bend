'use client';
import {useCallback,useEffect,useMemo,useState,useRef} from 'react';
import type {Spot} from '../lib/model';
import {directMiles,destination,readRoutes,routeUrl,travelMinutes} from '../lib/travel';
import type {Origin,TravelEstimate} from '../lib/travel';
import {watchForegroundLocation,shouldRefreshRoutes} from '../lib/location-watch';
import type {LocationFix} from '../lib/location-watch';

// Precise location and routing results live in this page's memory only.
const routeCache=new Map<string,Promise<Record<string,TravelEstimate>>>();
let routeQueue=Promise.resolve();
let lastRequestAt=0;
function routing(origin:Origin,spots:Spot[],retry=false){const key=JSON.stringify([origin,spots.map(s=>[s.id,destination(s)])]);if(retry)routeCache.delete(key);let work=routeCache.get(key);if(!work){work=new Promise<Record<string,TravelEstimate>>((resolve)=>{routeQueue=routeQueue.then(async()=>{const result:Record<string,TravelEstimate>={};for(let i=0;i<spots.length;i+=99){const batch=spots.slice(i,i+99);await new Promise(r=>setTimeout(r,Math.max(0,1100-(Date.now()-lastRequestAt))));lastRequestAt=Date.now();try{const response=await fetch(routeUrl(origin,batch),{signal:AbortSignal.timeout(20000),referrerPolicy:'origin'});if(!response.ok)throw new Error('Routing unavailable');Object.assign(result,readRoutes(await response.json(),batch));}catch{/* Keep this batch unknown. Never substitute a different origin. */}}resolve(result)}).catch(()=>resolve({}));});routeCache.set(key,work);if(routeCache.size>4)routeCache.delete(routeCache.keys().next().value!);}return work;}
export default function useTravel(spots:Spot[]){
 const [origin,setOrigin]=useState<LocationFix|null>(null),[routeOrigin,setRouteOrigin]=useState<Origin|null>(null),[locationState,setLocationState]=useState<'locating'|'current'|'fallback'>('locating'),[reason,setReason]=useState('Finding your location…'),[routes,setRoutes]=useState<Record<string,TravelEstimate>>({}),[routingBusy,setRoutingBusy]=useState(false),[attempt,setAttempt]=useState(0),[watchAttempt,setWatchAttempt]=useState(0),[watching,setWatching]=useState(false),[routeTime,setRouteTime]=useState<number|null>(null);
 const lastRouting=useRef<{origin:Origin|null;at:number}>({origin:null,at:0}),forceRefresh=useRef(false);
 const locateNow=useCallback(async()=>{forceRefresh.current=true;setLocationState('locating');setReason('Finding your location…');setWatchAttempt(n=>n+1)},[]);
 useEffect(()=>watchForegroundLocation(navigator.geolocation,document,fix=>{
  setOrigin(fix);setLocationState('current');setReason('');const now=Date.now();
  if(forceRefresh.current||shouldRefreshRoutes(lastRouting.current.origin,fix,lastRouting.current.at,now)){
   forceRefresh.current=false;const point={lat:fix.lat,lng:fix.lng};lastRouting.current={origin:point,at:now};setRouteOrigin(point);setRouteTime(now);
  }
 },code=>{setOrigin(null);setRouteOrigin(null);setRoutes({});lastRouting.current={origin:null,at:0};setLocationState('fallback');setReason(code===1?'Location permission is off. Enable it to calculate drive times.':'Current location unavailable. Drive times will appear when it is available.');},setWatching),[watchAttempt]);
 useEffect(()=>{if(!routeOrigin){setRoutingBusy(false);return}let active=true;setRoutes({});setRoutingBusy(true);void routing(routeOrigin,spots,attempt>0).then(result=>{if(active){setRoutes(result);setRoutingBusy(false)}});return()=>{active=false}},[routeOrigin,spots,attempt]);
 const minutes=useCallback((spot:Spot)=>travelMinutes(spot,routeOrigin,routes),[routeOrigin,routes]);
 const label='your location';
 const unknown=origin?spots.filter(s=>routes[s.id]?.minutes==null).length:0;
 const hint=origin?(routingBusy?'Calculating road times. Spots awaiting a time remain visible.':unknown?'Some road times are unavailable. Those spots remain visible through the drive filter.':'Road estimates from your location, without live traffic.'):'Enable location to calculate road times. Spots remain visible while travel time is unknown.';
 const description=useCallback((spot:Spot)=>{const min=minutes(spot);if(!origin)return 'Drive time unavailable';const route=routes[spot.id];if(min!==null&&route)return `${min} min · ${route.miles!.toFixed(1)} mi${route.approximate?' · area est.':''}`;return `${directMiles(origin,destination(spot)).toFixed(1)} mi direct · ${routingBusy?'calculating drive':'drive unavailable'}`},[minutes,origin,routes,routingBusy]);
 return useMemo(()=>({origin,label,locationState,reason,hint,minutes,description,routingBusy,unknown,watching,routeTime,locateNow,retry:()=>{if(origin){const point={lat:origin.lat,lng:origin.lng},now=Date.now();lastRouting.current={origin:point,at:now};setRouteOrigin(point);setRouteTime(now)}setAttempt(n=>n+1)}}),[origin,label,locationState,reason,hint,minutes,description,routingBusy,unknown,watching,routeTime,locateNow]);
}
