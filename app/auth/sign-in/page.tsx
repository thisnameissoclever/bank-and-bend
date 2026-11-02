'use client';
import {useState,useEffect} from 'react';
import {authClient} from '../../../lib/auth/client';
import {safeReturnPath} from '../../../lib/auth/return-path';
import './signin.css';
export default function SignIn(){
 const [email,setEmail]=useState(''),[password,setPassword]=useState(''),[name,setName]=useState(''),[create,setCreate]=useState(false),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[signedIn,setSignedIn]=useState(false);
 useEffect(()=>{void authClient.getSession().then(({data})=>setSignedIn(!!data?.user));},[]);
 async function submit(e:React.FormEvent){e.preventDefault();setBusy(true);setMessage('');try{
  const result=create?await authClient.signUp.email({email,password,name}):await authClient.signIn.email({email,password});
  if(result.error){setMessage(result.error.message||'Could not sign in. Please try again.');return;}
  const session=await authClient.getSession();
  if(!session.data?.user){setMessage('Check your email to verify your account, then sign in.');return;}
  window.location.assign(safeReturnPath(new URLSearchParams(window.location.search).get('return_to')));
 }catch{setMessage('Sign-in is temporarily unavailable. Please try again.');}finally{setBusy(false);}}
 return <main className="auth-page"><section className="auth-card"><a href="/" className="auth-brand">Bank & Bend</a><h1>{signedIn?'Your account':create?'Create an account':'Sign in'}</h1><p>Save your favorites, visits, comments, and filters across devices.</p>{signedIn?<><p>You are signed in.</p><a href="/">Return to the map</a><button onClick={async()=>{await authClient.signOut();window.location.assign('/');}}>Sign out</button></>:<form onSubmit={submit}>{create&&<label>Name<input required value={name} onChange={e=>setName(e.target.value)} autoComplete="name"/></label>}<label>Email<input required type="email" value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username"/></label><label>Password<input required type="password" minLength={8} value={password} onChange={e=>setPassword(e.target.value)} autoComplete={create?'new-password':'current-password'}/></label><p role="status">{message}</p><button disabled={busy} type="submit">{busy?'Please wait':create?'Create account':'Sign in'}</button><button className="auth-switch" type="button" onClick={()=>{setCreate(!create);setMessage('');}}>{create?'Already have an account? Sign in':'Create an account'}</button></form>}<a href="/" className="auth-back">Browse the map</a></section></main>;
}
