import {Heart,RefreshCw} from 'lucide-react';

export default function FavoriteButton({name,favorite,busy=false,disabled=false,compact=false,onClick}:{name:string;favorite:boolean;busy?:boolean;disabled?:boolean;compact?:boolean;onClick:()=>void}) {
 const label=favorite?'Remove from favorites':'Add to favorites';
 return <button type="button" className={'favorite-button '+(favorite?'is-favorite ':'')+(compact?'is-compact':'')} aria-label={label+': '+name} aria-pressed={favorite} aria-busy={busy} title={label} disabled={disabled||busy} onClick={onClick}>
  {busy?<RefreshCw size={19} className="spinning"/>:<Heart size={19} fill={favorite?'currentColor':'none'}/>}
  {!compact&&<span>{busy?'Saving…':favorite?'Favorited':'Add to favorites'}</span>}
 </button>;
}
