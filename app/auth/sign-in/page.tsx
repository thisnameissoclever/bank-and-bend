'use client';
import {useEffect,useState} from 'react';
import {getBrowserAuth} from '../../../lib/auth/client';
import {safeReturnPath} from '../../../lib/auth/return-path';
import './signin.css';

export default function SignIn(){
 const [busy,setBusy]=useState(false),[message,setMessage]=useState(''),[signedIn,setSignedIn]=useState(false);
 useEffect(()=>{
  if(new URLSearchParams(window.location.search).has('error'))setMessage('Google sign-in did not finish. Please try again.');
  try{void getBrowserAuth().auth.getUser().then(({data})=>setSignedIn(!!data.user)).catch(()=>{});}catch{setMessage('Sign-in is not configured yet. You can still browse the map.');}
 },[]);
 async function signIn(){
  setBusy(true);setMessage('');
  try{
   const returnTo=safeReturnPath(new URLSearchParams(window.location.search).get('return_to'));
   // Exact allowlisted callback; the return destination stays in this browser.
   try{sessionStorage.setItem('bank-bend-auth-return',returnTo);}catch{}
   const {error}=await getBrowserAuth().auth.signInWithOAuth({provider:'google',options:{redirectTo:new URL('/auth/callback',window.location.origin).href,scopes:'openid email profile'}});
   if(error)throw error;
  }catch{setMessage('Could not start Google sign-in. Please try again.');setBusy(false);}
 }
 async function signOut(){
  setBusy(true);
  try{const {error}=await getBrowserAuth().auth.signOut();if(error)throw error;window.location.assign('/');}
  catch{setMessage('Could not sign out. Please try again.');setBusy(false);}
 }
 return <main className="auth-page"><section className="auth-card"><a href="/" className="auth-brand">Bank & Bend</a><h1>{signedIn?'Your account':'Sign in'}</h1><p>Save your favorites, visits, comments, and filters across devices.</p><div className="auth-actions">{signedIn?<><p>You are signed in.</p><a href="/">Return to the map</a><button disabled={busy} onClick={signOut}>Sign out</button></>:<button disabled={busy} onClick={signIn}>{busy?'Opening Google…':'Continue with Google'}</button>}<p role="status">{message}</p></div><a href="/" className="auth-back">Browse the map</a></section></main>;
}
