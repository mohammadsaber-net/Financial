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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import HandleForm from './HandleForm'
import { ArrowDownUp, ArrowUpDown, Edit, Loader2, Menu,Plus, Trash } from 'lucide-react'
import toast from 'react-hot-toast'
import { Checkbox } from "../ui/checkbox"
import { DeleteDialog } from "./DeleteDialogue"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { fetchCategories } from "@/redux/slices/categories"
const before=`before:absolute overflow-hidden
relative before:inset-0 before:bg-gray-400 before:z-50`
type Edit={
        name:string|null,
        id:string|null,
    }
export default function CategoriesPage() {
  const dispatch=useDispatch<AppDispatch>()
    const [create,setCreate]=useState(false)
    const [tableData,setTableData]=useState<any>([])
    const [addId,setAddId]=useState<string[]>([])
    const [allData, setAllData] = useState<any[]>([])
    const [openDelete,setOpenDelete]=useState<boolean>(false)
    const [edit,setEdit]=useState<Edit>({
        id:null,
        name:null
    })
    const [sortingAscDes,setSortingAscDes]=useState({
    direction:"asc",
    key:"" 
    })
    useEffect(()=>{
      dispatch(fetchCategories())
    },[])
    const {data}=useSelector((state:RootState)=>state.getCategories)
    useEffect(()=>{
      setTableData(data)
      setAllData(data)
    },[data])
    //sorting
    
    const sorting=(data:string)=>{
    if(!Array.isArray(tableData)||tableData?.length===0) return
    const sort=[...tableData].sort((a:any,b:any)=>{
        if(sortingAscDes.direction==="asc"){
          return a[data].localeCompare(b[data])
        }else{
          return b[data].localeCompare(a[data])
        }
    })
    setTableData(sort)
    setSortingAscDes({
        key:data,
        direction:sortingAscDes.direction==="asc"?"desc":"asc"
      })
    }
    const renderArrow = (key: string) => {
        if (sortingAscDes.key !== key) {
            return <ArrowUpDown className="size-5" />
        }
        return sortingAscDes.direction === "asc" ? (
        <ArrowUpDown className="size-5" />
        ) : (
        <ArrowDownUp className="size-5" />
        )
    }
    const filtering=(value:string)=>{
        if(!value){
        setTableData(allData)
        return
        }
        setTableData(allData.filter((e:any)=>
          e.name.toLowerCase().includes(value.toLowerCase())))
    }
  return (
    <>
    <div className='flex flex-col justify-between md:items-center md:flex-row'>
    <h2 className='text-xl md:texl-2xl mb-2 font-semibold'>Categories Information</h2>
    <Button 
    onClick={()=>setCreate(true)}
    variant={"default"} className='mb-6 transition active:!bg-gray-600 cursor-pointer'>
        <Plus /> Add a Category
    </Button>
    </div>
        <div className="pb-6 mb-2">
          <DeleteDialog 
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          addId={addId}
          setAddId={setAddId}
          />
          <div className="flex items-center gap-4">
            <input
          type="text" 
          onChange={(ev)=>filtering(ev.target.value)}
          className="border-none bg-gray-100 shadow"  
          placeholder="search using specific name..."/>
          <Button 
          className={`
          transition-all duration-300 ease-in-out origin-top 
          hover:bg-gray-800 hover:text-white cursor-pointer
          ${addId?.length > 0 ? "scale-y-100 opacity-100 " 
            : "scale-y-0 opacity-0 pointer-events-none"}`}
          onClick={()=>setOpenDelete(true)}
          variant={"outline"}>
            <Trash />Delete ( {addId?.length} ) Rows
          </Button>
          </div>
          <Table className="mb-2 mt-3 text-center">
            <TableCaption>A list of your recent categories.</TableCaption>
            <TableHeader>
              <TableRow className="text-gray-500">
                <TableHead>
                  <Checkbox 
                  checked={addId?.length===tableData?.length&&addId?.length>0}
                  onCheckedChange={(checked)=>{
                    if (checked) {
                      setAddId(tableData?.map((e:any) => e.id))
                    } else {
                      setAddId([])
                    }
                  }}
                  className={`${tableData?.length>addId.length
                    &&addId?.length>0&&before}`}/>
                </TableHead>
                <TableHead
                onClick={()=>sorting("name")}
                  className="w-fit flex m-auto items-center cursor-pointer">
                  Name{renderArrow("name")}
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-gray-900">
              {tableData?.length>0&&tableData?.map((item:any) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox checked={addId.includes(item.id)} onClick={()=>setAddId(
                        addId.includes(item.id)?
                        addId.filter((e:any)=>e!==item.id)
                        :[...addId, item.id])}
                    />
                  </TableCell>
                  <TableCell
                  >{item.name}</TableCell>
                  <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                        className="cursor-pointer"><Menu /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                          onClick={()=>{setCreate(true);setEdit({id:item.id,name:item.name})}}
                          ><Edit /> Edit</DropdownMenuItem>
                          <DropdownMenuItem
                          onClick={()=>{
                            setAddId([])
                            setAddId([...addId, item.id])
                            setOpenDelete(true)
                          }}
                          ><Trash /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         <HandleForm 
        edit={edit}
        create={create}
        setEdit={setEdit} 
        setCreate={setCreate}
        /> 
    </>
  )
}
