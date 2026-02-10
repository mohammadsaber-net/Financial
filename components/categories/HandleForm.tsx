"use client"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet'
import { fetchCategories } from "@/redux/slices/categories";
type Props={
    edit:{
        name:string|null,
        id:string|null,
    },
    setEdit:any,
    create:boolean,
    setCreate:(value:boolean)=>void
}
export default function HandleForm({setCreate,edit,create,setEdit}:Props) {
    const [name,setName]=useState<any>("")
    useEffect(() => {
    if (edit.name !== null) {
        setName(edit.name);
    }
    }, [edit.name]);
    const dispatch=useDispatch<AppDispatch>()
    const onSubmit=async()=>{
        setCreate(false)
        if(edit.name===null){
            toast.promise(
                (async()=>{
                if(name){
                    const res= await fetch("/api/categories",{
                    method:"post",
                    headers:{
                        "content-type":"application/json"
                    },
                    body:JSON.stringify({name})
                })
                const data=await res.json()
                if(data.success){
                    dispatch(fetchCategories())
                }else{
                    throw new Error(data.message||"failed creating")
                }
                }else{
                    throw new Error("enter a valid name")
                }
            }),{
                loading:"creating category...",
                success:"category created",
                error:(err)=>err.message||"failed creating"  
            })
        }else{
            toast.promise(
                (async()=>{
                if(name){
                    const id = edit.id;
                    setEdit({id:null,name:null})
                    if (!id) {
                        throw new Error ("Invalid ID for editing");
                    }
                    const res= await fetch(`/api/categories/${id}`,{
                    method:"PATCH",
                    headers:{
                        "content-type":"application/json"
                    },
                    body:JSON.stringify({name})
                })
                
                let data = await res.json();
                if(data.success){
                    dispatch(fetchCategories())
                }else{
                    throw new Error(data.message||"an error")
                }
                }else{
                    throw new Error("enter a valid name")
                }
             }),{
                loading:"updating category...",
                success:"category updated",
                error:(err)=>err.message||"update failed"  
            })
        }
    }
  return (
    <Sheet 
        open={create||edit.name!==null} 
        onOpenChange={()=>{setCreate(false);setEdit({name:null,id:null})}}>
            <SheetContent className='p-4'>
                <SheetHeader className='text-center'>
                    <SheetTitle>
                        {edit.name?"Edit category":"New category"}
                    </SheetTitle>
                    <SheetDescription>
                        {edit.name?"Edit this category to organize your transactions.":
                        "Create a new category to organize your transactions."}
                    </SheetDescription>
                </SheetHeader>
            
           
    <form 
    className="mt-4 border-t border-gray-300">
        <div className="mb-3 mt-2">
            <label className="text-gray-700 block" htmlFor="Name">Name</label>
            <input
            value={name}
            onChange={(e)=>setName(e.target.value)}
            id="Name"
            placeholder="e.g. Food, Travel, etc."
            type="text"
             />
        </div>
        <Button
        type="button"
        onClick={()=>onSubmit()}
        variant={!name?"notWorking":"default"} className="w-full">
            {edit.name?"Edit category"
            :"Create category"}
        </Button>
    </form>
     </SheetContent>
        </Sheet>
  )
}
