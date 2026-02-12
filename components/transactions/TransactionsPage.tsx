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
import Papa from "papaparse"
import { Button } from '../ui/button'
import { useEffect, useState } from 'react'
import HandleForm, { TransData } from './HandleForm'
import { AlertCircle, ArrowDownUp, ArrowUpDown, Edit, Loader2, Menu, Plus, SolarPanelIcon, Trash, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { Checkbox } from "../ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { DeleteDialog } from "./DeleteDialogue"
import ImportCard from "./ImportCard"
import { formatCurrencyIn, formatCurrencyPer, formatingDate } from "@/lib/utils"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { fetchTransactions } from "@/redux/slices/transactions"
const before=`before:absolute overflow-hidden
relative before:inset-0 before:bg-gray-400 before:z-50`
export default function TransactionsPage() {
    const [create,setCreate]=useState(false)
    const [allData, setAllData] = useState<TransData[]>([])
    const [tableData, setTableData] = useState<TransData[]>([])
    const [addId,setAddId]=useState<any[]>([])
    const [importResult,setImportResult]=useState<any|null>(null)
    const [openDelete,setOpenDelete]=useState<boolean>(false)
    const [edit, setEdit] = useState<TransData | null>(null)
    const [sortingAscDes,setSortingAscDes]=useState({
    direction:"asc",
    key:"" 
    })
    const {data,loading}=useSelector((state:RootState)=>state.getTransactions)
    const dispatch=useDispatch<AppDispatch>()
    // const getTransactions=async()=>{
    //   setCreate(false)
    //     setLoading(true)
    //     const res=await fetch("api/transactions",{
    //         method:"get",
    //         headers:{"content-type":"application/json"}
    //     })
    //     const data=await res.json()
    //     if(data.success){
    //         toast.success("transaction")
    //         setTableData(data.data)
    //         setAllData(data.data)
    //     }else{
    //         toast.error("fetching failed")
    //     }
    //     setLoading(false)
    // }
    useEffect(()=>{
      dispatch(fetchTransactions())
    },[])
    useEffect(()=>{
      setTableData(data)
      setAllData(data)
    },[data])
    useEffect(()=>{
      importResult===null&&dispatch(fetchTransactions())
    },[importResult])
    //sorting
    const sorting=(data:string)=>{
    if(!Array.isArray(tableData)||tableData?.length===0) return
    const sort=[...tableData].sort((a:any,b:any)=>{
        if (data === "amount") {
        return sortingAscDes.direction === "asc"
          ? a.amount - b.amount
          : b.amount - a.amount;
      }
      const aVal = (a[data] ?? "").toString();
      const bVal = (b[data] ?? "").toString();
        if(sortingAscDes.direction==="asc"){
          return aVal.localeCompare(bVal)
        }else{
          return bVal.localeCompare(aVal)
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
        if(!value) return setTableData(allData)
        const search=value.toLowerCase()
        setTableData(allData.filter((e:TransData)=>
        e.account.toLowerCase().includes(search)||
        e.category?.toLowerCase().includes(search)||
        e.payee.toLowerCase().includes(search)
      ))
    }
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      const  text= event.target?.result as string
      Papa.parse(text, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
          setImportResult(results.data)
      }
      })
    }

    reader.readAsText(file)
  }
  return importResult===null?(
    <>
    <div className='flex flex-col mb-2 justify-between md:items-center md:flex-row'>
    <h2 className='text-xl md:texl-2xl mb-2 font-semibold'>Transactions History</h2>
    <div className="flex md:items-center flex-col md:flex-row gap-2">
    <Button 
    onClick={()=>setCreate(true)}
    variant={"default"} className='transition active:!bg-gray-600 cursor-pointer'>
        <Plus /> Add A Transaction
    </Button>
    <label 
    htmlFor="csv"
    className=" flex items-center gap-2 px-2.5 py-1.5 rounded-md font-semibold
    bg-primary cursor-pointer justify-center text-primary-foreground hover:bg-primary/90" >
      <input
      id="csv"
      type="file"
      accept=".csv"
      className="hidden"
      onChange={handleFile}
      />
      <Upload className="size-4 mr-2"/> Import
    </label>
    </div>
    </div>
        <div className="pb-6 mb-2">
          <DeleteDialog 
          openDelete={openDelete}
          setOpenDelete={setOpenDelete}
          dispatch={dispatch}
          addId={addId}
          setAddId={setAddId}
          />
          <div className="flex items-center gap-4">
          <input
          type="text" 
          onChange={(ev)=>filtering(ev.target.value)}
          className="border-none placeholder:text-xs md:placeholder:text-base bg-gray-100 shadow"  
          placeholder="search by account, category or payee..."/>
          <Button 
          className={`
          transition-all duration-300 text-xs md:text-base
         ease-in-out origin-top 
          hover:bg-gray-800 hover:text-white cursor-pointer
          ${addId?.length > 0 ? "scale-y-100 w-fit opacity-100 " 
            : "scale-y-0 opacity-0 w-0 pointer-events-none"}`}
          onClick={()=>setOpenDelete(true)}
          variant={"outline"}>
            <Trash />Delete ( {addId?.length} ) Rows
          </Button>
          </div>
          <Table className="mb-2 mt-3 text-center">
            <TableCaption>A list of your recent Transactions.</TableCaption>
            <TableHeader>
              <TableRow className="text-gray-500">
                <TableHead>
                  <Checkbox 
                  checked={addId?.length===tableData?.length&&addId?.length>0}
                  onCheckedChange={(checked)=>{
                    if (checked) {
                      setAddId(tableData.map((e:any) => e.id))
                    } else {
                      setAddId([])
                    }
                  }}
                  className={`${tableData?.length>addId?.length
                    &&addId?.length>0&&before}`}/>
                </TableHead>
                <TableHead>
                  <div 
                  onClick={()=>sorting("date")}
                  className="w-fit flex m-auto items-center cursor-pointer">
                    Date{renderArrow("date")}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                  onClick={()=>sorting("category")}
                  className="w-fit flex m-auto items-center cursor-pointer">
                    Category{renderArrow("category")}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                  onClick={()=>sorting("payee")}
                  className="w-fit flex m-auto items-center cursor-pointer">
                    Payee{renderArrow("payee")}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                  onClick={()=>sorting("amount")}
                  className="w-fit flex m-auto items-center cursor-pointer">
                    Amount{renderArrow("amount")}
                  </div>
                </TableHead>
                <TableHead>
                  <div 
                  onClick={()=>sorting("account")}
                  className="w-fit flex m-auto items-center cursor-pointer">
                    Account{renderArrow("account")}
                  </div>
                </TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="text-gray-900">
              {tableData?.length>0&&tableData.map((item:TransData) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox checked={addId.includes(item.id)} onClick={()=>setAddId(
                          addId.includes(item.id)?
                          addId.filter((e:any)=>e!==item.id)
                          :[...addId, item.id!])}
                      />
                  </TableCell>
                  <TableCell>{formatingDate(new Date(item.date))}</TableCell>
                  <TableCell>{
                    item.category||
                    <span className="text-red-500 flex items-center gap-1"><AlertCircle />
                     Uncategorized</span>
                  }</TableCell>
                  <TableCell>{item.payee}</TableCell>
                  <TableCell>
                    <span className={`
                      px-3 py-1 rounded-full ${+item.amount<0?"bg-red-500/10 text-red-600":"bg-blue-500/10 text-blue-600"}`}>
                      {formatCurrencyPer(+item.amount)}
                    </span>
                  </TableCell>
                  <TableCell>{item.account}</TableCell>
                  <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger
                        className="cursor-pointer"><Menu /></DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                          onClick={()=>{setCreate(true);setEdit({...item})}}
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
          {
            loading?<Loader2 className="animate-spin mb-3 size-8 m-auto
                ease-out text-gray-600"/>:
                tableData?.length===0&&<div className="text-gray-500 text-center">No results</div>
          }
        </div>
        <HandleForm 
        edit={edit}
        setEdit={setEdit} 
        setCreate={setCreate}
        create={create}
        />
    </>
  ):<ImportCard
   setImportResult={setImportResult}
   importResult={importResult}/>
}
