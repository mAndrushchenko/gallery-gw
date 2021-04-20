import React, { FC, useCallback, useState } from 'react'
import { notification } from "../../../notifacation/notification"
import { addAlbumToBuffer } from "../../../../store/bufferSlice"
import { tokenSelector } from "../../../../store/tokenSlice"
import { TAppDispatch } from "../../../../types/store-types"
import { userSelector } from "../../../../store/userSlice"
import { deleteError } from "../../../../store/errorSlice"
import { useDispatch, useSelector } from "react-redux"
import { IAlbum } from "../../../../types/components"
import { msg } from "../../../../api/errorMessages"
import AlbumPopUp from "./album-pop-up/AlbumPopUp"
import { Button } from "react-bootstrap"
import './Album.scss'

const Album: FC<IAlbum> = ({ photos, albumName, onOpenSlider, albumList }) => {
    const { token } = useSelector(tokenSelector)
    const { albums } = useSelector(userSelector)
    const [delPopUp, setDelPopUp] = useState(false)
    const dispatch = useDispatch<TAppDispatch>()

    const openSlider = useCallback(() => {
        dispatch(deleteError())
        albumList(true)

        albums.forEach(album => {
            if (album.albumName === albumName) {
                dispatch(addAlbumToBuffer(album))
            }
            onOpenSlider(true)
        })
    }, [dispatch, albums, albumList, onOpenSlider, albumName])

    const onDelAlbum = useCallback(() => {
        if (!token) return notification(msg.tokenError)
        dispatch(deleteError())
        setDelPopUp(true)
    }, [dispatch, setDelPopUp, token])

    const onCancelDel = useCallback(() => {
        setDelPopUp(false)
    }, [setDelPopUp])


    return (
        <>
            {delPopUp && <AlbumPopUp
                cancelDel={onCancelDel}
                albumName={albumName}
            />}
            <div className="album__container" id={albumName}>
                <img
                    src={process.env.PUBLIC_URL + `${photos.length ? '/folder.png' : '/empty-folder.png'}`}
                    draggable={false}
                    onClick={openSlider}
                    alt=""
                />
                <div className="album__name">
                    <span>{albumName}</span>
                </div>
                <div className="album__info">
                    <span>{photos.length + (photos.length > 1 ? ' photos' : ' photo')}</span>
                </div>
                <div className="album__btn__delete">
                    <Button variant="danger" onClick={onDelAlbum}>Delete</Button>
                </div>
            </div>
        </>
    )
}

export default Album
