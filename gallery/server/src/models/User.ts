import { Schema, model }from 'mongoose'
import { IUser } from "../types/user"

const schema: Schema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    photos: { type: Array, required: true },
    albums: { type: Array, required: true }
})

export const User =  model<IUser>('user', schema)