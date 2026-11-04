'use client';
import {stockingFlag,stockingSummary,stockingRecency,type StockingOptions} from '../lib/stocking-view';
import {useEffect,useRef,useState} from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {Spot,Journal,REGION_CENTER,overall,color,scoreInk,recordFor,availabilityFor,supportedPin,ScoreWeights,formatScore} from '../lib/model';
import type {LocationFix} from '../lib/location-watch';
import {satelliteLayer} from '../lib/satellite-layer';
import {MAP_STATE_KEY,readMapState,mergeMapState,shouldCenterSelection,type MapState} from '../lib/map-state';
export default function FishingMap({origin,spots,selected,onSelect,layer,action,journal,weights,initialView,stocking,stockingDay}:{origin:LocationFix|null;spots:Spot[];selected:Spot|null;onSelect:(id:string)=>void;layer:'map'|'satellite';action:{type:string;nonce:number};journal:Journal;weights:ScoreWeights;initialView?:MapState;stocking?:StockingOptions;stockingDay?:string}){
 const el=useRef<HTMLDivElement>(null),map=useRef<Leaflet.Map|null>(null),lib=useRef<typeof Leaflet|null>(null),markers=useRef<Leaflet.LayerGroup|null>(null),pins=useRef<Leaflet.LayerGroup|null>(null),tiles=useRef<Leaflet.GridLayer|null>(null),callback=useRef(onSelect),originMarker=useRef<Leaflet.Marker|null>(null),accuracyCircle=useRef<Leaflet.Circle|null>(null),initialLocationCentered=useRef(false);
 const savedView=useRef<MapState>({}),lastSelection=useRef<string|null|undefined>(undefined),selectedRef=useRef(selected);selectedRef.current=selected;
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[fallback,setFallback]=useState(false),[loading,setLoading]=useState(false);callback.current=onSelect;
 useEffect(()=>{let cancelled=false;let observer:ResizeObserver|undefined;try{savedView.current=initialView??readMapState(localStorage.getItem(MAP_STATE_KEY))}catch{}import('leaflet').then(L=>{if(cancelled||!el.current)return;lib.current=L;initialLocationCentered.current=!!savedView.current.center||!!selectedRef.current;const m=L.map(el.current,{zoomControl:false,minZoom:6,maxZoom:19,zoomSnap:.5}).setView(savedView.current.center||REGION_CENTER,savedView.current.zoom??9);map.current=m;const persist=()=>{const point=m.getCenter();const center:[number,number]=[Number(point.lat.toFixed(6)),Number((((point.lng+180)%360+360)%360-180).toFixed(6))];try{localStorage.setItem(MAP_STATE_KEY,JSON.stringify(mergeMapState(localStorage.getItem(MAP_STATE_KEY),{center,zoom:m.getZoom()})))}catch{}};m.on('moveend zoomend',persist);m.on('dragstart zoomstart',()=>{initialLocationCentered.current=true});L.control.zoom({position:'bottomright'}).addTo(m);L.control.scale({position:'bottomleft',imperial:true,metric:false}).addTo(m);markers.current=L.layerGroup().addTo(m);pins.current=L.layerGroup().addTo(m);observer=new ResizeObserver(()=>m.invalidateSize());observer.observe(el.current);setReady(true)}).catch(()=>setFailed(true));return()=>{cancelled=true;observer?.disconnect();map.current?.remove();map.current=null}} ,[]);
 useEffect(()=>{
  if(!ready||!map.current||!lib.current)return;const L=lib.current,m=map.current;
  if(!origin){originMarker.current?.remove();originMarker.current=null;accuracyCircle.current?.remove();accuracyCircle.current=null;return;}
  const point:[number,number]=[origin.lat,origin.lng];
  const title=origin?'Your location · accuracy about '+Math.round(origin.accuracy*3.28084)+' ft':'Regional overview';
  const icon=L.divIcon({className:origin?'current-location-pin':'home-pin',html:origin?'<span></span>':'<span>⌂</span>',iconSize:[26,26],iconAnchor:[13,13]});
  if(originMarker.current){originMarker.current.setLatLng(point).setIcon(icon).setTooltipContent(title);const element=originMarker.current.getElement();if(element){element.title=title;element.setAttribute('aria-label',title)}}
  else originMarker.current=L.marker(point,{icon,title,alt:title,zIndexOffset:1600}).bindTooltip(title).addTo(m);
  if(origin){if(accuracyCircle.current)accuracyCircle.current.setLatLng(point).setRadius(origin.accuracy);else accuracyCircle.current=L.circle(point,{radius:origin.accuracy,color:'#61b5ff',weight:1,fillColor:'#46a2ff',fillOpacity:.12,interactive:false}).addTo(m);
   if(!initialLocationCentered.current&&!selectedRef.current){initialLocationCentered.current=true;m.flyTo(point,9)}
  }else{accuracyCircle.current?.remove();accuracyCircle.current=null}
 },[ready,origin]);
 useEffect(()=>{
  if(!ready||!map.current||!lib.current)return;
  tiles.current?.remove();setFailed(false);setFallback(false);setLoading(false);const errors=new Set<HTMLElement>();
  const satellite=layer==='satellite';
  // Keep React from replacing the interaction classes Leaflet adds to its root.
  el.current?.classList.toggle('map-topographic',!satellite);
  el.current?.classList.toggle('map-satellite',satellite);
  const next=satellite?satelliteLayer(lib.current,setFallback):lib.current.tileLayer('https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}',{
   maxZoom:19,maxNativeZoom:16,tileSize:256,updateWhenIdle:true,keepBuffer:1,
   attribution:'<a href="https://www.usgs.gov/programs/national-geospatial-program/national-map" target="_blank">USGS The National Map</a>'
  });
  tiles.current=next;
  next.on('loading',()=>setLoading(true)).on('load',()=>setLoading(false)).on('tileerror',event=>{errors.add(event.tile);setFailed(true)}).on('tileunload',event=>{errors.delete(event.tile);setFailed(errors.size>0)}).addTo(map.current);
  return()=>{next.remove();next.off();if(tiles.current===next)tiles.current=null};
 },[ready,layer]);
 useEffect(()=>{if(!ready||!markers.current||!lib.current)return;const L=lib.current;markers.current.clearLayers();spots.forEach(s=>{const v=overall(s,weights),visited=recordFor(s,journal).visited;const marker=L.marker([s.lat,s.lng],{icon:L.divIcon({className:'fit-marker '+(stocking?'has-stocking ':'')+(s.id===selected?.id?'is-selected':'')+(!availabilityFor(s).active?' inactive-marker':''),html:`<span style="--score:${color(v)};color:${scoreInk(v)}">${formatScore(v)}${visited?'<i>✓</i>':''}</span>${stocking&&stockingDay?'<b class="stocking-flag">'+stockingFlag(s.stocking,stocking,stockingDay)+'</b>':''}`,iconSize:[42,42],iconAnchor:[21,21]}),title:s.name+(!availabilityFor(s).active?' (inactive)':'')+', fit '+(v??'unknown')+' out of 10'+(stocking&&stockingDay?', '+stockingRecency(stockingSummary(s.stocking,stocking,stockingDay).days):''),alt:s.name,zIndexOffset:s.id===selected?.id?1000:0});const tip=document.createElement('span');tip.textContent=s.name;marker.bindTooltip(tip,{direction:'top',offset:[0,-18]}).on('click',()=>callback.current(s.id)).addTo(markers.current!)});},[spots,selected?.id,ready,journal,weights,stocking,stockingDay]);
 useEffect(()=>{if(!ready||!map.current||!lib.current||!pins.current)return;pins.current.clearLayers();if(!selected){lastSelection.current=null;return;}const L=lib.current;for(const [kind,p] of [['P',supportedPin(selected,'parking')],['F',supportedPin(selected,'fishing')]] as const){if(!p)continue;const title=(kind==='P'?'Parking: ':'Fishing access: ')+p.label;L.marker([p.lat,p.lng],{icon:L.divIcon({className:'access-pin '+(kind==='P'?'parking':'fishing'),html:`<b>${kind}</b>`,iconSize:[28,28],iconAnchor:[14,28]}),title,zIndexOffset:1200}).bindTooltip(title).addTo(pins.current)}if(shouldCenterSelection(selected.id,lastSelection.current,savedView.current)){initialLocationCentered.current=true;map.current.flyTo([selected.lat,selected.lng],Math.max(map.current.getZoom(),11),{duration:.45});}lastSelection.current=selected.id;},[selected,ready]);
 useEffect(()=>{if(!ready||!map.current||!lib.current)return;const m=map.current;if(action.type==='home')m.flyTo(origin?[origin.lat,origin.lng]:REGION_CENTER,11);if(action.type==='fit'&&spots.length)m.fitBounds(spots.map(s=>[s.lat,s.lng] as [number,number]),{padding:[55,65],maxZoom:12});if(action.type==='access'&&selected){const pts=[supportedPin(selected,'parking'),supportedPin(selected,'fishing')].filter(Boolean).map(p=>[p!.lat,p!.lng] as [number,number]);if(pts.length)m.fitBounds(pts,{padding:[95,95],maxZoom:18});else m.flyTo([selected.lat,selected.lng],16)}},[action.nonce,ready]);
 return <><div ref={el} className="map-canvas" aria-label="Interactive map of filtered fishing locations"/>{!ready&&!failed&&<div className="map-loading">Opening the map…</div>}{failed?<div className="map-error" role="status">Some map tiles are unavailable. Try the other map layer.</div>:fallback?<div className="map-error" role="status">Detailed imagery unavailable here. Showing overview imagery.</div>:loading&&<div className="map-error" role="status">Loading {layer==='satellite'?'imagery':'map'}…</div>}</>;
}
