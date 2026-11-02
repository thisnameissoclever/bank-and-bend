import type {Spot} from '../lib/model';
import {pacificDate} from '../lib/seasonality';
import {stockingEventLabel,stockingEventText,sortedStockingEvents} from '../lib/stocking';
import type {StockingEvent} from '../lib/stocking';
import styles from './StockingDetails.module.css';

export default function StockingDetails({spot}:{spot:Spot}){
 const review=spot.stocking;
 if(!review)return null;
 const today=pacificDate();
 const events=sortedStockingEvents(review.events,today);
 const sources=spot.sources.filter(source=>review.sourceIds.includes(source.id));
 const eventRow=(event:StockingEvent,index:number)=><li key={`${event.status}-${event.date}-${event.species}-${index}`}>
  <div className={styles.eventHeader}>
   <b className={event.status==='confirmed'?styles.confirmed:styles.scheduled}>{stockingEventLabel(event)}</b>
   <span>{event.date}{event.through&&event.through!==event.date?' to '+event.through:''}</span>
  </div>
  <p>{stockingEventText(event)}</p>
  {event.notes&&<p className={styles.muted}>{event.notes}</p>}
 </li>;
 return <section className={styles.panel} aria-label="Latest stocking information">
  <h3>Stocking</h3>
  <p>{review.summary}</p>
  {events.length>0&&<ul className={styles.events}>{events.slice(0,3).map(eventRow)}</ul>}
  {events.length>3&&<details className={styles.more}><summary>More stocking records ({events.length-3})</summary><ul className={styles.events}>{events.slice(3).map(eventRow)}</ul></details>}
  {review.limitation&&<p className={styles.muted}>{review.limitation}</p>}
  <div className={styles.dates}><span>Checked {review.checkedAt}</span><span>{review.nextReviewAt<today?'Review overdue':'Next review'} {review.nextReviewAt}</span></div>
  <details className={styles.more}><summary>Stocking sources ({sources.length})</summary><ul>{sources.map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a><p className={styles.muted}>{source.supports}</p></li>)}</ul></details>
 </section>;
}
