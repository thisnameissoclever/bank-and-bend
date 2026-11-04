import {createServerClient} from '@supabase/ssr';
import {cookies} from 'next/headers';
import {getDatabase} from '../database';
import {authConfiguration} from './configuration';
import {verifiedIdentity} from './verified-identity';

/** Bind authentication to this request's cookies, never a shared server client. */
export async function getAuth(){
 const config=authConfiguration();
 const cookieStore=await cookies();
 return createServerClient(config.url,config.publishableKey,{
  cookies:{
   getAll(){return cookieStore.getAll();},
   setAll(values){
    // Server Components cannot write cookies. The proxy refreshes them first.
    try{for(const {name,value,options} of values)cookieStore.set(name,value,options);}catch{}
   },
  },
 });
}

/** Verify the account with Auth before resolving any migrated private records. */
export async function getUserId():Promise<string|null>{
 const client=await getAuth();
 return verifiedIdentity(()=>client.auth.getUser(),async id=>{
  const link=await getDatabase().prepare('SELECT legacy_user_id FROM account_links WHERE auth_user_id=$1').bind(id).first<{legacy_user_id:string}>();
  return link?.legacy_user_id??null;
 });
}
