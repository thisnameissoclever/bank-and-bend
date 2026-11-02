import {test} from 'node:test';
import assert from 'node:assert/strict';
import {verifiedIdentity} from '../lib/auth/verified-identity.ts';
import {safeReturnPath} from '../lib/auth/return-path.ts';

test('unverified and expired accounts never trigger a private ownership lookup',async()=>{
 let queries=0;
 const lookup=async()=>{queries++;return 'legacy-owner';};
 for(const error of [{name:'AuthSessionMissingError'},{name:'AuthApiError',status:401},{name:'AuthApiError',status:403}]){
  assert.equal(await verifiedIdentity(async()=>({data:{user:{id:'untrusted'}},error}),lookup),null);
 }
 assert.equal(await verifiedIdentity(async()=>({data:{user:null},error:null}),lookup),null);
 assert.equal(queries,0);
});
test('authentication outages cannot fall back to an unverified identity',async()=>{
 await assert.rejects(verifiedIdentity(async()=>({data:{user:{id:'untrusted'}},error:{name:'AuthRetryableFetchError',status:503}}),async()=>{assert.fail('No database lookup permitted');}),/verify/);
});
test('only the verified account is used to resolve a migrated journal',async()=>{
 const verify=async()=>({data:{user:{id:'verified-account'}},error:null});
 assert.equal(await verifiedIdentity(verify,async id=>{assert.equal(id,'verified-account');return 'legacy-owner';}),'legacy-owner');
 assert.equal(await verifiedIdentity(verify,async()=>null),'verified-account');
});
test('OAuth return destinations stay within the map and cannot loop through auth',()=>{
 for(const value of ['//outside.example','https://outside.example','/\\outside.example','/auth/callback','/auth/complete','/auth/sign-in','\n//outside.example'])assert.equal(safeReturnPath(value),'/');
 assert.equal(safeReturnPath('/?filters=lake#spot=example'),'/?filters=lake#spot=example');
});
