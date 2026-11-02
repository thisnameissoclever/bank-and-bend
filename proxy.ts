import type {NextRequest} from 'next/server';
import {getAuth} from './lib/auth/server';
export default function proxy(req:NextRequest){return getAuth().middleware({loginUrl:'/auth/sign-in',publicRoutes:['/','/auth/*','/api/*','/mcp']})(req);}
export const config={matcher:['/((?!_next/static|_next/image|favicon.ico|favicon.svg|.*\\.(?:png|jpg|svg|woff2)$).*)']};
