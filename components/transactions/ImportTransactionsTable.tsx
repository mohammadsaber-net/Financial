"use client"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "../ui/checkbox"
type Props={
    results:any,
    chosedInfo:any,
    setChosedInfo:any
}
export default function ImportTransactionsTable({chosedInfo,setChosedInfo,results}:any) {
    
  return (
    <div className="shadow rounded border">
      <Table className="text-center">
        <TableHeader className="bg-muted">
            <TableRow>
                <TableHead>
                    Type
                </TableHead>
                <TableHead>
                    Products
                </TableHead>
                <TableHead >
                    <label className="cursor-pointer text-indigo-800"
                     htmlFor="Started_atBulk">Date
                    <Checkbox
                    checked={chosedInfo.includes("Date")}
                    onCheckedChange={(checked) => {
                    setChosedInfo((prev:any) =>
                        checked
                        ? [...prev, "Date"]
                        : prev.filter((item:any) => item !== "Date")
                    )
                    }}
                    className="ms-1" id="Started_atBulk"/>
                    </label>
                </TableHead>
                <TableHead>
                    Completed_at
                </TableHead>
                <TableHead>
                    State
                </TableHead>
                <TableHead >
                    <label 
                    className="cursor-pointer text-indigo-800"
                    htmlFor="PayeeBulk">Payee
                    <Checkbox
                    checked={chosedInfo.includes("Payee")}
                    onCheckedChange={(checked) => {
                        setChosedInfo((prev:any) =>
                        checked
                        ? [...prev, "Payee"]
                        : prev.filter((item:any) => item !== "Payee")
                    )
                    }}
                    className="ms-1" id="PayeeBulk"/>
                    </label>
                </TableHead>
                <TableHead>Fee</TableHead>
                <TableHead >
                    <label
                    className="cursor-pointer text-indigo-800"
                     htmlFor="AmountBulk">
                    Amount
                    <Checkbox 
                    checked={chosedInfo.includes("Amount")}
                    onCheckedChange={(checked) => {
                    setChosedInfo((prev:any) =>
                        checked
                        ? [...prev, "Amount"]
                        : prev.filter((item:any) => item !== "Amount")
                    )
                    }}
                    className="ms-1" id="AmountBulk"/>
                    </label>
                </TableHead>
                <TableHead>
                    Currency
                </TableHead>
                <TableHead>
                    Balance
                </TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {results?.map((item:any,index:any)=>(
            <TableRow key={index}>
                <TableCell>{item.Type}</TableCell>
                <TableCell>{item.Products}</TableCell>
                <TableCell>{item.Date}</TableCell>
                <TableCell>{item.Completed_at}</TableCell>
                <TableCell>{item.State}</TableCell>
                {/* <TableCell>{item.description}</TableCell> */}
                <TableCell>{item.Payee}</TableCell>
                <TableCell>{item.Fee}</TableCell>
                <TableCell>
                    <span className={`
                      px-3 py-1 rounded-full ${+item.Amount<0?"bg-red-500/10 text-red-600":"bg-blue-500/10 text-blue-600"}`}>
                      {+item.Amount}
                    </span>
                </TableCell>
                <TableCell>{item.Currency}</TableCell>
                <TableCell>{item.Balance}</TableCell>
            </TableRow>
            ))}
            
        </TableBody>
      </Table>
    </div>
  )
}
