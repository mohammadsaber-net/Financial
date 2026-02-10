import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import toast from "react-hot-toast";

export const fetchCategories=createAsyncThunk("fetchCategories/sliceCategories",async(_, { rejectWithValue })=>{
    try {
        const res=await fetch("api/categories",{
        method:"get",
        headers:{"content-type":"application/json"}
        })
        const data=await res.json()
        if(data.success){
            return data.data
        }else{
        return rejectWithValue(data.message||"failed to fetch categories") 
        }
    } catch (error) {
       return rejectWithValue((error as Error).message) 
    }
})
export const sliceCategories=createSlice({
    initialState:{
        loading:false,
        error:null as any,
        data:null as any
    },
    name:"sliceCategories",
    extraReducers(builder) {
        builder.addCase(fetchCategories.pending,(state,action)=>{
            state.loading=true
        })
        .addCase(fetchCategories.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
        .addCase(fetchCategories.fulfilled,(state,action)=>{
            state.loading=false
            state.data=action.payload
        })
    },
    reducers:{}
})
export const{}=sliceCategories.actions