"use client"
import { fetchTransactions } from "@/redux/slices/transactions"
import { AppDispatch, RootState } from "@/redux/store"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Popover, PopoverTrigger,PopoverClose,PopoverContent } from "../ui/popover"
import { Button } from "../ui/button"
import { formatingDate, formatingDateMOADA } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { Calendar } from "../ui/calendar"
export type DateType={
    from:Date,
    to:Date
}
export default function DateFilter() {
    const router=useRouter()
    const pathname=usePathname()
    const params=useSearchParams()
    const accountId=params.get("accountId")
    const from=params.get("from")||""
    const to=params.get("to")||""
    const defaultTo=new Date()
    const defaultFrom=new Date(defaultTo.getTime() - (60*60*24*1000*30))
    const paramState={
        from:from?new Date(from):defaultFrom,
        to:to?new Date(to):defaultTo
    }
    const [date,setDate]=useState<DateType|undefined>(paramState)
    const pushWithDate=(date:DateType|undefined)=>{
        const query = new URLSearchParams({
            from: date?.from.toISOString()||"",
            to: date?.to.toISOString()||"",
            accountId: accountId||""
        })
        router.push(`${pathname}?${query.toString()}`)
    }
    const reSetDate=()=>{
        setDate(undefined)
        pushWithDate(undefined as any)
    }
  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button
            size={"sm"}
            variant={"outline"}
            className="w-full md:w-auto h-9 rounded-md px-3 font-normal
        bg-white/10 hover:text-white hover:bg-white/20 transition border-none 
        text-white focus:bg-white/30 outline-none focus:ring-offset-0 focus:ring-transparent"
            >
                <span>{
                    `${formatingDateMOADA(paramState.from)} - ${formatingDate(paramState.to)}`
                }</span>
                <ChevronDown className="size-4 ml-2 opacity-50"/>
            </Button>
        </PopoverTrigger>
        <PopoverContent
        align="start"
        className="w-fit">
            <Calendar 
            selected={date}
            initialFocus
            mode="range"
            onSelect={(value:any)=>{
                setDate(value)
            }}
            defaultMonth={date?.from}
        />
        <div className="flex gap-2 mt-3 justify-end flex-col md:flex-row">
        <PopoverClose asChild>
        <Button
        onClick={()=>pushWithDate(date)}
        className="w-full md:w-fit mb-2"
        variant={"default"}
        >
            Apply
        </Button>
        </PopoverClose>
        <PopoverClose asChild>
        <Button
        onClick={()=>reSetDate()}
        className="w-full md:w-fit"
        variant={"default"}
        >
            Reset
        </Button>
        </PopoverClose>
        </div>
        </PopoverContent>
    </Popover>
  )
}
