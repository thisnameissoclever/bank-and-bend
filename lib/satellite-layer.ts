import type * as Leaflet from 'leaflet';
import {IMAGERY_ATTRIBUTION,isEmptyImagery,loadImagery} from './map-imagery';

function loadImage(url:string,signal:AbortSignal):Promise<HTMLImageElement>{
 return new Promise((resolve,reject)=>{
  const image=new Image();
  image.crossOrigin='anonymous';
  const finish=(error?:Error)=>{
   clearTimeout(timeout);signal.removeEventListener('abort',abort);
   image.onload=null;image.onerror=null;
   if(error){image.src='';reject(error);}else resolve(image);
  };
  const abort=()=>finish(new Error('Imagery request cancelled'));
  const timeout=setTimeout(()=>finish(new Error('Imagery request timed out')),30000);
  image.onerror=()=>finish(new Error('Imagery request failed'));
  image.onload=()=>{
   try{
    const canvas=document.createElement('canvas');canvas.width=image.naturalWidth;canvas.height=image.naturalHeight;
    const context=canvas.getContext('2d',{willReadFrequently:true});
    if(!context)throw new Error('Canvas unavailable');
    context.drawImage(image,0,0);
    if(isEmptyImagery(context.getImageData(0,0,canvas.width,canvas.height).data))throw new Error('Empty imagery');
    finish();
   }catch(error){finish(error instanceof Error?error:new Error('Unable to read imagery'));}
  };
  signal.addEventListener('abort',abort,{once:true});
  if(signal.aborted)abort();else image.src=url;
 });
}

export function satelliteLayer(L:typeof Leaflet,onFallback:(visible:boolean)=>void){
 const pending=new Map<HTMLElement,AbortController>(),fallbackTiles=new Set<HTMLElement>();
 class SatelliteLayer extends L.GridLayer {
 override createTile(coords:Leaflet.Coords,done:Leaflet.DoneCallback){
  const tile=document.createElement('canvas');tile.width=512;tile.height=512;
  const controller=new AbortController();pending.set(tile,controller);
  void loadImagery(coords,url=>loadImage(url,controller.signal),controller.signal).then(result=>{
   if(controller.signal.aborted)return;
   const context=tile.getContext('2d');if(!context)throw new Error('Canvas unavailable');
   const [x,y,width,height]=result.crop,image=result.image;
   context.drawImage(image,x*image.naturalWidth,y*image.naturalHeight,width*image.naturalWidth,height*image.naturalHeight,0,0,512,512);
   if(result.fallback){fallbackTiles.add(tile);onFallback(true);}
   done(undefined,tile);
  }).catch(error=>{if(!controller.signal.aborted)done(error,tile);});
  return tile;
 }
 }
 const layer=new SatelliteLayer({maxZoom:19,maxNativeZoom:19,tileSize:256,updateWhenIdle:true,keepBuffer:1,attribution:IMAGERY_ATTRIBUTION});
 layer.on('tileunload',event=>{
  pending.get(event.tile)?.abort();pending.delete(event.tile);
  fallbackTiles.delete(event.tile);onFallback(fallbackTiles.size>0);
 });
 layer.on('remove',()=>{
  for(const controller of pending.values())controller.abort();
  pending.clear();fallbackTiles.clear();onFallback(false);
 });
 return layer;
}
