import { connection } from "@/db";
import { accounts, category, transactions } from "@/db/schema";
import { calculateChangesInPercent } from "@/lib/utils";
import { getAuth } from "@clerk/nextjs/server";
import { sq } from "date-fns/locale";
import { and, desc, eq, gte, lt, lte, sql, sum } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
export async function GET(req:NextRequest) {
    try {
        const {userId}=getAuth(req)
        if(!userId){
            return NextResponse.json({success:false,message:"unauthorized"},{status:401})
        }
        const {searchParams}=new URL(req.url)
        const from=searchParams.get("from")
        const to=searchParams.get("to")
        const accountId=searchParams.get("accountId")
        const defaultTo=Date.now()
        const defaultFrom=defaultTo - (30 * 60 * 60 *24 *1000)
        const trueDate=(date:string|null,defaultDate:number)=>{
            if(! date) return new Date(defaultDate)
            if(isNaN(new Date(date).getTime())) return new Date(defaultDate)
            return new Date(date)
        }
        const fetchFinancialDate=async(
            userId:string,startDate:Date,endDate:Date
        )=>{
            return await connection.select({
                income:sql`COALESCE(SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END),0)`.mapWith(Number),
                expenses:sql`COALESCE(SUM(CASE WHEN ${transactions.amount} < 0 THEN ${transactions.amount} ELSE 0 END),0)`.mapWith(Number),
                remaining:sum(transactions.amount).mapWith(Number)
                }).from(transactions)
                .innerJoin(accounts,
                    eq(transactions.accountId,accounts.id)
                )
                .where(
                    and(
                        accountId?eq(transactions.accountId,accountId):undefined,
                        eq(accounts.userId,userId),
                        gte(transactions.date,startDate),
                        lte(transactions.date,endDate)
                    )
                )
            }
        const startDate=trueDate(from,defaultFrom)
        const endDate=trueDate(to,defaultTo)
        const periodLength=endDate.getTime() -  startDate.getTime()
        const lastStart = new Date(startDate.getTime() - periodLength)
        const lastEnd = new Date(endDate.getTime() - periodLength)
        const [currentPeriod]=await fetchFinancialDate(userId,startDate,endDate)
        const [lastPeriod]=await fetchFinancialDate(userId,lastStart,lastEnd)
        const incomeChange=calculateChangesInPercent(currentPeriod.income,lastPeriod.income)
        const expensesChange=calculateChangesInPercent(currentPeriod.expenses,lastPeriod.expenses)
        // const expensesChange=calculateExpensesChange<0?-calculateExpensesChange:calculateExpensesChange
        const remainingChange=calculateChangesInPercent(currentPeriod.remaining,lastPeriod.remaining)
        const categories=await connection.select({
            name: sql`COALESCE(${category.name}, 'Uncategorized')`,
            value:sql`SUM(ABS(${transactions.amount}))`.mapWith(Number)
        }).from(transactions)
        .innerJoin(accounts,
            eq(transactions.accountId,accounts.id)
        )
        .leftJoin(
            category,
            eq(transactions.categoryId,category.id)
        ).where(
            and(
                accountId?eq(transactions.accountId,accountId):undefined,
                eq(accounts.userId,userId),
                gte(transactions.date,startDate),
                lte(transactions.date,endDate),
                lt(transactions.amount,0)
            )
        )
        .groupBy(category.name)
        .orderBy(desc(sql`SUM(ABS(${transactions.amount}))`))
        const topCategories=categories.slice(0,3)
        const otherCategories=categories.slice(3)
        const otherSum=otherCategories.reduce((sum,curr)=>sum + curr.value,0)
        const finalCategories=topCategories
        if(otherCategories.length>0){
            finalCategories.push({
                name:"Other",
                value:otherSum
            })
        }
        const activeDays=await connection.select({
            date:transactions.date,
            income:sql`COALESCE(SUM(CASE WHEN ${transactions.amount} >= 0 THEN ${transactions.amount} ELSE 0 END),0)`.mapWith(Number),
            expenses:sql`COALESCE(SUM(CASE WHEN ${transactions.amount} < 0 THEN ABS(${transactions.amount}) ELSE 0 END),0)`.mapWith(Number)
        })
        .from(transactions)
        .innerJoin(accounts,eq(transactions.accountId,accounts.id))
        .where(and(
            accountId?eq(transactions.accountId,accountId):undefined,
            eq(accounts.userId,userId),
            gte(transactions.date,startDate),
            lte(transactions.date,endDate)
        ))
        .groupBy(transactions.date)
        .orderBy(transactions.date)
        let periodsOfDate:any=[]
        const daysMap = new Map(
        activeDays.map(d => [
            new Date(d.date).toDateString(),
            d
        ])
        )
        let current = new Date(startDate)
        while(endDate>=current){
            const key = current.toDateString()
            const day = daysMap.get(key)
            if(day){
                periodsOfDate.push(day)
            }else{
                periodsOfDate.push({
                    date:new Date(current),
                    income:0,
                    expenses:0
                })
            }
            current.setDate(current.getDate() + 1)
        }
        return NextResponse.json({
            success:true,
            data:{
                currentPeriod,
                lastPeriod,
                incomeChange,
                expensesChange,
                remainingChange,
                finalCategories,
                periodsOfDate
            }
        })
    } catch (error) {
        console.log("summary err =>",error)
        return NextResponse.json({success:false,message:(error as Error).message})
    }
}