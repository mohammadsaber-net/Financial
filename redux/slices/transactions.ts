import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
type FetchTransactionsParams = {
  accountId?: string
  from?: string
  to?: string
}
export const fetchTransactions = createAsyncThunk<
  any,
  FetchTransactionsParams | undefined
>(
  "fetchTransactions/sliceTransactions",
  async (param, { rejectWithValue }) => {
    try {
      const { accountId, from, to } = param || {}

      const query = new URLSearchParams({
        accountId: accountId || "",
        from: from || "",
        to: to || "",
      })

      const res = await fetch(`/api/summary?${query.toString()}`, {
        method: "get",
        headers: { "content-type": "application/json" },
      })

      const data = await res.json()

      if (data.success) {
        return data.data
      } else {
        return rejectWithValue(data.message || "failed to fetch accounts")
      }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)

// export const fetchTransactions=createAsyncThunk("fetchTransactions/sliceTransactions",async(param:FetchTransactionsParams={},{ rejectWithValue })=>{
//     try {
//         const { accountId, from, to } = param || {}
//         const query = new URLSearchParams({
//             accountId: accountId || "",
//             from: from || "",
//             to: to || "", 
//         })
//         const res=await fetch(`/api/summary?${query.toString()}`,{
//         method:"get",
//         headers:{"content-type":"application/json"}
//         })
//         const data=await res.json()
//         if(data.success){
//             return data.data
//         }else{
//         return rejectWithValue(data.message||"failed to fetch accounts") 
//         }
//     } catch (error) {
//        return rejectWithValue((error as Error).message) 
//     }
// })
export const sliceTransactions=createSlice({
    initialState:{
        loading:false,
        error:null as any,
        data:null as any
    },
    name:"sliceTransactions",
    extraReducers(builder) {
        builder.addCase(fetchTransactions.pending,(state,action)=>{
            state.loading=true
        })
        .addCase(fetchTransactions.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
        .addCase(fetchTransactions.fulfilled,(state,action)=>{
            state.loading=false
            state.data=action.payload
        })
    },
    reducers:{}
})
export const{}=sliceTransactions.actions