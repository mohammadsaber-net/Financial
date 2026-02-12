"use client"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import z from "zod";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet'
import { Info} from "lucide-react";
import { DatePicker } from "../ui/DatePicker";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { fetchAccounts } from "@/redux/slices/accounts";
import { fetchCategories } from "@/redux/slices/categories";
import toast from "react-hot-toast";
import { formatCurrencyIn, formatCurrencyPer } from "@/lib/utils";
import { fetchTransactions } from "@/redux/slices/transactions";
const formSchema=z.object({
    amount:z.string()
    .regex(/^\-?\d+(\.\d+)?$/, "amount must be a valid number")
    .min(1,"amount is required"),
    payee:z.string().min(1,"payee is required"),
    notes:z.string().nullable().optional(),
    date:z.coerce.date().min(1,"date is required"),
    account:z.string().min(1,"account is required"),
    category:z.string().nullable().optional(),
    categoryId:z.string().nullable().optional(),
    accountId:z.string().min(1,"accountId is required"),
})
export type TransData={
    amount:string,
    payee:string,
    id?:string,
    notes?:string,
    date:string,
    accountId:string,
    categoryId?:string,
    account:string,
    category?:string,
}
type Props={
    edit:TransData | null,
    setEdit:any,
    create:boolean,
    setCreate:(value:boolean)=>void,
}

export default function HandleForm({create,setCreate,edit,setEdit}:Props) {
    const [transData,setTransData]=useState<TransData>({
        amount:"",
        payee:"",
        notes:"",
        date:"",
        account:"",
        category:"",
        accountId:"",
        categoryId:""
    })
    useEffect(() => {
        if (!create && !edit) return
        dispatch(fetchAccounts())
        dispatch(fetchCategories())
    }, [create, edit])

    useEffect(() => {
    if (!edit) return
    setTransData({
        ...edit,
        amount: String(formatCurrencyPer(+edit.amount)),
    })
    }, [edit])
    const [income,setIncome]=useState(true)
    const [errors, setErrors] = useState<Record<string, string[]>>({})
    const dispatch=useDispatch<AppDispatch>()
    const accounts=useSelector((state:RootState)=>state.getAccounts?.data)
    const categories=useSelector((state:RootState)=>state.getCategories?.data)

    const [info,setInfo]=useState<any>({
        accounts:null,
        categories:null
    })
    useEffect(()=>{
        setInfo({categories,accounts})
    },[accounts,categories])
    const handleIncome = () => {
        setTransData((prev) => {
            const cleanAmount = prev.amount.replace("-", "")
            return {
            ...prev,
            amount: income ? `-${cleanAmount}` : cleanAmount,
            }
        })
        setIncome((prev) => !prev)
    }
    const validation=(name:string,value:any)=>{
        const oneItem=formSchema.pick({[name]:true}as any)
        const result=oneItem.safeParse({[name]:value})
        setErrors((prev)=>({
            ...prev,[name]:result.error?.issues.map((e :any)=>e.message)??[]
        }))
    }
    const onSubmit=async()=>{
        const result=formSchema.safeParse({
            amount: transData.amount,
            payee: transData.payee,
            notes: transData.notes,
            date: transData.date,
            accountId: transData.accountId,
            categoryId: transData.categoryId,
            category: transData.category,
            account: transData.account,
        })
        if(result.error){
            toast.error("invalid data, please complete your data")
            return
        }
        setCreate(false)
        if(edit===null){
            toast.promise((async()=>{
            const res=await fetch("/api/transactions",{
                method:"post",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({...result.data,amount:formatCurrencyIn(+result.data.amount)})
            })
            const data=await res.json()
            if(data.success){
                dispatch(fetchTransactions())
            }else{
                throw new Error(data.message||"an error")
            }}),{
                loading:"creating transaction...",
                success:"transaction created",
                error:(err)=>err.message||"creating failed" 
            })
        }else if(edit.account){
            setEdit(null)
            toast.promise((async()=>{
            const res=await fetch(`/api/transactions/${transData.id}`,{
                method:"PATCH",
                headers:{"content-type":"application/json"},
                body:JSON.stringify({...result.data,amount:formatCurrencyIn(+result.data.amount)})
            })
            const data=await res.json()
            if(data.success){
                dispatch(fetchTransactions())
            }else{
                throw new Error(data.message||"an error")
            }}),{
                loading:"updating transaction...",
                success:"transaction updated",
                error:(err)=>err.message||"updating failed" 
            })
        }
    }
  return (
    <Sheet 
        open={create|| edit !== null} 
        onOpenChange={(open)=>{!open&&setCreate(false);setEdit(null)}}>
            <SheetContent className='p-4 '>
                <SheetHeader className='text-center'>
                    <SheetTitle>
                        {edit?.account?"Edit Transaction":"New Transaction"}
                    </SheetTitle>
                    <SheetDescription>
                        {edit?.account?"Edit this transaction.":
                        "add a new transaction."}
                    </SheetDescription>
                </SheetHeader>  
                <form 
                className="pt-4 pb-10 border-t border-gray-300 overflow-auto">
                    <label >Date</label>
                    <DatePicker 
                    setTransData={setTransData}
                    transData={transData}
                    />
                    <div className=" mb-3 ">
                        <label htmlFor="accountId">Accounts</label>
                        <select 
                        value={transData.accountId??""}
                        id="accountId"
                        onChange={(e) => {
                            const selected = info.accounts.find((item: any) => item.id === e.target.value)
                            setTransData({
                            ...transData,accountId: selected?.id,account: selected?.name,})
                            ;validation("account",selected?selected.name:"")
                        }}
                        className="block mt-1 w-full max-w-xl outline-none cursor-pointer
                        p-2 font-normal shadow p-2 rounded-lg
                        transition hover:bg-gray-100 border border-gray-200">
                        <option value={""}>Select an account</option>
                        {
                        info.accounts?.map((item:any)=>(
                            <option 
                            key={item.id} value={item.id}>{item.name}</option>
                        ))
                        }
                        </select>
                        {errors.account&&<small className="text-rose-500">{errors.account}</small>}
                    </div>
                    <div className=" mb-3 ">
                        <label htmlFor="CategoriesId">Categories</label>
                    <select 
                    id="CategoriesId"
                    value={transData.categoryId??""}
                    onChange={(e) => {
                        const selected = info.categories.find(
                        (item: any) => item.id === e.target.value
                        )
                        setTransData({
                        ...transData,
                        categoryId: selected?.id,
                        category: selected?.name,
                        })
                    }}
                    className="block mt-1 w-full max-w-xl outline-none cursor-pointer p-2 rounded-lg font-normal shadow
                    transition hover:bg-gray-100 border border-gray-200">
                        <option value={""}>Uncategorized</option>
                        {
                        info.categories?.map((item:any)=>(
                            <option 
                            key={item.id} value={item.id}>
                            {item.name}
                            </option>
                        ))
                        }
                    </select>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Payee">Payee
                        <input type="text"
                        value={transData.payee}
                        onChange={(e)=>{
                            setTransData({...transData,payee:e.target.value})
                            ;validation("payee",e.target.value)
                        }}
                        id="Payee"
                        placeholder="add a payee"
                        className="block mt-1 font-normal shadow"
                        />
                        </label>
                        {errors.payee&&<small className="text-rose-500">{errors.payee}</small>}
                    </div>
                    <div className="mb-3">
                        <label className="relative" htmlFor="Amount">Amount
                        <input type="text"
                        id="Amount"
                        value={transData.amount}
                        onChange={(e)=>{
                            setTransData({...transData,amount:e.target.value})
                            ;validation("amount",e.target.value)
                        }}
                        placeholder="add amount"
                        className="block mt-1 !ps-10 font-normal shadow"
                        />
                        <Info 
                        onClick={()=>{handleIncome()}}
                        className={`absolute top-8 size-8 left-1 cursor-pointer 
                        ${income&&!transData.amount.startsWith("-")?"text-green-500":"text-rose-500"}`}/>
                        </label>
                        {errors.amount&&<small className="text-rose-500">{errors.amount}</small>}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="Notes">Notes</label>
                        <textarea
                        value={transData.notes ?? ""}
                        onChange={(e)=>setTransData({
                            ...transData,
                            notes:e.target.value.replace(/\n/g, "")
                        })}
                        id="Notes"
                        placeholder="add some notes...."
                        className="block mt-1 font-normal shadow w-full max-w-xl h-20 p-2
                        resize-none border border-gray-100 transition hover:bg-gray-100"
                        ></textarea>
                    </div>
                    <Button
                    type="button"
                    onClick={onSubmit}
                    variant={!transData?"notWorking":"default"} className="w-full">
                        {edit?.account?"Edit Account"
                        :"Create Account"}
                    </Button>
                </form>
     </SheetContent>
    </Sheet>
  )
}
