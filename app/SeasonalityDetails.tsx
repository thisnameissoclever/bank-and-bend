import {MONTH_LABELS,MONTH_SHORT_LABELS,seasonAssessment,seasonalCalendar,validSeasonality,validSeasonDate} from '../lib/seasonality';
import type {SeasonalSpotLike,SeasonDate} from '../lib/seasonality';
import styles from './SeasonalityDetails.module.css';

type SourceLink={id:string;title:string;url:string};
export default function SeasonalityDetails({spot,date}:{spot:SeasonalSpotLike&{sources?:SourceLink[]};date?:SeasonDate}){
 const assessment=seasonAssessment(spot,date);
 const months=seasonalCalendar(spot);
 const currentMonth=validSeasonDate(assessment.asOf)?Number(assessment.asOf.slice(5,7))-1:-1;
 const profile=validSeasonality(spot.seasonality)?spot.seasonality:null;
 const links=(ids:string[])=>spot.sources?.filter(source=>ids.includes(source.id)&&/^https?:\/\//.test(source.url))??[];
 const recentLinks=links(assessment.sourceIds);
 const profileLinks=links(profile?.sourceIds??[]);
 const scoreText=(score:number|null)=>score===null?'?':Number.isInteger(score)?String(score):score.toFixed(1);
 return <section className={styles.panel} aria-label="Seasonal fishing prospects">
  <div className={styles.heading}><h3>Current-season prospects</h3><strong>{scoreText(assessment.score)}<span>/10</span></strong></div>
  <div className={styles.meta}><b>{assessment.basis==='recent'?'Recent assessment':assessment.basis==='calendar'?'Monthly baseline':'Assessment needed'}</b>{assessment.asOf&&<span>For {assessment.asOf}</span>}</div>
  <p>{assessment.reason}</p>
  {assessment.basis==='recent'&&<div className={styles.recent}>
   <b>Applies {assessment.from} through {assessment.through}</b>
   <span>Checked {assessment.reviewedAt}. After this period, the monthly baseline applies when available.</span>
   {recentLinks.length>0&&<div className={styles.sources}>{recentLinks.map(source=><a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>)}</div>}
  </div>}
  {assessment.basis==='unknown'&&assessment.reviewedAt&&<p className={styles.muted}>Previous assessment: {assessment.reviewedAt}</p>}
  <h4>Typical pattern by month</h4>
  <p className={styles.muted}>These ratings estimate a typical year. Current access and retention conditions are listed separately.</p>
  <ol className={styles.months} aria-label="Typical monthly prospects, rated from 1 to 10">
   {months.map((score,index)=><li key={MONTH_LABELS[index]} className={index===currentMonth?styles.currentMonth:undefined} aria-current={index===currentMonth?'true':undefined} aria-label={`${MONTH_LABELS[index]}: ${score===null?'unknown':score+' out of 10'}${index===currentMonth?', current month':''}`}>
    <span>{MONTH_SHORT_LABELS[index]}</span><b>{scoreText(score)}</b>
   </li>)}
  </ol>
  {profile?<>
   {assessment.basis!=='calendar'&&<p>{profile.rationale}</p>}
   <p className={styles.muted}>Monthly profile reviewed {profile.reviewedAt}.</p>
   {profileLinks.length>0&&<div className={styles.sources}>{profileLinks.map(source=><a key={source.id} href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>)}</div>}
  </>:<p className={styles.muted}>A monthly profile has not been established for this location.</p>}
 </section>;
}
