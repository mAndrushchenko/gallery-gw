import { Document } from "mongoose"
import { TAlbum, TImage } from "./photo"

export interface IUser extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    photos: TImage[],
    albums: TAlbum[]
}


export type TResUserData = {
    firstName: string,
    lastName: string,
    token: string
    photos: TImage[],
    albums: TAlbum[]
}


export type TImage = {
    id: number
    name: string
    size: number
    format: string
    path: string
}