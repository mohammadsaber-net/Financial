"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { AreaChartIcon, BarChart2Icon, Info, LineChartIcon, Loader2 } from "lucide-react"
import AreaVarient from "./daysCharts/AreaVarient"
import LineVarient from "./daysCharts/LineVarient"
import BarVarient from "./daysCharts/BarVarient"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import DataPie from "./categoriesCharts/DataPie"
type Props={
  data:any,
  loading:boolean
}
export default function DataCharts({data,loading}:Props) {
    const [chartType,setChartType]=useState('area') 
    const handleType=(type:any)=>{
      setChartType(type)
    }
  return !loading?(
    <div  className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-8">
        <div className="cols-span-1 md:cols-span-3">
          <div className="flex space-x-8 mb-2 items-center flex-col md:flex-row">
          <h2 className='text-xl md:texl-2xl mb-1 font-semibold'>Transactions</h2>
          <Select onValueChange={handleType} defaultValue={chartType}>
            <SelectTrigger className="w-full max-w-48">
              <SelectValue placeholder="chart type "/>
            </SelectTrigger>
            <SelectContent >
                <SelectItem value="area"><AreaChartIcon />Area</SelectItem>
                <SelectItem value="bar"><BarChart2Icon />Bar</SelectItem>
                <SelectItem value="line"><LineChartIcon /> Line</SelectItem>
            </SelectContent>
          </Select>
        </div>
            {chartType==="area"?
            <AreaVarient data={data?.periodsOfDate} />
            :chartType==="line"?
            <LineVarient data={data?.periodsOfDate} />
            :<BarVarient data={data?.periodsOfDate} />
            }
        </div>
        <div className="cols-span-1 md:cols-span-3">
          <DataPie data={data?.finalCategories}/>
        </div>
      </div>
    </div>
  ):(
    <div className="grid mb-8 grid-cols-1 md:grid-cols-2 lg-grid-cols-3 gap-8">
      <div className="animate-pulse">
        <div className="flex gap-8 mb-4 items-center">
          <div className="h-10 bg-gray-200 rounded w-40" />
          <div className="h-10 bg-gray-200 rounded w-52" />
        </div>
        <div className="h-60 max-w-60 bg-gray-200 rounded"></div>
      </div>
      <div className="animate-pulse">
        <div className="flex gap-8 mb-4 items-center">
          <div className="h-10 bg-gray-200 rounded w-40" />
          <div className="h-10 bg-gray-200 rounded w-52" />
        </div>
        <div className="h-60 max-w-52 bg-gray-200 rounded"></div>
      </div>
    </div>
  )
}
