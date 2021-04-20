import { combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import { uploadPhotos, userSlice } from "./userSlice"
import createSagaMiddleWare from "redux-saga"
import { rootWatcher } from './index'
import { errorSlice } from "./errorSlice"
import { loadingSlice } from "./loadingSlice"
import { bufferSlice } from "./bufferSlice"
import { prevUserState } from "./prevUserState"
import { tokenSlice } from "./tokenSlice"

const sagaMiddleWare = createSagaMiddleWare()

export const rootReducer = combineReducers({
    userSlice: userSlice.reducer,
    errorSlice: errorSlice.reducer,
    loadingSlice: loadingSlice.reducer,
    bufferSlice: bufferSlice.reducer,
    prevUserState: prevUserState.reducer,
    tokenSlice: tokenSlice.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware({
        thunk: false,
        serializableCheck: {
            ignoredActions: [uploadPhotos.type]
        }
    }), sagaMiddleWare] })

sagaMiddleWare.run(rootWatcher)