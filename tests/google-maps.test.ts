import {test} from 'node:test';
import assert from 'node:assert/strict';
import {publicMapsConfig} from '../lib/maps-config.ts';
import {createGoogleMapsLoader,googleMapsScriptUrl,GOOGLE_AUTH_FAILURE} from '../lib/google-maps-loader.ts';
test('public config exposes only the intended browser key',()=>{
 const runtime={GOOGLE_MAPS_BROWSER_KEY:' browser-key ',AVAILABILITY_EDITOR_ID:'private-id',SERVER_SECRET:'private-secret'};
 assert.deepEqual(publicMapsConfig(runtime),{provider:'google',browserKey:'browser-key'});
 assert.deepEqual(publicMapsConfig({}),{provider:'usgs',browserKey:null});
 assert.deepEqual(publicMapsConfig({GOOGLE_MAPS_BROWSER_KEY:'  '}),{provider:'usgs',browserKey:null});
});
test('loader URL uses the supported API and encodes the key',()=>{
 const url=new URL(googleMapsScriptUrl('key&unexpected=value'));
 assert.equal(url.origin,'https://maps.googleapis.com');
 assert.equal(url.pathname,'/maps/api/js');
 assert.equal(url.searchParams.get('key'),'key&unexpected=value');
 assert.equal(url.searchParams.get('unexpected'),null);
 assert.equal(url.searchParams.get('loading'),'async');
});
test('one script per page, network rejection, and late authorization failure',async()=>{
 const original={window:globalThis.window,document:globalThis.document,google:globalThis.google};
 const host=new EventTarget() as EventTarget&{__bankBendGoogleReady:()=>void;gm_authFailure:()=>void};
 const scripts:{onerror?:()=>void}[]=[];
 Object.assign(globalThis,{window:host,document:{createElement:()=>({}),head:{appendChild:(s:typeof scripts[number])=>scripts.push(s)}},google:{maps:{}}});
 try{
  const load=createGoogleMapsLoader();const first=load('key');assert.equal(load('key'),first);assert.equal(scripts.length,1);
  host.__bankBendGoogleReady();assert.equal(await first,globalThis.google);
  let authFailed=false;host.addEventListener(GOOGLE_AUTH_FAILURE,()=>{authFailed=true});host.gm_authFailure();assert.equal(authFailed,true);
  const failed=createGoogleMapsLoader()('key');scripts[1].onerror?.();await assert.rejects(failed,/could not be reached/);
  const denied=createGoogleMapsLoader()('key');host.gm_authFailure();await assert.rejects(denied,/could not authorize/);
 }finally{Object.assign(globalThis,original)}
});
