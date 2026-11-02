import type {Spot,WaterQuality} from '../lib/model';
import {isStale} from '../lib/model';

const labels:Record<WaterQuality['status'],string>={
 'none-reported':'County reports no advisory',
 'none-found':'No active advisory found',
 caution:'Algae caution',
 active:'Active water advisory',
 unavailable:'Advisory status unavailable'
};

const labelFor=(review:WaterQuality)=>review.category==='fish-consumption'&&review.status==='active'?'Fish consumption limits':labels[review.status];

export function WaterQualityBadge({review}:{review:WaterQuality}){
 return <div className={'water-review-badge '+(['active','caution'].includes(review.status)?'caution':'')}>{labelFor(review)} · {review.checkedAt}</div>;
}

export default function WaterQualityDetails({spot}:{spot:Spot}){
 const review=spot.waterQuality;
 if(!review)return null;
 const sources=spot.sources.filter(source=>review.sourceIds.includes(source.id));
 return <section className={'water-review '+(['active','caution'].includes(review.status)?'caution':'')} aria-label="Water advisory review">
  <span className="water-review-label">Water advisory review</span>
  <h3>{labelFor(review)}</h3>
  <p>{review.summary}</p>
  {review.limitation&&<p className="water-review-limit">{review.limitation}</p>}
  <div className="water-review-dates">
   <span>Checked {review.checkedAt}{isStale(review.checkedAt)?' · Review is over 14 days old':''}</span>
   {review.sourceUpdatedAt&&<span>County record updated {review.sourceUpdatedAt}</span>}
   {review.lastSampleDate&&<span>Latest published sample {review.lastSampleDate}</span>}
   <span title={review.nextReviewAction}>Next review due {review.nextReviewAt}</span>
  </div>
  <details className="research-details"><summary>Sources for this finding ({sources.length})</summary>
   <ul>{sources.map(source=><li key={source.id}><a href={source.url} target="_blank" rel="noreferrer">{source.title}</a></li>)}</ul>
  </details>
 </section>;
}
