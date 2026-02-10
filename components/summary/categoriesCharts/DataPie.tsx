type Props={
    data?:{
        name:string,
        value:number
    }[]
}
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"
import { PieChartIcon, Radar, Target } from "lucide-react"
import PieVarient from "./PieVarient"
import RadarVarient from "./RadarVarient"
import RadialVariant from "./RadialVariant"
import { formatCurrencyPer } from "@/lib/utils"
export default function DataPie({data=[]}:Props) {
    const [chartType,setChartType]=useState('pie') 
    const handleType=(type:any)=>{
      setChartType(type)
    }
  return (
    <div  >
      <div className="flex space-x-8 mb-2 items-center flex-col md:flex-row">
        <h2 className='text-xl md:texl-2xl mb-1 font-semibold'>Categories</h2>
         <Select onValueChange={handleType} defaultValue={chartType}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue placeholder="chart type "/>
          </SelectTrigger>
          <SelectContent >
              <SelectItem value="pie"><PieChartIcon />Pie</SelectItem>
              <SelectItem value="radar"><Radar />Radar</SelectItem>
              <SelectItem value="radial"><Target /> Radial</SelectItem>
          </SelectContent>
        </Select>
      </div>
            {chartType==="pie"?
            <PieVarient data={data} />
            :chartType==="radar"?
            <RadarVarient data={data.map((item)=>{
              return({
                name:item.name,value:formatCurrencyPer(item.value)})
              })
            }/>
            :<RadialVariant data={data.map((item)=>{
              return({
                name:item.name,value:formatCurrencyPer(item.value)})
              })
            } /> 
            }
    </div>
  )
}
