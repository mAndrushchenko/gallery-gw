import { TCandidate, TLoginUser, TLoginUserByToken, TUser } from "./user"

export interface IEndpoint {
    uri: string
    method: string
    body?: string | TCandidate | TLoginUser | TUser | TLoginUserByToken | Blob
    headers?: IHeaders
    token?: string
}

export interface IHeaders {
    [headerName: string]: string;
}
