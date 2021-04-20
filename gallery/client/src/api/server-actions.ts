import { TCandidate, TLoginUser } from "../types/user"
import { TBuffer } from "../types/store-types"


export const login = (body: TLoginUser) => ({
    uri: '/api/auth/login',
    method: 'POST',
    body
})

export const loginByToken = (token: string) => ({
    uri: '/api/user',
    method: 'GET',
    token
})

export const register = (body: TCandidate) => ({
    uri: '/api/auth/register',
    method: 'POST',
    body
})

export const addPhotosUri = '/api/user/add/photos'
export const addPhotos = (fd: FormData, token: string) => ({
    method: 'POST',
    body: fd,
    headers: {
        'Authorization': `Bearer ${token}`
    }
})

export const removePhotosAction = ({ photosBuffer, token }: { photosBuffer: TBuffer[], token: string }) => ({
    uri: '/api/user/delete/photos',
    method: 'DELETE',
    body: {
        photosBuffer
    },
    token
})

export const addAlbumAction = ({ photosBuffer, token, albumName }:
                                   { photosBuffer: TBuffer[], token: string, albumName: string }) => ({
    uri: '/api/user/add/album',
    method: 'POST',
    body: {
        photosBuffer,
        albumName
    },
    token
})

export const delAlbumAction = ({ token, albumName }: { token: string, albumName: string }) => ({
    uri: '/api/user/delete/album',
    method: 'DELETE',
    body: {
        albumName
    },
    token
})

export const delAlbumOnlyA = ({ token, albumName }: { token: string, albumName: string }) => ({
    uri: '/api/user/delete/album/only',
    method: 'DELETE',
    body: {
        albumName
    },
    token
})