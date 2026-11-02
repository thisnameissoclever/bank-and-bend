import {NextResponse} from 'next/server';
import {getAuth} from '../../../lib/auth/server';

export const dynamic='force-dynamic';
/** Exchange the single-use OAuth code with the PKCE verifier in this browser. */
export async function GET(request:Request){
 const url=new URL(request.url);
 const code=url.searchParams.get('code');
 if(code&&!url.searchParams.has('error')){
  try{
   const client=await getAuth();
   const {error}=await client.auth.exchangeCodeForSession(code);
   if(!error)return NextResponse.redirect(new URL('/auth/complete',url.origin),{headers:{'Cache-Control':'private, no-store'}});
  }catch{}
 }
 return NextResponse.redirect(new URL('/auth/sign-in?error=oauth',url.origin),{headers:{'Cache-Control':'private, no-store'}});
}
