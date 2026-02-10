type Props={
    data?:{
        date: string | Date,
        income:number,
        expenses:number
    }[]
}
import { formatingDateMOADA } from "@/lib/utils"
import {
    Tooltip,
    XAxis,
    BarChart,
    Bar,
    ResponsiveContainer,
    CartesianGrid
} from "recharts"

import ToolTipCustom from "./ToolTip"
export default function BarVarient({data=[]}:Props) {
  return (
      <div>
        {data.length===0?
          <div className='text-muted-foreground'>
              No data for this period
          </div>:
          <div>
              <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={data}>
                      <CartesianGrid strokeDasharray={"3 3"}/>
                      <XAxis 
                      axisLine={false}
                      tickLine={false}
                      dataKey={"date"}
                      tickFormatter={(value)=>formatingDateMOADA(value)}
                      style={{fontSize:"12px"}}
                      tickMargin={16}
                      />
                      <Tooltip content={<ToolTipCustom />} />
                      <Bar 
                      dataKey={"income"}
                      fill="#3d82f6"
                      className="drop-shadow-sm"
                      />
                      <Bar 
                      dataKey={"expenses"}
                      fill="#f43f5e"
                      className="drop-shadow-sm"
                      />
                  </BarChart>
              </ResponsiveContainer>
          </div>
        }
      </div>
    )
}
