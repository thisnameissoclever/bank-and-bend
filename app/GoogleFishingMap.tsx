'use client';
/// <reference types="google.maps" />
import {useEffect,useRef,useState} from 'react';
import type {FishingMapProps} from './FishingMap';
import {REGION_CENTER,overall,color,scoreInk,recordFor,availabilityFor,supportedPin,formatScore} from '../lib/model';
import {MAP_STATE_KEY,readMapState,mergeMapState,shouldCenterSelection,type MapState} from '../lib/map-state';
import {stockingFlag,stockingSummary,stockingRecency} from '../lib/stocking-view';
import {loadGoogleMaps} from '../lib/google-maps-loader';

type Pin={element:HTMLButtonElement;setPosition:(point:google.maps.LatLngLiteral)=>void;setMap:(map:google.maps.Map|null)=>void};
// OverlayView keeps score badges as accessible buttons without a separate map ID.
function createPin(map:google.maps.Map,point:google.maps.LatLngLiteral,className:string,title:string,onClick?:()=>void):Pin{
 class MapPin extends google.maps.OverlayView{
  element=document.createElement('button');
  constructor(private point:google.maps.LatLngLiteral){
   super();this.element.type='button';this.element.className='google-pin '+className;
   this.element.title=title;this.element.setAttribute('aria-label',title);
   if(onClick)this.element.addEventListener('click',onClick);
   // Keep marker clicks separate while letting wheel and drag gestures reach the map.
   google.maps.OverlayView.preventMapHitsFrom(this.element);this.setMap(map);
  }
  onAdd(){this.getPanes()?.overlayMouseTarget.appendChild(this.element)}
  draw(){const p=this.getProjection()?.fromLatLngToDivPixel(new google.maps.LatLng(this.point));if(p){this.element.style.left=`${p.x}px`;this.element.style.top=`${p.y}px`;}}
  onRemove(){this.element.remove()}
  setPosition(point:google.maps.LatLngLiteral){this.point=point;this.draw()}
 }
 return new MapPin(point);
}
const latLng=([lat,lng]:[number,number])=>({lat,lng});
export default function GoogleFishingMap(props:FishingMapProps&{browserKey:string;onError:(message:string)=>void}){
 const {origin,spots,selected,onSelect,layer,action,journal,weights,browserKey,onError,stocking,stockingDay}=props;
 const el=useRef<HTMLDivElement>(null),map=useRef<google.maps.Map|null>(null);
 const markers=useRef(new Map<string,Pin>()),pins=useRef<Pin[]>([]),location=useRef<Pin|null>(null),accuracy=useRef<google.maps.Circle|null>(null);
 const callback=useRef(onSelect),latest=useRef(props),saved=useRef<MapState>({}),lastSelection=useRef<string|null|undefined>(undefined),positioned=useRef(false);
 callback.current=onSelect;latest.current=props;
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false);
 useEffect(()=>{
  let cancelled=false;let observer:ResizeObserver|undefined;const listeners:google.maps.MapsEventListener[]=[];
  try{saved.current=props.initialView??readMapState(localStorage.getItem(MAP_STATE_KEY))}catch{}
  loadGoogleMaps(browserKey).then(async()=>{
   const {Map:GoogleMap}=await google.maps.importLibrary('maps') as google.maps.MapsLibrary;
   const {ColorScheme}=await google.maps.importLibrary('core') as google.maps.CoreLibrary;
   if(cancelled||!el.current)return;
   positioned.current=!!saved.current.center||!!latest.current.selected;
   const m=new GoogleMap(el.current,{
    center:latLng(saved.current.center||REGION_CENTER),zoom:saved.current.zoom??9,minZoom:6,
    mapTypeId:latest.current.layer==='satellite'?'hybrid':'roadmap',colorScheme:ColorScheme.DARK,
    mapTypeControl:false,streetViewControl:false,fullscreenControl:false,zoomControl:false,
    rotateControl:false,tilt:0,heading:0,gestureHandling:'greedy',clickableIcons:false,scaleControl:true,
   });
   map.current=m;
   listeners.push(m.addListener('idle',()=>{
    const p=m.getCenter(),zoom=m.getZoom();if(!p||zoom===undefined)return;
    try{localStorage.setItem(MAP_STATE_KEY,JSON.stringify(mergeMapState(localStorage.getItem(MAP_STATE_KEY),{center:[Number(p.lat().toFixed(6)),Number(p.lng().toFixed(6))],zoom})))}catch{}
   }),m.addListener('dragstart',()=>{positioned.current=true}));
   observer=new ResizeObserver(()=>{google.maps.event.trigger(m,'resize')});observer.observe(el.current);
   setReady(true);
  }).catch(error=>{if(!cancelled){setFailed(true);onError(error instanceof Error?error.message:'Google Maps could not load.')}});
  return()=>{cancelled=true;observer?.disconnect();listeners.forEach(l=>l.remove());markers.current.forEach(p=>p.setMap(null));markers.current.clear();pins.current.forEach(p=>p.setMap(null));pins.current=[];location.current?.setMap(null);location.current=null;accuracy.current?.setMap(null);accuracy.current=null;map.current=null;};
 },[browserKey,onError]);
 useEffect(()=>{if(ready)map.current?.setMapTypeId(layer==='satellite'?'hybrid':'roadmap')},[ready,layer]);
 useEffect(()=>{
  const m=map.current;if(!ready||!m)return;
  const ids=new Set(spots.map(s=>s.id));for(const [id,p]of markers.current)if(!ids.has(id)){p.setMap(null);markers.current.delete(id)}
  for(const s of spots){
   const score=overall(s,weights),visited=recordFor(s,journal).visited;
   const name=`${s.name}${s.paidFishing?', paid fishing':''}${availabilityFor(s).active?'':' (inactive)'}, fit ${formatScore(score)} out of 10${stocking&&stockingDay?", "+stockingRecency(stockingSummary(s.stocking,stocking,stockingDay).days):""}`;
   let pin=markers.current.get(s.id);
   if(!pin){pin=createPin(m,{lat:s.lat,lng:s.lng},'fit-marker',name,()=>callback.current(s.id));markers.current.set(s.id,pin)}
   else pin.setPosition({lat:s.lat,lng:s.lng});
   const button=pin.element;button.title=name;button.setAttribute('aria-label',name);button.setAttribute('aria-pressed',String(s.id===selected?.id));
   button.className='google-pin fit-marker'+(stocking?' has-stocking':'')+(s.id===selected?.id?' is-selected':'')+(!availabilityFor(s).active?' inactive-marker':'');
   button.style.zIndex=s.id===selected?.id?'1000':'1';
   const badge=document.createElement('span');badge.style.setProperty('--score',color(score));badge.style.color=scoreInk(score);badge.textContent=formatScore(score);
   if(visited){const tick=document.createElement('i');tick.textContent='✓';badge.appendChild(tick)}button.replaceChildren(badge);
   if(s.paidFishing){const paid=document.createElement("b");paid.className="paid-marker";paid.textContent="$";paid.setAttribute("aria-hidden","true");button.appendChild(paid)}
   if(stocking&&stockingDay){const flag=document.createElement('b');flag.className='stocking-flag';flag.textContent=stockingFlag(s.stocking,stocking,stockingDay);button.appendChild(flag)}
  }
 },[ready,spots,selected?.id,journal,weights,stocking,stockingDay]);
 useEffect(()=>{
  const m=map.current;if(!ready||!m)return;
  pins.current.forEach(p=>p.setMap(null));pins.current=[];
  if(!selected){lastSelection.current=null;return;}
  for(const [kind,point]of [['P',supportedPin(selected,'parking')],['F',supportedPin(selected,'fishing')]] as const){
   if(!point)continue;const title=(kind==='P'?'Parking: ':'Fishing access: ')+point.label;
   const pin=createPin(m,point,'access-pin '+(kind==='P'?'parking':'fishing'),title);pin.element.style.zIndex='1200';
   const badge=document.createElement('b');badge.textContent=kind;pin.element.appendChild(badge);pins.current.push(pin);
  }
  if(shouldCenterSelection(selected.id,lastSelection.current,saved.current)){positioned.current=true;m.setZoom(Math.max(m.getZoom()??9,11));m.panTo({lat:selected.lat,lng:selected.lng})}
  lastSelection.current=selected.id;
 },[ready,selected]);
 useEffect(()=>{
  const m=map.current;if(!ready||!m)return;
  if(!origin){location.current?.setMap(null);location.current=null;accuracy.current?.setMap(null);accuracy.current=null;return;}
  const point={lat:origin.lat,lng:origin.lng};
  const title=origin?'Your location · accuracy about '+Math.round(origin.accuracy*3.28084)+' ft':'Regional overview';
  if(!location.current)location.current=createPin(m,point,'',title);
  const pin=location.current;pin.setPosition(point);pin.element.className='google-pin '+(origin?'current-location-pin':'home-pin');pin.element.title=title;pin.element.setAttribute('aria-label',title);pin.element.style.zIndex='1600';
  const dot=document.createElement('span');dot.textContent=origin?'':'⌂';pin.element.replaceChildren(dot);
  if(origin){
   if(!accuracy.current)accuracy.current=new google.maps.Circle({map:m,strokeColor:'#61b5ff',strokeWeight:1,fillColor:'#46a2ff',fillOpacity:.12,clickable:false});
   accuracy.current.setCenter(point);accuracy.current.setRadius(origin.accuracy);
   if(!positioned.current&&!latest.current.selected){positioned.current=true;m.setZoom(9);m.panTo(point)}
  }else{accuracy.current?.setMap(null);accuracy.current=null;}
 },[ready,origin]);
 useEffect(()=>{
  const m=map.current;if(!ready||!m||!action.nonce)return;
  const fit=(points:google.maps.LatLngLiteral[],maxZoom:number,padding:number)=>{const bounds=new google.maps.LatLngBounds();points.forEach(p=>bounds.extend(p));m.fitBounds(bounds,padding);google.maps.event.addListenerOnce(m,'idle',()=>{if((m.getZoom()??0)>maxZoom)m.setZoom(maxZoom)})};
  positioned.current=true;
  if(action.type==='home'){m.setZoom(11);m.panTo(origin?{lat:origin.lat,lng:origin.lng}:latLng(REGION_CENTER))}
  if(action.type==='fit'&&spots.length)fit(spots.map(s=>({lat:s.lat,lng:s.lng})),12,65);
  if(action.type==='access'&&selected){const points=[supportedPin(selected,'parking'),supportedPin(selected,'fishing')].filter(p=>!!p);if(points.length)fit(points,18,95);else{m.setZoom(16);m.panTo({lat:selected.lat,lng:selected.lng})}}
 },[ready,action.nonce]);
 return <>
  <div ref={el} className="map-canvas google-map" aria-label="Google map of filtered fishing locations" onWheel={()=>{positioned.current=true}} onPointerDown={()=>{positioned.current=true}}/>
  {!ready&&!failed&&<div className="map-loading">Opening Google Maps…</div>}
  {ready&&<div className="google-map-zoom"><button aria-label="Zoom in" onClick={()=>{positioned.current=true;const m=map.current;if(m)m.setZoom((m.getZoom()??9)+1)}}>+</button><button aria-label="Zoom out" onClick={()=>{positioned.current=true;const m=map.current;if(m)m.setZoom(Math.max(6,(m.getZoom()??9)-1))}}>−</button></div>}
 </>;
}
