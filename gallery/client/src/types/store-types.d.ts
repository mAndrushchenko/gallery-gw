import { rootReducer, store } from "../store/configure-store"
import { TAlbum, TImage } from "./photo"

export type TReducer = ReturnType<typeof rootReducer>

export type TAppDispatch = typeof store.dispatch

export type TResMessage = {
    isError: boolean
    isSuccess: boolean
    errorMessage: string
    successMessage: string
}

export type TLoading = {
    isLoading: boolean
}

export type TToken = {
    token: string | null
}

export type  TPhotoBuffer = {id: number}

export type TBuffer = {albumBuffer: TAlbum, photosBuffer: TPhotoBuffer[]}

export type IIcon = {
    message:string
}

export type TAddAlbumA = {
 album: TAlbum, photos: TImage[], token: string, photosBuffer: TPhotoBuffer[], albumName: string
}

export type TDelPhotoFromAlbumA = {
    albumName: string, photo: TImage
}

export type TDelAlbum = { albumName: string, token: string }