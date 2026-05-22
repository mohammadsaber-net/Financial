"use client"

import { useEffect} from "react"
import DataCharts from "./DataCharts"
import DataGrid from "./DataGrid"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { fetchSummary } from "@/redux/slices/summary"

export default function SummaryFinance() {
  const dispatch=useDispatch<AppDispatch>()
  useEffect(()=>{
    dispatch(fetchSummary())
  },[])
  const {data,loading}=useSelector((state:RootState)=>state.getSummary)
  console.log(data,loading)
  return (
    <>
    <DataGrid 
    loading={loading}
    data={data}
    />
   <DataCharts 
   loading={loading}
   data={data}
   />
    </>
  )
}
