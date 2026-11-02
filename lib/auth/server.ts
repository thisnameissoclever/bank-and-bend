import {createNeonAuth} from '@neon/auth/next/server';
import {getDatabase} from '../database';
let instance:ReturnType<typeof createNeonAuth>|undefined;
/** Initialize only when a request needs authentication. */
export function getAuth(){
 const baseUrl=process.env.NEON_AUTH_BASE_URL,secret=process.env.NEON_AUTH_COOKIE_SECRET;
 if(!baseUrl||!secret)throw new Error('Authentication is not configured.');
 return instance??=createNeonAuth({baseUrl,cookies:{secret,sessionDataTtl:300}});
}
/** Map a verified session to its private migrated account, if one was linked. */
export async function getUserId():Promise<string|null>{
 const {data:session,error}=await getAuth().getSession();
 if(error)throw new Error('Could not verify the session.');
 if(!session?.user?.id)return null;
 const link=await getDatabase().prepare('SELECT legacy_user_id FROM account_links WHERE auth_user_id=$1').bind(session.user.id).first<{legacy_user_id:string}>();
 return link?.legacy_user_id??session.user.id;
}
