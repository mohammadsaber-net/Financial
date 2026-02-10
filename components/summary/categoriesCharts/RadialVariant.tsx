import { RadialBar, Legend, RadialBarChart, ResponsiveContainer } from "recharts"
import { formatCurrencyPer } from "@/lib/utils"

type Props={
    data?:{
        name:string,
        value:number
    }[]
}
const COLORS=["#355fd3","#12c6ff","#ff647f","#ff9354"]
export default function RadialVariant({data=[]}:Props) {
  return (
    <ResponsiveContainer width={"100%"} height={360}>
        <RadialBarChart
        cx={"50%"}
        cy={"30%"}
        barSize={10}
        innerRadius={90}
        outerRadius={40}
        data={data.map((entry,index)=>({
            ...entry,
            fill:COLORS[index % COLORS.length]
        }))}
        >
            <RadialBar 
            label={{
                position:"insideStart",
                fill:"#000",
                fontSize:"12px"
            }}
            background
            dataKey={"value"}
            />
            <Legend
            layout="horizontal"
            verticalAlign="bottom"
            align="right"
            iconType="circle"
            content={({payload}:any)=>{
                return(
                    <ul className="flex flex-col space-y-2">
                        {payload.map((entry:any,number:number)=>{
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
                                        {entry.payload.value} EGP
                                    </span>
                                </div>
                            </li>
                        )})}
                    </ul>
                )
            }}
            />
        </RadialBarChart>
    </ResponsiveContainer>
  )
}
