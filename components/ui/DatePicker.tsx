"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { TransData } from "../transactions/HandleForm"
type Props ={
  setTransData:any,
  transData:TransData
}
export function DatePicker({setTransData,transData}:Props) {
  const date = transData.date? new Date(transData.date): undefined
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className={cn(
            "justify-start mb-3 text-left border border-gray-200 p-2 shadow font-normal w-full max-w-xl",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(selectedDate)=>{
            if(!selectedDate) return
            setTransData({...transData,date:selectedDate.toISOString()})
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
