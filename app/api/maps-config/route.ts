import {env} from '../../../lib/runtime';
import {getUserId} from '../../../lib/auth/server';
import {publicMapsConfig} from '../../../lib/maps-config';
export async function GET(){
 return Response.json(publicMapsConfig(env),{headers:{'Cache-Control':'no-store'}});
}
