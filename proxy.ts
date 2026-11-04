import {createServerClient} from '@supabase/ssr';
import {NextResponse,type NextRequest} from 'next/server';
import {authConfiguration} from './lib/auth/configuration';

/** Refresh sessions while keeping the public map available without sign-in. */
export default async function proxy(request:NextRequest){
 let response=NextResponse.next({request});
 if(!process.env.NEXT_PUBLIC_SUPABASE_URL||!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)return response;
 const config=authConfiguration();
 const client=createServerClient(config.url,config.publishableKey,{
  cookies:{
   getAll(){return request.cookies.getAll();},
   setAll(values,headers){
    for(const {name,value} of values)request.cookies.set(name,value);
    response=NextResponse.next({request});
    for(const {name,value,options} of values)response.cookies.set(name,value,options);
    for(const [name,value] of Object.entries(headers??{}))response.headers.set(name,value);
   },
  },
 });
 await client.auth.getClaims();
 // Authenticated responses must never be shared between users by a CDN.
 if(request.cookies.getAll().some(cookie=>cookie.name.startsWith('sb-'))||request.nextUrl.pathname.startsWith('/auth/'))response.headers.set('Cache-Control','private, no-store');
 return response;
}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|favicon.svg|.*\\.(?:png|jpg|svg|woff2)$).*)']};
