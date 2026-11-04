'use client';
import {useEffect} from 'react';
import {safeReturnPath} from '../../../lib/auth/return-path';
import '../sign-in/signin.css';
/** Restore an app-local destination after the fixed, allowlisted OAuth callback. */
export default function Complete(){
 useEffect(()=>{
  let destination='/';
  try{destination=safeReturnPath(sessionStorage.getItem('bank-bend-auth-return'));sessionStorage.removeItem('bank-bend-auth-return');}catch{}
  window.location.replace(destination);
 },[]);
 return <main className="auth-page"><section className="auth-card"><h1>Signed in</h1><p>Returning to the map.</p><a href="/">Open the map</a></section></main>;
}
