import React, { FC, useCallback } from 'react'
import { notification } from "../../../../notifacation/notification"
import { tokenSelector } from "../../../../../store/tokenSlice"
import { TAppDispatch } from "../../../../../types/store-types"
import { IAlbumPopUp } from "../../../../../types/components"
import { useDispatch, useSelector } from "react-redux"
import { msg } from "../../../../../api/errorMessages"
import { Button } from "react-bootstrap"
import {
    delAlbumWithoutPhotos,
    delAlbumWithPhotos
} from "../../../../../store/userSlice"
import './AlbumPopUp.scss'


const AlbumPopUp: FC<IAlbumPopUp> = ({ cancelDel, albumName }) => {
    const { token } = useSelector(tokenSelector)
    const dispatch = useDispatch<TAppDispatch>()

    const onDelAlbumWithPhoto = useCallback(() => {
        if (!token) return notification(msg.tokenError)
        dispatch(delAlbumWithPhotos({ albumName, token }))
    }, [dispatch, token, albumName])

    const onDelAlbumWithoutPhoto = useCallback(() => {
        if (!token) return notification(msg.tokenError)
        dispatch(delAlbumWithoutPhotos({ albumName, token }))
    }, [dispatch, token, albumName])

    return (
        <div className="pop_up__album__delete  animate__animated animate__fadeInDownBig animate__faster">
            <div className="pop_up__album__text">
                <span>What would you like to do with photos from this album?</span>
            </div>
            <div className="pop_up__album__btn__group">
                <Button onClick={onDelAlbumWithPhoto} variant="danger">Delete photos</Button>
                <Button onClick={onDelAlbumWithoutPhoto} variant="primary">Move photos to the main folder</Button>
            </div>
            <div className="pop_up__album__btn__cancel">
                <Button onClick={cancelDel} variant="success">I clicked accidentally :)</Button>
            </div>
        </div>
    )
}

export default AlbumPopUp
