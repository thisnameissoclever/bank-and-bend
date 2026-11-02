/** Keep sign-in redirects on this application. */
export function safeReturnPath(value:string|null):string {
 if(!value||!value.startsWith('/')||value.startsWith('//'))return '/';
 try{const url=new URL(value,'https://app.local');return url.origin==='https://app.local'&&!url.pathname.startsWith('/auth/')?url.pathname+url.search+url.hash:'/';}catch{return '/';}
}
