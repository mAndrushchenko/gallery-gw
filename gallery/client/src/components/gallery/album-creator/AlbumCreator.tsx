import React, { FC, useCallback, useState } from 'react'
import { bufferSelector } from "../../../store/bufferSlice"
import { IAlbumCreator } from "../../../types/components"
import { TAppDispatch } from "../../../types/store-types"
import { useDispatch, useSelector } from "react-redux"
import { TAlbum, TImage } from "../../../types/photo"
import { Button, Form } from "react-bootstrap"
import { msg } from "../../../api/errorMessages"
import {
    addAlbum,
    delPhotoFromMainList,
    userSelector
} from "../../../store/userSlice"
import './AlbumCreator.scss'
import { notification } from "../../notifacation/notification"
import { deleteError, errorSelector } from "../../../store/errorSlice"
import { tokenSelector } from "../../../store/tokenSlice"


const AlbumCreator: FC<IAlbumCreator> = ({ onCloseAlbumCreator }) => {
    const { isError } = useSelector(errorSelector)
    const { token } = useSelector(tokenSelector)
    const [albumName, setAlbumName] = useState('')
    const { photosBuffer } = useSelector(bufferSelector)
    const { photos, albums } = useSelector(userSelector)
    const dispatch = useDispatch<TAppDispatch>()

    const handleAlbumName = useCallback(({ target }) => {
        setAlbumName(target.value)
    }, [setAlbumName])

    const onCancel = useCallback(() => onCloseAlbumCreator(), [onCloseAlbumCreator])

    const makeAlbum = useCallback((event) => {
        event.preventDefault()
        if (isError) dispatch(deleteError())
        if (!token) return notification(msg.tokenError)
        if (!albumName) return notification(msg.albumNameError)

        if (albumName.length > 60) return notification(msg.albumNameLengthError)
        if(albums.some(album => album.albumName === albumName)) return notification(msg.albumNameExist)

        const albumPhotos: TImage[] = []
        const newPhotosList: TImage[] = []

        photos.forEach(photo => {
            if (photosBuffer.some(el => photo.id === el.id)) {
                albumPhotos.push(photo)
            } else {
                newPhotosList.push(photo)
            }
        })

        const newAlbum: TAlbum = {
            photos: albumPhotos,
            albumName
        }

        dispatch(addAlbum({ album: newAlbum, photos: newPhotosList, token, photosBuffer, albumName }))
        dispatch(delPhotoFromMainList({ photosBuffer }))

        setAlbumName('')
        onCloseAlbumCreator()
    }, [
        photosBuffer,
        setAlbumName,
        albumName,
        onCloseAlbumCreator,
        token, dispatch,
        photos, albums,
        isError
    ])

    return (
        <div className="album_creator__container">
            <Form onSubmit={makeAlbum}>
                <Form.Group controlId="formBasicEmail">
                    <Form.Label>Write album name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Name"
                        onChange={handleAlbumName}
                        value={albumName}/>
                </Form.Group>
                <div className="album_creator__btn_group">
                    <Button variant="primary" type="submit" disabled={!albumName}>
                        Create
                    </Button>
                    <Button variant="danger" type="submit" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default AlbumCreator