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
import { fetchCategories } from "@/redux/slices/categories"
import { AppDispatch } from "@/redux/store"
import toast from "react-hot-toast"
import { useDispatch } from "react-redux"
type Props = {
  openDelete: boolean,
  addId: string[],
  setOpenDelete: (value: boolean) => void,
  setAddId: (value: []) => void,
}
export function DeleteDialog(
  {openDelete,setOpenDelete,addId,setAddId}
  :Props) {
    const dispatch=useDispatch<AppDispatch>()
  const deleteHandling=async()=>{
  setOpenDelete(false)
  await toast.promise(
    (async ()=>{
      const ids = addId.join(",")
    const res=await fetch("api/categories?Ids="+ids,{
      method:"delete",
      headers:{"content-type":"application/json"}
  })
  const data=await res.json()
  if(data.success){
    setAddId([])
    dispatch(fetchCategories())
  }else{
    throw new Error (data.message||"deleting failed")
  }
  }),{
    loading: "Deleting categories...",
    success: "categories deleted",
    error: (err) => err.message || "Failed deleting",
  })
}
  return (
    <div>
    <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Categories</DialogTitle>
            <DialogDescription>
            are you sure you want to delete these Categories ?
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
