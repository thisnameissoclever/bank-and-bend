/** Only public connection settings. Never supply a secret or service-role key. */
export function authConfiguration(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const publishableKey=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!publishableKey)throw new Error('Authentication is not configured.');
 return {url,publishableKey};
}
