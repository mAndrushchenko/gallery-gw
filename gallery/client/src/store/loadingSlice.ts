import { createSlice } from "@reduxjs/toolkit"
import { TReducer, TLoading } from "../types/store-types"


const initialLoading: TLoading = {
    isLoading: false,
}

export const loadingSlice = createSlice({
    name: 'response messages',
    initialState: initialLoading,
    reducers: {
        startLoading: (): TLoading => ({ isLoading: true }),

        endLoading: (): TLoading => ({ isLoading: false }),
    }
})

export const {
    startLoading,
    endLoading,
} = loadingSlice.actions

export const loadingSelector = (state: TReducer) => state.loadingSlice