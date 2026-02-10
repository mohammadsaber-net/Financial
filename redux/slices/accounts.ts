import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const fetchAccounts=createAsyncThunk("fetchAccounts/sliceAccounts",async(_, { rejectWithValue })=>{
    try {
        const res=await fetch("api/accounts",{
        method:"get",
        headers:{"content-type":"application/json"}
        })
        const data=await res.json()
        if(data.success){
            return data.data
        }else{
        return rejectWithValue(data.message||"failed to fetch accounts") 
        }
    } catch (error) {
       return rejectWithValue((error as Error).message) 
    }
})
export const sliceAccounts=createSlice({
    initialState:{
        loading:false,
        error:null as any,
        data:null as any
    },
    name:"sliceAccounts",
    extraReducers(builder) {
        builder.addCase(fetchAccounts.pending,(state,action)=>{
            state.loading=true
        })
        .addCase(fetchAccounts.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
        .addCase(fetchAccounts.fulfilled,(state,action)=>{
            state.loading=false
            state.data=action.payload
        })
    },
    reducers:{}
})
export const{}=sliceAccounts.actions