import {test} from 'node:test';
import assert from 'node:assert/strict';
import {imageryTileUrl,tileBounds,IMAGERY_DETAIL,IMAGERY_OVERVIEW,isEmptyImagery,overviewFallback,loadImagery} from '../lib/map-imagery.ts';
test('wide views use cached overview and close views request native source imagery',()=>{
 assert.equal(new URL(IMAGERY_DETAIL).hostname,'imagery.nationalmap.gov');
 assert.equal(imageryTileUrl({x:1,y:2,z:9}),`${IMAGERY_OVERVIEW}/9/2/1`);
 for(const z of [16,17,18,19]){const url=new URL(imageryTileUrl({x:41613,y:93213,z}));assert.equal(url.origin+url.pathname,IMAGERY_DETAIL);assert.equal(url.searchParams.get('size'),'512,512');assert.equal(url.searchParams.get('bboxSR'),'3857');assert.equal(url.searchParams.get('imageSR'),'3857');assert.equal(url.searchParams.get('bandIds'),'0,1,2')}
});

test('blank image detection catches successful black responses and preserves dark water',()=>{
 assert.equal(isEmptyImagery(new Uint8ClampedArray(512*512*4)),true);
 assert.equal(isEmptyImagery([0,0,0,255,2,3,1,255]),true);
 assert.equal(isEmptyImagery([200,200,200,0]),true);
 assert.equal(isEmptyImagery([5,8,12,255]),false);
 assert.equal(isEmptyImagery([0,0,0,255,20,30,40,255]),false);
});

test('overview fallback crops the correct parent quadrant at every supported detail zoom',()=>{
 for(const z of [16,17,18,19]){
  const factor=2**(z-15),x=5201*factor+factor-1,y=11639*factor+1;
  const fallback=overviewFallback({x,y,z});
  assert.equal(fallback.url,`${IMAGERY_OVERVIEW}/15/11639/5201`);
  assert.deepEqual(fallback.crop,[(factor-1)/factor,1/factor,1/factor,1/factor]);
  const parent=tileBounds({x:5201,y:11639,z:15}),child=tileBounds({x,y,z});
  assert.ok(Math.abs(parent[0]+fallback.crop[0]*(parent[2]-parent[0])-child[0])<1e-7);
  assert.ok(Math.abs(parent[3]-fallback.crop[1]*(parent[3]-parent[1])-child[3])<1e-7);
 }
});

test('a failed or empty detail image uses one overview fallback',async()=>{
 const coords={x:41613,y:93213,z:18},calls:string[]=[];
 const result=await loadImagery(coords,async url=>{calls.push(url);if(calls.length===1)throw new Error('Empty imagery');return 'image';});
 assert.equal(result.fallback,true);assert.equal(result.image,'image');
 assert.deepEqual(calls,[imageryTileUrl(coords),overviewFallback(coords).url]);
});

test('success, total failure and cancelled tiles do not start unnecessary retries',async()=>{
 const coords={x:41613,y:93213,z:18};let calls=0;
 assert.equal((await loadImagery(coords,async()=>{calls++;return 'image';})).fallback,false);
 assert.equal(calls,1);calls=0;
 await assert.rejects(loadImagery(coords,async()=>{calls++;throw new Error('offline');}));assert.equal(calls,2);
 const controller=new AbortController();controller.abort();calls=0;
 await assert.rejects(loadImagery(coords,async()=>{calls++;throw new Error('cancelled');},controller.signal));assert.equal(calls,1);
 calls=0;await assert.rejects(loadImagery({...coords,z:15},async()=>{calls++;throw new Error('offline');}));assert.equal(calls,1);
});
test('image tile extents meet without gaps and align with Web Mercator coordinates',()=>{
 const a=tileBounds({x:41613,y:93213,z:18}),right=tileBounds({x:41614,y:93213,z:18}),below=tileBounds({x:41613,y:93214,z:18});
 assert.equal(a[2],right[0]);assert.equal(a[1],below[3]);assert.ok(a[0]<a[2]&&a[1]<a[3]);
 const x=Math.floor((-122.853219+180)/360*2**18),lat=46.047106*Math.PI/180,y=Math.floor((1-Math.asinh(Math.tan(lat))/Math.PI)/2*2**18),b=tileBounds({x,y,z:18});
 const px=6378137*(-122.853219*Math.PI/180),py=6378137*Math.log(Math.tan(Math.PI/4+lat/2));assert.ok(px>=b[0]&&px<=b[2]&&py>=b[1]&&py<=b[3]);
 assert.ok(Math.abs((a[2]-a[0])*2-(tileBounds({x:20806,y:46606,z:17})[2]-tileBounds({x:20806,y:46606,z:17})[0]))<1e-7);
});
