export const NOTES_LIMIT=8000;

export function appendComment(notes:string,comment:string,now=new Date()):string{
 const text=comment.trim();
 if(!text)throw new Error('Write a comment before saving.');
 const date=new Intl.DateTimeFormat('en-US',{month:'long',day:'numeric',year:'numeric',timeZone:'America/Los_Angeles'}).format(now);
 const next=notes+(notes?'\n\n':'')+date+':\n'+text;
 if(next.length>NOTES_LIMIT)throw new Error('This location has reached its 8,000-character notes limit. Shorten your comment or edit the saved notes.');
 return next;
}
