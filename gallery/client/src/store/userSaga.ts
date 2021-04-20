import { put, call, takeEvery } from 'redux-saga/effects'
import { TLoginUser, TLoginUserByToken, TUser } from "../types/user"
import { request } from '../api/request'
import {
    delAlbumWithoutPhotos,
    delAlbumWithPhotos,
    deletePhotosById,
    loginUserByToken,
    uploadPhotos,
    registerUser,
    addAlbum,
    loginUser,
    setUser
} from "./userSlice"
import { PayloadAction } from "@reduxjs/toolkit"
import { deleteError, setError, setSuccess } from "./errorSlice"
import { endLoading } from "./loadingSlice"
import {
    removePhotosAction,
    addAlbumAction,
    delAlbumAction,
    delAlbumOnlyA,
    loginByToken,
    addPhotosUri,
    addPhotos,
    register,
    login
} from "../api/server-actions"
import { msg } from "../api/errorMessages"
import { resetPhotosBuffer } from "./bufferSlice"
import { updateUserState } from "./prevUserState"
import { notification } from "../components/notifacation/notification"
import { TAddAlbumA, TDelAlbum, TDelPhotoFromAlbumA, TPhotoBuffer } from "../types/store-types"

const makeRequest = (actionPayload: any, serverAction: any): any => {
    const fetchDataFromApi = () => request(serverAction(actionPayload))
    return call(fetchDataFromApi)
}

function* onSuccess (user:TUser) {
    yield put(updateUserState(user))
    yield put(endLoading())
    yield put(setUser(user))
    yield put(deleteError())
}

function* onError (message:string) {
    yield put(endLoading())
    yield put(setError(message))
}

function* userLogin(actionPayload: any, serverAction: any): any {
    try {
        const data = yield makeRequest(actionPayload, serverAction)

        if (data.message) {
            yield put(endLoading())
            return yield put(setError(data.message))
        }

        const user: TUser = data.userData

        yield put(updateUserState(user))
        yield put(endLoading())
        yield put(setUser(user))
    } catch (error) {
        yield onError(error.message)
    }
}

function* userLoginWorker(action: PayloadAction<TLoginUser>) {
    yield userLogin(action.payload, login)
}


function* userLoginByTokenWorker(action: PayloadAction<TLoginUserByToken>) {
    yield userLogin(action.payload.token, loginByToken)
}

function* userRegisterWorker(action: PayloadAction<TLoginUser>): any {
    try {
        const data = yield makeRequest(action.payload, register)
        if (data.message) {
            yield put(endLoading())
            return yield put(setError(data.message))
        }
        yield put(endLoading())
        yield put(setSuccess(data.message))
        yield put(updateUserState(data.userData))
        yield put(deleteError())
    } catch (error) {
        yield onError(error.message)
    }
}

function* uploadNewPhotos(action: PayloadAction<{fd: FormData, token: string}>): any {
    try {
        const { fd, token } = action.payload
        const data = yield fetch(addPhotosUri, addPhotos(fd, token)).then(data => data.json())

        if (data.message) {
            yield put(endLoading())
            return yield put(setError(data.message))
        }
        yield onSuccess(data.user)
    } catch (error) {
        yield put(endLoading())
        yield put(setError(msg.fileConfiguration))
        notification(msg.fileConfiguration)
    }
}

function* deletePhotos(action: PayloadAction<TDelPhotoFromAlbumA>): any {
    try {
        const data = yield makeRequest(action.payload, removePhotosAction)

        if (data.message && !data.status) {
            yield put(endLoading())
            return yield put(setError(data.message))
        }

        yield onSuccess(data.user)
        yield put(resetPhotosBuffer())
    } catch (error) {
        yield put(resetPhotosBuffer())
        yield onError(error.message)
    }
}

function* addAlbumGen(action: PayloadAction<TAddAlbumA>): any {
    try {
        const reqData = {
            token: action.payload.token,
            photosBuffer: action.payload.photosBuffer,
            albumName: action.payload.albumName
        }

        const data = yield makeRequest(reqData, addAlbumAction)

        if (data.message && !data.status) {
            yield put(endLoading())
            yield put(resetPhotosBuffer())
            return yield put(setError(data.message))
        }

        yield onSuccess(data.user)
    } catch (error) {
        yield put(resetPhotosBuffer())
        yield onError(error.message)
    }
}

function* delAlbumGen(action: PayloadAction<TDelAlbum>): any {
    try {
        const reqData = {
            token: action.payload.token,
            albumName: action.payload.albumName
        }

        const data = yield makeRequest(reqData, delAlbumAction)

        if (data.message && !data.status) {
            yield put(endLoading())
            yield put(resetPhotosBuffer())
            return yield put(setError(data.message))
        }
        yield onSuccess(data.user)
    } catch (error) {
        yield put(resetPhotosBuffer())
        yield onError(error.message)
    }
}

function* delAlbumOnlyGen(action: PayloadAction<TDelAlbum>): any {
    try {
        const reqData = {
            token: action.payload.token,
            albumName: action.payload.albumName
        }
        const data = yield makeRequest(reqData, delAlbumOnlyA)

        if (data.message && !data.status) {
            yield put(endLoading())
            yield put(resetPhotosBuffer())
            return yield put(setError(data.message))
        }
        yield onSuccess(data.user)
    } catch (error) {
        yield put(resetPhotosBuffer())
        yield onError(error.message)
    }
}

export function* userWatcher() {
    yield takeEvery(loginUser.type, userLoginWorker)
    yield takeEvery(registerUser.type, userRegisterWorker)
    yield takeEvery(loginUserByToken.type, userLoginByTokenWorker)
    yield takeEvery(uploadPhotos.type, uploadNewPhotos)
    yield takeEvery(deletePhotosById.type, deletePhotos)
    yield takeEvery(addAlbum.type, addAlbumGen)
    yield takeEvery(delAlbumWithPhotos.type, delAlbumGen)
    yield takeEvery(delAlbumWithoutPhotos.type, delAlbumOnlyGen)
}
