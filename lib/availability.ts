import {z} from 'zod';

const calendarDate=z.string().refine(value=>/^\d{4}-\d{2}-\d{2}$/.test(value)&&Number.isFinite(Date.parse(value))&&new Date(value).toISOString().slice(0,10)===value,'Use a valid date in YYYY-MM-DD format.');
const dateValue=z.string().refine(value=>{
 if(calendarDate.safeParse(value).success)return true;
 return z.string().datetime({offset:true}).safeParse(value).success;
},'Use a valid date or timestamp.');
const sourceUrl=z.string().url().max(2000).refine(value=>{
 try{const url=new URL(value);return ['https:','http:'].includes(url.protocol)&&!url.username&&!url.password;}catch{return false;}
},'Use a public HTTP or HTTPS source URL.');
export const availabilitySchema=z.object({
 active:z.boolean(),
 reason:z.string().trim().min(3).max(1600),
 checkedAt:dateValue,
 nextReviewAt:dateValue.optional(),
 inactiveFrom:calendarDate.optional(),
 sourceUrls:z.array(sourceUrl).max(20),
}).strict().refine(value=>!value.nextReviewAt||Date.parse(value.nextReviewAt)>=Date.parse(value.checkedAt),{message:'The next review must be on or after the checked date.',path:['nextReviewAt']});
export type AvailabilityInput=z.infer<typeof availabilitySchema>;
export type Availability=AvailabilityInput&{revision:number};
export type AvailabilityRecords=Record<string,Availability>;
export const availabilityWriteSchema=z.object({spotId:z.string().min(1).max(160),expectedRevision:z.number().int().min(0).max(Number.MAX_SAFE_INTEGER-1),availability:availabilitySchema}).strict();
export function canEditAvailability(userId:string|null|undefined,editorId:string|null|undefined):boolean{
 return !!userId&&!!editorId?.trim()&&userId===editorId;
}
export class AvailabilityPermissionError extends Error{
 constructor(){super('Only the site owner can change location availability.');this.name='AvailabilityPermissionError';}
}
export function requireAvailabilityEditor(userId:string|null|undefined,editorId:string|null|undefined):asserts userId is string{
 if(!canEditAvailability(userId,editorId))throw new AvailabilityPermissionError();
}
