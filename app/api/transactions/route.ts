import { connection } from "@/db";
import { accounts, category, categoryZodSchema, transactions, transactionsZodSchema } from "@/db/schema";
import { getAuth } from "@clerk/nextjs/server";
import { and, desc, eq, gte, inArray, lte, sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { useDispatch } from "react-redux";
import z from "zod";

export async function GET(req:NextRequest) {
    try {
    const {userId}=getAuth(req)
    if(!userId){
        return NextResponse.json({success:false,message:"unauthorized"})
    }
    const { searchParams } = new URL(req.url)
    const from = searchParams.get("from")
    const to = searchParams.get("to")
    const accountId = searchParams.get("accountId")
    const defaultTo = Date.now()
    const lastMonth = 30 * 24 * 60 * 60 * 1000
    const defaultFrom = defaultTo - lastMonth
    const trueDate=(date:string|null,defaultDate:number)=>{
        if(!date) return new Date(defaultDate)
        if(isNaN(new Date(date).getTime())) return new Date(defaultDate)
        return new Date(date)
         
    }
    const startDate = trueDate(from,defaultFrom)
    const endDate = trueDate(to,defaultTo)
    const conditions = [
    eq(accounts.userId, userId),
    gte(transactions.date, startDate),
    lte(transactions.date, endDate),
    ]

    if (accountId) {
    conditions.push(eq(transactions.accountId, accountId))
    }
    
    const data=await connection.select({
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
     //innerJoin means if the account is not available the data will not loaded 
     // but in case of leftJoin data will loaded anyway
    .innerJoin(accounts,eq(transactions.accountId,accounts.id))
    .leftJoin(category,eq(transactions.categoryId,category.id))
    .where(and(...conditions)).orderBy(desc(transactions.date))
    return NextResponse.json({ success: true, data })
    } catch (error) {
       return NextResponse.json({ success: false, message:(error as Error).message }) 
    }
}
export async function POST(req: NextRequest){
    try {
    const {userId}=getAuth(req)
    if(!userId){
        return NextResponse.json({success:false,message:"unauthorized"},{status:401})
    }
    const specific=transactionsZodSchema.omit({
        id:true
    })
    const body=await req.json()
    console.log("booooody",body)
    const schema = z.union([
      specific,
      z.array(specific)
    ])
    const parsed = schema.parse(body)
    const values = Array.isArray(parsed) ? parsed : [parsed]
    await connection.insert(transactions).values(
    values.map(item => ({
        id: crypto.randomUUID(),
        ...item,
        categoryId: item.categoryId || null
    }))
    )
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
       const {userId}=getAuth(req)
       if(!userId){
        return NextResponse.json({success:false,message:"unAuthorized"},{status:401})
       }
       if(!Ids){
        return NextResponse.json({success:false,message:"Missing Ids parameter"},{status:400})
       }
       const array=Ids.split(",")
       const deletedTransactions=connection.$with("transactions_to_delete")
       .as(
        connection.select({id:transactions.id}).from(transactions)
        .innerJoin(accounts,eq(transactions.accountId,accounts.id))
        .where(and(
            inArray(transactions.id,array),
            eq(accounts.userId,userId)
        ))
       )
       const data=await connection
       .with(deletedTransactions)
       .delete(transactions)
       .where(inArray(transactions.id,sql`(select id from ${deletedTransactions})`))
       .returning()
       if(data.length===0){
        return NextResponse.json({ success: false ,message:"Not Found"},{status:404})
       }
       return NextResponse.json({ success: true })
    } catch (error) {
       return NextResponse.json({success:false,message:(error as Error).message});
    }
}