export type StockingEvent={
 date:string;
 through?:string;
 status:'confirmed'|'scheduled';
 species:string;
 quantity:number|null;
 size:string|null;
 fishPerPound?:number;
 lifeStage?:string;
 sourceIds:string[];
 notes?:string;
};
export type StockingReview={
 waterbody:string;
 status:'confirmed-record'|'schedule-only'|'no-record'|'discontinued'|'private-managed'|'unavailable';
 summary:string;
 limitation?:string;
 checkedAt:string;
 nextReviewAt:string;
 sourceIds:string[];
 events:StockingEvent[];
};

/** A passed schedule date remains a plan until a source confirms delivery. */
export function stockingEventLabel(event:StockingEvent):string{
 return event.status==='confirmed'?'Confirmed delivery':'Scheduled';
}

export function stockingEventText(event:StockingEvent):string{
 const quantity=event.quantity===null?'Quantity not reported':event.quantity.toLocaleString('en-US');
 return `${quantity} ${event.species}${event.size?' · '+event.size:''}`;
}

/** Show upcoming plans first, then recent delivered or past planned events. */
export function sortedStockingEvents(events:StockingEvent[],today:string):StockingEvent[]{
 return [...events].sort((a,b)=>{
  const upcoming=(event:StockingEvent)=>event.status==='scheduled'&&(event.through??event.date)>=today;
  const au=upcoming(a),bu=upcoming(b);
  if(au!==bu)return au?-1:1;
  return au?a.date.localeCompare(b.date):b.date.localeCompare(a.date);
 });
}
