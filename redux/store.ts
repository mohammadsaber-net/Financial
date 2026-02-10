import {configureStore} from "@reduxjs/toolkit"
import { sliceCategories } from "./slices/categories"
import { sliceAccounts } from "./slices/accounts"
import { sliceTransactions } from "./slices/transactions"
export const store=configureStore({
    reducer:{
        getAccounts:sliceAccounts.reducer,
        getCategories:sliceCategories.reducer,
        getSummary:sliceTransactions.reducer,
    }
})
export type RootState=ReturnType<typeof store.getState>
export type AppDispatch=typeof store.dispatch