import {getDatabase} from './database';
export const env={
 get DB(){return getDatabase();},
 get AVAILABILITY_EDITOR_ID(){return process.env.AVAILABILITY_EDITOR_ID;},
 get GOOGLE_MAPS_BROWSER_KEY(){return process.env.GOOGLE_MAPS_BROWSER_KEY;},
};
