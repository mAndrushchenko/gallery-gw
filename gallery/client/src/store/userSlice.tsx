import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { TAddAlbumA, TDelAlbum, TDelPhotoFromAlbumA, TPhotoBuffer, TReducer } from "../types/store-types"
import { TCandidate, TLoginUser, TLoginUserByToken, TUser } from "../types/user"
import { TAlbum, TImage } from "../types/photo"

const initialState: TUser = {
    firstName: '',
    lastName: '',
    token: '',
    _id: '',
    albums: [],
    photos: [],
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<TLoginUser>) => {
        },

        loginUserByToken: (state, action: PayloadAction<TLoginUserByToken>) => {
        },

        registerUser: (state, action: PayloadAction<TCandidate>) => {
        },

        uploadPhotos: (state, action: PayloadAction<{fd: FormData, token: string}>) => {
        },

        deletePhotosById: (state, action: PayloadAction<{ photosBuffer: TPhotoBuffer[], token: string }>) => {
            return {
                ...state,
                photos: state.photos.filter(photo => !action.payload.photosBuffer.some(el => el.id === photo.id))
            }
        },

        delPhotoFromMainList: (state, action: PayloadAction<{ photosBuffer: TPhotoBuffer[] }>) => {
            return {
                ...state,
                photos: state.photos.filter(photo => !action.payload.photosBuffer.some(el => el.id === photo.id))
            }

        },

        delPhotoFromAlbum: (state, action: PayloadAction<TDelPhotoFromAlbumA>) => {
            return {
                ...state,
                albums: state.albums.map(album => {
                    if (album.albumName === action.payload.albumName) {
                        return {
                            ...album, photos: album.photos.filter(photo => {
                                return action.payload.photo.id !== photo.id
                            })
                        }
                    }
                    return album
                })
            }
        },

        addAlbum: (state, action: PayloadAction<TAddAlbumA>) => {
            const newAlbumList = [...state.albums, action.payload.album]
            return { ...state, albums: newAlbumList, photos: action.payload.photos }
        },

        delAlbumWithPhotos: (state, action: PayloadAction<TDelAlbum>) => {
            return {
                ...state, albums: state.albums.filter(album => album.albumName !== action.payload.albumName)
            }
        },

        delAlbumWithoutPhotos: (state, action: PayloadAction<TDelAlbum>) => {
            let photosFromAlbum: TImage[] = []
            state.albums.forEach(album => {
                if (album.albumName === action.payload.albumName) {
                    if (album.photos.length) {
                        photosFromAlbum = [...album.photos]
                    }
                }
            })
            return {
                ...state, photos: [...state.photos, ...photosFromAlbum],
                albums: state.albums.filter(album => album.albumName !== action.payload.albumName)
            }
        },
        setUser: (state, action: PayloadAction<TUser>) => action.payload,
    },
})

export const {
    loginUser,
    setUser,
    registerUser,
    loginUserByToken,
    uploadPhotos,
    deletePhotosById,
    addAlbum,
    delPhotoFromMainList,
    delAlbumWithPhotos,
    delAlbumWithoutPhotos,
    delPhotoFromAlbum
} = userSlice.actions

export const userSelector = (state: TReducer) => state.userSlice