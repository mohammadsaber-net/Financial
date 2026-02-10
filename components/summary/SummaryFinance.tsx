"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import DataCharts from "./DataCharts"
import DataGrid from "./DataGrid"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import { fetchTransactions } from "@/redux/slices/transactions"

export default function SummaryFinance() {
  const dispatch=useDispatch<AppDispatch>()
  useEffect(()=>{
    dispatch(fetchTransactions({ accountId:"", from:"", to:"" }))
  },[])
  const {data,loading}=useSelector((state:RootState)=>state.getSummary)
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
