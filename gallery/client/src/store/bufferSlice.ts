import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TBuffer, TPhotoBuffer, TReducer } from "../types/store-types"
import { TAlbum } from "../types/photo"


const initialState: TBuffer = {
    albumBuffer: {
        albumName: '',
        photos: []
    },
    photosBuffer: []
}

export const bufferSlice = createSlice({
    name: 'buffer',
    initialState,
    reducers: {
        addPhotosToBuffer: (state, action: PayloadAction<TPhotoBuffer>) => ({
            ...state, photosBuffer: [...state.photosBuffer, action.payload]
        }),

        removeFromBuffer: (state, action: PayloadAction<TPhotoBuffer>) => ({
            ...state, photosBuffer: state.photosBuffer.filter(item => item.id !== action.payload.id)
        }),

        addAlbumToBuffer: (state, action: PayloadAction<TAlbum>) => ({
            ...state, albumBuffer: action.payload
        }),

        resetPhotosBuffer: (state) => ({ ...state, photosBuffer: [] }),

        resetAlbumBuffer: (state) => ({ ...state, albumBuffer: { albumName: '', photos: [] } })
    }
})

export const {
    addPhotosToBuffer,
    removeFromBuffer,
    resetPhotosBuffer,
    resetAlbumBuffer,
    addAlbumToBuffer
} = bufferSlice.actions

export const bufferSelector = (state: TReducer) => state.bufferSlice