import type {Journal, JournalRecord, Spot} from './model';

export const DEVICE_FAVORITES_KEY = 'bank-bend-device-favorites-v1';
export type FavoriteOverrides = Record<string, boolean>;

/** Read only known spot IDs and boolean choices from device storage. */
export function readDeviceFavorites(raw:string|null, spots:Spot[]):FavoriteOverrides {
 try {
  const value:unknown=JSON.parse(raw??'{}');
  if(!value||typeof value!=='object'||Array.isArray(value))return {};
  return Object.fromEntries(spots.flatMap(s=>typeof (value as FavoriteOverrides)[s.id]==='boolean'?[[s.id,(value as FavoriteOverrides)[s.id]]]:[]));
 } catch { return {}; }
}

/** Apply local favorite choices while preserving the rest of each journal entry. */
export function applyDeviceFavorites(journal:Journal, spots:Spot[], favorites:FavoriteOverrides):Journal {
 const next={...journal};
 for(const spot of spots)if(typeof favorites[spot.id]==='boolean') {
  const record=next[spot.id]??{visited:spot.history.visited,rating:null,notes:'',lastVisited:'',favorite:false,revision:0};
  next[spot.id]={...record,favorite:favorites[spot.id]};
 }
 return next;
}

/** Keep unsaved comments when a favorite changes; preserve conflicts with other edits. */
export function refreshJournalDraft(draft:JournalRecord, previous:JournalRecord, current:JournalRecord):JournalRecord {
 const fields=['visited','rating','notes','lastVisited'] as const;
 if(fields.every(key=>draft[key]===previous[key]))return current;
 if(fields.every(key=>current[key]===previous[key]))return {...draft,favorite:current.favorite,revision:current.revision};
 return draft;
}
