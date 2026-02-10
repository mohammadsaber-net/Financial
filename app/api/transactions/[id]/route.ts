import { connection } from "@/db";
import { accounts, category, transactions, transactionsZodSchema } from "@/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { and, eq, inArray, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req:NextRequest,{params}:{params:any}) {
    try {
        const {userId}=getAuth(req)
        if (!userId){
            return NextResponse.json({success:false,message:"unauthorized"},{status:401})
        }
        const {id}=await params
        if (!id){
            return NextResponse.json({success:false,message:"transaction id not found"},{status:404})
        }
        const [data]=await connection.select({
            id:transactions.id,
            category:category.name,
            categoryId:transactions.categoryId,
            payee:transactions.payee,
            amount:transactions.amount,
            note:transactions.notes,
            accountId:transactions.accountId,
            account:accounts.name,
            date:transactions.date
        })
        .from(transactions)
        .innerJoin(accounts, eq(transactions.accountId, accounts.id))
        .leftJoin(category, eq(transactions.categoryId, category.id))
        .where(and(eq(transactions.id,id),eq(accounts.userId,userId)))
        return NextResponse.json({success:true,data})
    } catch (error) {
        return NextResponse.json({success:false,message:(error as Error).message})
    }
}
export async function PATCH(req:NextRequest,{params}:{params:any}){
    try {
        const { userId } = getAuth(req)
        if(!userId){
            return NextResponse.json({success:false,message:"unauthorized"},{status:401})
        }
        const {id}=await params 
        const specific=transactionsZodSchema.omit({id:true})
        const validation =specific.parse(await req.json())
        const updatedTransactions=connection.$with("transactions_to_update")
        .as(
            connection.select({id:transactions.id}).from(transactions)
            .innerJoin(accounts,eq(transactions.accountId,accounts.id))
            .where(and(
                eq(accounts.userId,userId),
                eq(transactions.id,id)
            ))
        )
        const [data]=await connection
        .with(updatedTransactions)
        .update(transactions)
        .set(validation)
        .where(inArray(transactions.id,sql`(select id from transactions_to_update)`))
        .returning()
        if(!data){
            return NextResponse.json({success:true,message:"account not found"},{status:404})
        }
        return NextResponse.json({success:true})
    } catch (error) {
        console.log(error)
        return NextResponse.json({success:false,message:(error as Error).message})
    }
}