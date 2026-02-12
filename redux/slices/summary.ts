import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
type FetchSummaryParams = {
  accountId?: string
  from?: string
  to?: string
}
export const fetchSummary = createAsyncThunk<
  any,
  FetchSummaryParams | undefined
>(
  "fetchSummary/sliceSummary",
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
        return rejectWithValue(data.message || "failed to fetch summary")
      }
    } catch (error) {
      return rejectWithValue((error as Error).message)
    }
  }
)
export const sliceSummary=createSlice({
    initialState:{
        loading:false,
        error:null as any,
        data:null as any
    },
    name:"sliceSummary",
    extraReducers(builder) {
        builder.addCase(fetchSummary.pending,(state,action)=>{
            state.loading=true
        })
        .addCase(fetchSummary.rejected,(state,action)=>{
            state.loading=false
            state.error=action.payload
        })
        .addCase(fetchSummary.fulfilled,(state,action)=>{
            state.loading=false
            state.data=action.payload
        })
    },
    reducers:{}
})
export const{}=sliceSummary.actions