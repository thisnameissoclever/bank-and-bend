'use client';
import {createBrowserClient} from '@supabase/ssr';
import {authConfiguration} from './configuration';
/** Let Supabase maintain one browser client with persistent, refreshed sessions. */
export function getBrowserAuth(){
 const config=authConfiguration();
 return createBrowserClient(config.url,config.publishableKey);
}
