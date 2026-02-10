import { formatingDateMOADA } from "@/lib/utils"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import ToolTipCustom from "./ToolTip"

type Props={
    data?:{
        name:string,
        value:number
    }[]
}
const COLORS=["#355fd3","#12c6ff","#ff647f","#ff9354"]
export default function PieVarient({data=[]}:Props) {
  return (
    <ResponsiveContainer width={"100%"} height={360}>
        <PieChart>
            <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="right"
            iconType="circle"
            content={({payload}:any)=>{
                const total = payload.reduce((sum: number, entry: any) => sum + entry.payload.value,0)
                return(
                    <ul className="flex flex-col space-y-2">
                        {payload.map((entry:any,number:number)=>{
                            const percent = ((entry.payload.value / total) * 100).toFixed(2)
                            return(
                            <li key={`item-${number}`}
                            className="flex items-center space-x-2"
                            >
                                <span className="size-2 rounded-full"
                                style={{backgroundColor:entry.color}}
                                />
                                <div className="space-x-1">
                                    <span className="text-sm">
                                        {entry.value}
                                    </span>
                                    <span className="text-sm">
                                        {percent}%
                                    </span>
                                </div>
                            </li>
                        )})}
                    </ul>
                )
            }}
            />
            <Tooltip content={<ToolTipCustom />}/>
            <Pie
            data={data}
            cy={"50%"}
            cx={"50%"}
            outerRadius={90}
            innerRadius={60}
            paddingAngle={2}
            fill="#8884d8"
            dataKey={"value"}
            labelLine={false}
            >
                {data.map((_entry,index)=>(
                    <Cell key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    />
                ))}
            </Pie>
        </PieChart>
    </ResponsiveContainer>
  )
}
