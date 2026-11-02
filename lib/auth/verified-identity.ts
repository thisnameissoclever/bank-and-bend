type Verification={data:{user:{id:string}|null};error:{name:string;status?:number}|null};

/** Resolve legacy ownership only after a server-verified Auth response. */
export async function verifiedIdentity(
 verify:()=>Promise<Verification>,
 lookup:(id:string)=>Promise<string|null>,
):Promise<string|null>{
 const {data,error}=await verify();
 if(error){
  if(error.name==='AuthSessionMissingError'||error.status===400||error.status===401||error.status===403)return null;
  throw new Error('Could not verify the session.');
 }
 if(!data.user?.id)return null;
 return await lookup(data.user.id)??data.user.id;
}
