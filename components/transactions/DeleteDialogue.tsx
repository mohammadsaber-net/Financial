"use client"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { fetchTransactions } from "@/redux/slices/transactions"
import { AppDispatch } from "@/redux/store"
import toast from "react-hot-toast"
type Props = {
  openDelete: boolean,
  addId: string[],
  setOpenDelete: (value: boolean) => void,
  setAddId: (value: []) => void,
  dispatch: AppDispatch,
}
export function DeleteDialog(
  {openDelete,setOpenDelete,addId,dispatch,setAddId}
  :Props) {
  const deleteHandling=async()=>{
  setOpenDelete(false)
  await toast.promise(
    (async ()=>{
      const ids = addId.join(",")
    const res=await fetch("api/transactions?Ids="+ids,{
      method:"delete",
      headers:{"content-type":"application/json"}
  })
  const data=await res.json()
  if(data.success){
    setAddId([])
    dispatch(fetchTransactions())
  }else{
    throw new Error (data.message||"deleting failed")
  }
  }),{
    loading: "Deleting transactions...",
    success: "transactions deleted",
    error: (err) => err.message || "Failed deleting",
  })
}
  return (
    <div>
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Transactions</DialogTitle>
            <DialogDescription>
            are you sure you want to delete these Transactions ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button"
              onClick={()=>setOpenDelete(false)}
              variant="outline">Cancel</Button>
            </DialogClose>
            <Button
            onClick={()=>deleteHandling()}
            type="button">Confirm</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
    </div>
  )
}
