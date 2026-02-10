"use client"
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { fetchAccounts } from "@/redux/slices/accounts";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "../ui/sheet";
type Props={
    edit:{
        name:string|null,
        id:string|null,
    },
    setEdit:any,
    create:boolean,
    setCreate:(value:boolean)=>void,
}
export default function HandleForm({setCreate,create,edit,setEdit}:Props) {
    const [name,setName]=useState("")
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
                    const res= await fetch("/api/accounts",{
                    method:"post",
                    headers:{
                        "content-type":"application/json"
                    },
                    body:JSON.stringify({name})
                })
                const data=await res.json()
                if(data.success){
                    dispatch(fetchAccounts())
                }else{
                    throw new Error(data.message||"failed creating")
                }
                }else{
                    throw new Error("enter a valid name")
                }
            }),{
                loading:"creating account...",
                success:"account created",
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
                    const res= await fetch(`/api/accounts/${id}`,{
                    method:"PATCH",
                    headers:{
                        "content-type":"application/json"
                    },
                    body:JSON.stringify({name})
                })
                
                let data = await res.json();
                if(data.success){
                    dispatch(fetchAccounts())
                }else{
                    throw new Error(data.message||"an error")
                }
                }else{
                    throw new Error("enter a valid name")
                }
             }),{
                loading:"updating account...",
                success:"account updated",
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
                        {edit.name?"Edit Account":"New Account"}
                    </SheetTitle>
                    <SheetDescription>
                        {edit.name?"Edit this account and track his transactions.":
                        "Create a new account to track your transactions."}
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
                        placeholder="e.g. Cash, Bank, Credit Card"
                        type="text"
                        />
                    </div>
                    <Button
                    type="button"
                    onClick={()=>onSubmit()}
                    variant={!name?"notWorking":"default"} className="w-full">
                        {edit.name?"Edit Account"
                        :"Create Account"}
                    </Button>
                </form>
        </SheetContent>
    </Sheet>
  )
}