
import { connection } from "@/db";
import { category, categoryZodSchema } from "@/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req:NextRequest,{params}:{params:any}){
    try {
        const { userId } = getAuth(req)
        console.log(userId)
        if(!userId){
            return NextResponse.json({success:false,message:"unauthorized"},{status:401})
        }
        const {id}=await params
        const specific=categoryZodSchema.pick({name:true})
        const validation =specific.parse(await req.json())
        if(!id||!validation.name){
            return NextResponse.json({success:false,message:"data is incomplete"},{status:404})
        }
        const [data]=await connection.update(category).set({
            name:validation.name
        })
        .where(and(eq(category.id,id),eq(category.userId,userId))).returning()
        if(!data){
            return NextResponse.json({success:true,message:"account not found"},{status:404})
        }
        return NextResponse.json({success:true})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:(error as Error).message})
    }
}