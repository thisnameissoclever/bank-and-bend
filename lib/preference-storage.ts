/** Replace supplied top-level preference values atomically. */
export function preferenceWriteSql(_keys:string[]):string {
 return `INSERT INTO preferences(user_id,payload,updated_at) VALUES($1,$2,$3) ON CONFLICT(user_id) DO UPDATE SET payload=(preferences.payload::jsonb || excluded.payload::jsonb)::text,updated_at=excluded.updated_at`;
}
