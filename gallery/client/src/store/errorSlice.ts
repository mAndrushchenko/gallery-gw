import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TResMessage, TReducer } from "../types/store-types"


const initialState: TResMessage = {
    isError: false,
    isSuccess: false,
    errorMessage: '',
    successMessage: '',
}

export const errorSlice = createSlice({
    name: 'response messages',
    initialState,
    reducers: {
        setError: (state, action: PayloadAction<string>):TResMessage => {
            return {...state, isError: true, errorMessage: action.payload}
        },

        deleteError: (state):TResMessage => {
            return {...state, isError: false, errorMessage: ''}
        },

        setSuccess: (state, action: PayloadAction<string>):TResMessage => {
            return {...state, isSuccess: true, successMessage: action.payload}
        },

        deleteSuccess: (state):TResMessage => {
            return {...state, isSuccess: false, successMessage: ''}
        },
    }
})

export const {
    setError,
    deleteError,
    setSuccess,
    deleteSuccess
} = errorSlice.actions

export const errorSelector = (state: TReducer) => state.errorSlice