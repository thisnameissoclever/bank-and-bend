import {getAuth} from '../../../../lib/auth/server';
type Context={params:Promise<{path:string[]}>};
export const dynamic='force-dynamic';
export function GET(req:Request,context:Context){return getAuth().handler().GET(req,context);}
export function POST(req:Request,context:Context){return getAuth().handler().POST(req,context);}
export function PUT(req:Request,context:Context){return getAuth().handler().PUT(req,context);}
export function PATCH(req:Request,context:Context){return getAuth().handler().PATCH(req,context);}
export function DELETE(req:Request,context:Context){return getAuth().handler().DELETE(req,context);}
