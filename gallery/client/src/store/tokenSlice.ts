import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TReducer, TToken } from "../types/store-types"


const initialState: TToken = {
    token: null,
}

export const tokenSlice = createSlice({
    name: 'response messages',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<TToken>) => action.payload,

        deleteToken: () => ({ token: null })
    }
})

export const {
    setToken,
    deleteToken
} = tokenSlice.actions

export const tokenSelector = (state: TReducer) => state.tokenSlice