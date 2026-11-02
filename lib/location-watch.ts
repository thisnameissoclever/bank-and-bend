import {directMiles} from './travel.ts';
import type {Origin} from './travel.ts';
export type LocationFix=Origin&{accuracy:number;timestamp:number};
type Visibility=Pick<Document,'hidden'|'addEventListener'|'removeEventListener'>;
type GeolocationSource=Pick<Geolocation,'watchPosition'|'clearWatch'>;
/** Watch only a visible page; reject callbacks from a stopped or superseded watch. */
export function watchForegroundLocation(geo:GeolocationSource|undefined,visibility:Visibility,onFix:(fix:LocationFix)=>void,onError:(code:number)=>void,onWatching:(watching:boolean)=>void){
 let watchId:number|null=null,disposed=false,generation=0;
 const stop=()=>{generation++;if(watchId!==null){geo?.clearWatch(watchId);watchId=null}onWatching(false)};
 const sync=()=>{if(disposed)return;if(visibility.hidden){stop();return}if(watchId!==null)return;if(!geo){onError(2);return}const token=++generation;onWatching(true);try{watchId=geo.watchPosition(position=>{if(disposed||visibility.hidden||token!==generation)return;const {latitude:lat,longitude:lng,accuracy}=position.coords;if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return;onFix({lat,lng,accuracy:Number.isFinite(accuracy)?Math.max(0,accuracy):0,timestamp:position.timestamp})},error=>{if(disposed||visibility.hidden||token!==generation)return;onError(error.code);if(error.code===1)stop()},{enableHighAccuracy:true,maximumAge:5000,timeout:20000})}catch{onError(2);stop()}};
 visibility.addEventListener('visibilitychange',sync);sync();
 return ()=>{disposed=true;visibility.removeEventListener('visibilitychange',sync);stop()};
}
/** Keep the map dot live without requesting every road route for each GPS fix. */
export function shouldRefreshRoutes(previous:Origin|null,next:Origin,requestedAt:number,now:number){return !previous||now-requestedAt>=300000&&directMiles(previous,next)*1609.344>=500;}
