import React, { useCallback, useEffect, useState } from 'react'
import { deletePhotosById, uploadPhotos } from "../../store/userSlice"
import { notification } from "../notifacation/notification"
import PhotoPopUp from "./list/photo/photo-pop-up/PhotoPopUp"
import { bufferSelector } from "../../store/bufferSlice"
import AlbumCreator from "./album-creator/AlbumCreator"
import { tokenSelector } from "../../store/tokenSlice"
import { useDispatch, useSelector } from "react-redux"
import { TAppDispatch } from "../../types/store-types"
import { setError } from "../../store/errorSlice"
import { msg } from "../../api/errorMessages"
import { Button } from "react-bootstrap"
import List from "./list/List"
import './Gallery.scss'
import { useAuth } from "../../hooks/useAuth"


const Gallery = () => {
    const { photosBuffer } = useSelector(bufferSelector)
    const { token } = useSelector(tokenSelector)
    const dispatch = useDispatch<TAppDispatch>()
    const { isTokenExist } = useAuth()

    const [images, setImages] = useState<Blob[] | null>(null)
    const [isAlbumCreation, setAlbumCreation] = useState(false)
    const [showMakeBtn, setShowMakeBtn] = useState(true)
    const [showUploadBtn, setShowUploadBtn] = useState(false)
    const [selectedFiles, setSelectedFiles] = useState(0)
    const [showDelPopUp, setShowDelPopUp] = useState(false)

    useEffect(() => {
        isTokenExist()
    }, [isTokenExist])

    const choseFiles = useCallback((event) => {
        if (event.target.files.length > 10) return notification(msg.amountOfFileError)
        setImages(event.target.files)
        setShowUploadBtn(true)
        setSelectedFiles(event.target.files.length)
    }, [setImages, setShowUploadBtn, setSelectedFiles])

    const loadFile = useCallback(async () => {
        const fd = new FormData()
        if (images) {
            for (let i = 0; i < images.length; i++) {
                await fd.append('images', images[i])
            }
        }
        if (!token) return notification(msg.tokenError)

        dispatch(uploadPhotos({ fd, token }))
        setShowUploadBtn(false)
        setSelectedFiles(0)
    }, [dispatch, setShowUploadBtn, images, setSelectedFiles, token])

    const onDeletePhotos = useCallback(() => {
        if (token && photosBuffer.length) {
            dispatch(deletePhotosById({ photosBuffer, token }))
        } else {
            notification(msg.tokenError)
            dispatch(setError('Something happened with your authorization '))
        }
        setShowDelPopUp(false)
    }, [dispatch, token, photosBuffer])

    const onDelPhotosPopUp = useCallback(() => {
        setShowDelPopUp(prevState => !prevState)
    }, [setShowDelPopUp])

    const onMakeAlbum = useCallback(() => {
        setAlbumCreation(true)
        setShowMakeBtn(false)
    }, [setAlbumCreation, setShowMakeBtn])

    const onCloseAlbumCreator = useCallback(() => {
        setAlbumCreation(false)
        setShowMakeBtn(true)
    }, [setAlbumCreation, setShowMakeBtn])


    return (
        <div className="gallery__container">
            {showDelPopUp && <PhotoPopUp
                onDelete={onDeletePhotos}
                cancel={onDelPhotosPopUp}
            />}
            <List/>
            <div>
                <div className="gallery__btn__chose_files">
                    <Button variant="success">
                        {!selectedFiles ? 'Chose files' : `${selectedFiles} ${selectedFiles > 1 ? 'files' : 'file'} selected`}
                        <input type="file" id="upload" accept="image/x-png,image/jpeg" name="image"
                               onChange={choseFiles} multiple/>
                    </Button>
                    {showUploadBtn &&
                        <div className="animate__animated animate__bounceInUp">
                            <Button variant="primary" className="animate__animated animate__pulse animate__infinite"
                                    onClick={loadFile}>Upload files</Button>
                        </div>
                    }
                </div>
                {!!photosBuffer.length && showMakeBtn &&
                <div className="gallery__btn__right_side animate__animated animate__bounceInUp">
                    <Button variant="danger"  onClick={onDelPhotosPopUp}>Delete photos</Button>
                    <Button variant="success" className="animate__animated animate__pulse animate__infinite"
                            onClick={onMakeAlbum}>Make album</Button>
                </div>}
            </div>
            {isAlbumCreation && <AlbumCreator
                onCloseAlbumCreator={onCloseAlbumCreator}
            />}
        </div>

    )

}

export default Gallery