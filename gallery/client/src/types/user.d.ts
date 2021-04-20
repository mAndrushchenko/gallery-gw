import { TAlbum, TImage } from "./photo"

export type TCandidate = {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    photos: TImage[],
    albums: TAlbum[],
}

export type TLoginUser = {
    email: string,
    password: string,
}

export type TLoginUserByToken = {
    token: string,
}

export type TUser = {
    firstName: string,
    lastName: string,
    token: string,
    _id: string
    photos: TImage[],
    albums: TAlbum[],
}