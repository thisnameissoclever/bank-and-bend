/// <reference types="google.maps" />
export const GOOGLE_AUTH_FAILURE='bank-bend-google-auth-failure';
export function googleMapsScriptUrl(key:string){
 const params=new URLSearchParams({key,v:'quarterly',loading:'async',callback:'__bankBendGoogleReady',auth_referrer_policy:'origin'});
 return `https://maps.googleapis.com/maps/api/js?${params}`;
}
export function createGoogleMapsLoader(){
 let pending:Promise<typeof google>|undefined;
 return function load(key:string):Promise<typeof google>{
 if(pending)return pending;
 pending=new Promise((resolve,reject)=>{
  const globals=window as typeof window & {__bankBendGoogleReady?:()=>void;gm_authFailure?:()=>void};
  const script=document.createElement('script');
  let settled=false;
  const cleanup=()=>{clearTimeout(timer);delete globals.__bankBendGoogleReady;};
  const fail=(message:string)=>{if(settled)return;settled=true;cleanup();reject(new Error(message));};
  const timer=setTimeout(()=>fail('Google Maps took too long to load.'),20000);
  globals.__bankBendGoogleReady=()=>{if(settled)return;settled=true;cleanup();resolve(google);};
  globals.gm_authFailure=()=>{window.dispatchEvent(new Event(GOOGLE_AUTH_FAILURE));fail('Google Maps could not authorize this site.');};
  script.async=true;script.src=googleMapsScriptUrl(key);
  script.onerror=()=>fail('Google Maps could not be reached.');
  document.head.appendChild(script);
 });
 return pending;
}
}
export const loadGoogleMaps=createGoogleMapsLoader();
