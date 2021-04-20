import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TReducer } from "../types/store-types"
import { TUser } from "../types/user"


const initialState: TUser = {
    firstName: '',
    lastName: '',
    token: '',
    _id: '',
    albums: [],
    photos: [],
}

export const prevUserState = createSlice({
    name: 'prev user state',
    initialState,
    reducers: {
        updateUserState: (state, action: PayloadAction<TUser>) => action.payload
    }
})

export const {
    updateUserState
} = prevUserState.actions

export const prevUserStateSelector = (state: TReducer) => state.prevUserState