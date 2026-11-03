/** Refuse incomplete deployment configuration before contacting PostgreSQL. */
export function databaseConnectionUrl(value:string|undefined):string {
 if(!value)throw new Error('Database is not configured.');
 let url:URL;
 try{url=new URL(value);}catch{throw new Error('Database connection URL is invalid.');}
 if(!['postgres:','postgresql:'].includes(url.protocol))throw new Error('Database connection URL must use PostgreSQL.');
 let password:string;
 try{password=decodeURIComponent(url.password);}catch{throw new Error('Database password encoding is invalid.');}
 if(!password||/^(?:[<\[]?(?:redacted|password|your[-_ ]?password)[>\]]?|[*•]+)$/i.test(password)){
  throw new Error('Database password is missing or is a placeholder.');
 }
 return value;
}
