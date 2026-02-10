import { connection } from "@/db";
import { accounts, accountZodSchema } from "@/db/schema";
import { clerkClient, getAuth } from "@clerk/nextjs/server";
import { and, eq, inArray } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    const {userId}=getAuth(req)
    if(!userId){
        return NextResponse.json({success:false,message:"unauthorized"})
    }
    const data=await connection.select(
        {id:accounts.id,name:accounts.name}
    )//you can replace accounts with specific data
    .from(accounts)//schema
    .where(eq(accounts.userId,userId)) //it will fetch user data only
    return NextResponse.json({success:true,data})
}
export async function POST(req: NextRequest){
    try {
    const {userId}=getAuth(req)
    if(!userId){
        return NextResponse.json({success:false,message:"unauthorized"},{status:401})
    }
    const specific=accountZodSchema.pick({name:true})
    const bodyZod=specific.parse(await req.json())
    const [data]=await connection.insert(accounts).values({
        id:crypto.randomUUID(),
        ...bodyZod,
        userId
    }).returning()
    return NextResponse.json({
        success:true
    })
    } catch (error) {
        console.log("account err =>",error)
        return NextResponse.json({success:false,message:(error as Error).message})
    }
}
export async function DELETE(req:NextRequest){
    try {
       const searchParams=req.nextUrl.searchParams
       const Ids=searchParams.get("Ids")
       console.log("errrrrrrrr",Ids)
       const {userId}=await getAuth(req)
       if(!userId){
        return NextResponse.json({success:false,message:"unAuthorized"},{status:401})
       }
       if(!Ids){
        return NextResponse.json({success:false,message:"Missing Ids parameter"},{status:400})
       }
       const array=Ids.split(",")
       const data=await connection.delete(accounts)
       .where(and(inArray(accounts.id,array),eq(accounts.userId,userId))).returning()
       if(data.length===0){
        return NextResponse.json({ success: false ,message:"Not Found"},{status:404})
       }
       return NextResponse.json({ success: true })
    } catch (error) {
       return NextResponse.json({success:false,message:(error as Error).message});
    }
}