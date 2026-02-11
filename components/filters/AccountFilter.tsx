"use client"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchAccounts } from "@/redux/slices/accounts"
import { fetchTransactions } from "@/redux/slices/transactions"
import { AppDispatch, RootState } from "@/redux/store"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
export default function AccountFilter() {
    const router=useRouter()
    const pathname=usePathname()
    const params=useSearchParams()
    const accountId=params.get("accountId")||"all"
    const from=params.get("from")||""
    const to=params.get("to")||""
    const dispatch=useDispatch<AppDispatch >()
    useEffect(()=>{
        dispatch(fetchAccounts())
    },[])
    const {data}=useSelector((state:RootState)=>state.getAccounts)
    const handleChange = (value: string) => {
        const query = new URLSearchParams({
            from,
            to
        })
        if (value !== "all") {
            query.set("accountId", value)
        }
        router.push(`${pathname}?${query.toString()}`)
    }
    useEffect(()=>{
        dispatch(fetchTransactions({
            accountId: accountId === "all" ? undefined : accountId,
            from,
            to
        }))
    },[accountId, from, to])
  return (
    <Select value={accountId}
    onValueChange={handleChange}
    disabled={false}
    >
        <SelectTrigger className="w-full md:w-auto h-9 rounded-md px-3 font-normal
        bg-white/10 hover:text-white hover:bg-white/20 transition border-none 
        text-white focus:bg-white/30 outline-none focus:ring-offset-0 focus:ring-transparent">
            <SelectValue placeholder="Account"/>
        </SelectTrigger>
        <SelectContent className="">
            <SelectItem value="all">All accounts</SelectItem>
            {data?.map((item:any)=>(
            <SelectItem value={item.id} key={item.id}>{item.name}</SelectItem>
            ))}
        </SelectContent>
    </Select>
  )
}
