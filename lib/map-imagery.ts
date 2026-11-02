export const IMAGERY_OVERVIEW='https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile';
export const IMAGERY_DETAIL='https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer/exportImage';
export const IMAGERY_ATTRIBUTION='Imagery: <a href="https://imagery.nationalmap.gov/arcgis/rest/services/USGSNAIPImagery/ImageServer" target="_blank" rel="noopener noreferrer">USGS / USDA NAIP</a>';
export type TileCoordinate={x:number;y:number;z:number};
const WEB_MERCATOR_LIMIT=20037508.342789244;
export function tileBounds({x,y,z}:TileCoordinate):[number,number,number,number]{
 const side=2*WEB_MERCATOR_LIMIT/2**z;
 return [-WEB_MERCATOR_LIMIT+x*side,WEB_MERCATOR_LIMIT-(y+1)*side,-WEB_MERCATOR_LIMIT+(x+1)*side,WEB_MERCATOR_LIMIT-y*side];
}
export function imageryTileUrl(coords:TileCoordinate){
 // Fast national overview at wide scales; request real source imagery close up.
 // Do not cap satellite tiles at z16 and stretch them at the bank-inspection zoom.
 if(coords.z<16)return `${IMAGERY_OVERVIEW}/${coords.z}/${coords.y}/${coords.x}`;
 const params=new URLSearchParams({f:'image',bbox:tileBounds(coords).join(','),bboxSR:'3857',imageSR:'3857',size:'512,512',format:'jpg',compressionQuality:'95',bandIds:'0,1,2',interpolation:'RSP_BilinearInterpolation'});
 return `${IMAGERY_DETAIL}?${params}`;
}

// A service can return HTTP 200 with a completely black or transparent image.
// Preserve real dark water, shadows, and any image containing visible detail.
export function isEmptyImagery(rgba:ArrayLike<number>):boolean {
 if(rgba.length===0)return true;
 for(let i=0;i<rgba.length;i+=4){
  if(rgba[i+3]>0&&(rgba[i]>3||rgba[i+1]>3||rgba[i+2]>3))return false;
 }
 return true;
}

export function overviewFallback(coords:TileCoordinate){
 const z=Math.min(coords.z,15),factor=2**(coords.z-z);
 const parent={x:Math.floor(coords.x/factor),y:Math.floor(coords.y/factor),z};
 return {url:`${IMAGERY_OVERVIEW}/${z}/${parent.y}/${parent.x}`,
  // Normalized crop within the parent image; preserves the child's ground bounds.
  crop:[(coords.x-parent.x*factor)/factor,(coords.y-parent.y*factor)/factor,1/factor,1/factor] as const};
}

export async function loadImagery<T>(coords:TileCoordinate,load:(url:string)=>Promise<T>,signal?:AbortSignal){
 try{return {image:await load(imageryTileUrl(coords)),fallback:false,crop:[0,0,1,1] as readonly number[]};}
 catch(error){
  if(signal?.aborted||coords.z<16)throw error;
  const fallback=overviewFallback(coords);
  return {image:await load(fallback.url),fallback:true,crop:fallback.crop};
 }
}
