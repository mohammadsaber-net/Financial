"use client"
import { useEffect, useState } from "react"
import { Button } from "../ui/button"
import ImportTransactionsTable from "./ImportTransactionsTable"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { fetchAccounts } from "@/redux/slices/accounts";
import toast from "react-hot-toast"
import { Item } from "@radix-ui/react-dropdown-menu"
type Props={
    setImportResult:any|null,
    importResult:any|null,
}

export default function ImportCard({setImportResult,importResult}:Props) {
  const [chosedInfo,setChosedInfo]=useState<any>([])
  const [create,setCreate]=useState(false)
  const [dataToBeSent,setDataToBeSent]=useState<any[]>([])
  const [account,setAccount]=useState<{account: string;accountId: string;}>(
    {account:"",accountId:""})
  const accounts=useSelector((state:RootState)=>state.getAccounts?.data)
  const dispatch=useDispatch<AppDispatch>()
  useEffect(()=>{
    dispatch(fetchAccounts())
  },[])
  const RequiredData=["date","amount","payee"]
  const handleData=()=>{
    let data:any=[]
    importResult.forEach((item:any)=>{
      data.push({
         date:item.Date, 
         amount:+item.Amount * 1000, 
         payee:item.Payee,  
        })
    })
    setCreate(true)
    setDataToBeSent(data)
  }
  const confirmCreation=()=>{
    if(!account.account){
      return toast.error("please select an account")
    }
    console.log(dataToBeSent)
    for (let i = 0; i < dataToBeSent.length; i++) {
      dataToBeSent[i].account=account.account
      dataToBeSent[i].accountId=account.accountId
    }
    toast.promise((async()=>{
      const res=await fetch("/api/transactions",{
        method:"post",
        headers:{"content-type":"application/json"},
        body:JSON.stringify(dataToBeSent)
      })
      const data=await res.json()
      if(data.success){
        setImportResult(null)
      }else{
          throw new Error(data.message||"an error")
      }}),{
          loading:"creating transaction...",
          success:"transaction created",
          error:(err)=>err.message||"creating failed" 
      })
  }
  return (
    <>
    <div className="pb-8">
      <div className='flex mb-6 flex-col justify-between md:items-center md:flex-row'>
    <h2 className='text-xl md:texl-2xl mb-2 font-semibold'>Import Transactions</h2>
    <div className="flex md:items-center flex-col md:flex-row gap-2">
    <Button 
    onClick={()=>setImportResult(null)}
    variant={"default"} className='transition active:!bg-gray-600 cursor-pointer'>
         Cancel
    </Button>
    <Button 
    onClick={handleData}
    disabled={chosedInfo.length<RequiredData.length}
    variant={"default"} className='transition active:!bg-gray-600 cursor-pointer'>
         Continue {chosedInfo.length + " / " +RequiredData.length}
    </Button>
    </div>
    </div>
    <ImportTransactionsTable 
    setChosedInfo={setChosedInfo}
    chosedInfo={chosedInfo}
    results={importResult} />
    </div>
    <Dialog open={create} onOpenChange={()=>setCreate(false)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Transactions</DialogTitle>
            <DialogDescription>
            Please Select an account
            </DialogDescription>
          </DialogHeader>
          <select
          onChange={(e)=>{
            const selected=accounts.find((acc:any)=>acc.id===e.target.value)
            setAccount({...account,accountId:selected.id,account:selected.name})
          }}
          >
            <option value={""}>select an account</option>
            {
              accounts?.map((item:any)=>(
                <option key={item.id} value={item.id}>{item.name}</option>
              ))
            }
          </select>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button"
              onClick={()=>setCreate(false)}
              variant="outline">Cancel</Button>
            </DialogClose>
            <Button
            type="button"
            onClick={confirmCreation}
            >Confirm</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </>
  )
}
