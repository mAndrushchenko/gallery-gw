import React, { FC, useCallback, useEffect, useState } from 'react'
import { addAlbumToBuffer, bufferSelector } from "../../../../../store/bufferSlice"
import { notification } from "../../../../notifacation/notification"
import { tokenSelector } from "../../../../../store/tokenSlice"
import { TAppDispatch } from "../../../../../types/store-types"
import { deleteError, errorSelector } from "../../../../../store/errorSlice"
import PhotoPopUp from "../../photo/photo-pop-up/PhotoPopUp"
import { ISlider } from "../../../../../types/components"
import SliderPreview from "./slider-item/SliderPreview"
import { msg } from "../../../../../api/errorMessages"
import { useDispatch, useSelector } from "react-redux"
import { Button, Carousel } from "react-bootstrap"
import {
    deletePhotosById,
    delPhotoFromAlbum,
    userSelector
} from "../../../../../store/userSlice"
import './AlbumSlider.scss'


const AlbumSlider: FC<ISlider> = ({ closeSlider, album }) => {
    const { isError } = useSelector(errorSelector)
    const { photos, albums } = useSelector(userSelector)
    const { albumBuffer } = useSelector(bufferSelector)
    const { token } = useSelector(tokenSelector)
    const dispatch = useDispatch<TAppDispatch>()

    const [photosList, setPhotosList] = useState(album ? albumBuffer.photos : photos)
    const [index, setIndex] = useState(0)
    const [popUp, setPopUp] = useState(false)

    useEffect(() => {
        if (isError) dispatch(deleteError())
        if (album) {
            const currentAlbum = albums.filter(album => album.albumName === albumBuffer.albumName)
            if (currentAlbum) dispatch(addAlbumToBuffer(currentAlbum[0]))
        }
        setPhotosList(album ? albumBuffer.photos : photos)
    }, [dispatch, isError, albumBuffer, photos, album, albums, setPhotosList])

    useEffect(() => {
        if (!photosList.length) closeSlider(false)
    }, [closeSlider, photosList])

    const handleSelect = useCallback((selectedIndex: number) => {
        setIndex(selectedIndex)
    }, [setIndex])

    const selectImage = useCallback((index: number) => {
        setIndex(index)
    }, [setIndex])

    const onCloseSlider = useCallback(() => {
        closeSlider(false)
    }, [closeSlider])

    const onDelPhoto = useCallback(() => {
        setPopUp(true)
    }, [setPopUp])

    const onDelete = useCallback(() => {
        if (isError) dispatch(deleteError())
        if (!token) {
            notification(msg.tokenError)
            return setPopUp(false)
        }
        if (album) {
            dispatch(delPhotoFromAlbum({
                albumName: albumBuffer.albumName,
                photo: albumBuffer.photos[index]
            }))
        } else {
            dispatch(deletePhotosById({
                photosBuffer: [{ id: photos[index].id }],
                token }))
        }
        if (index === photosList.length - 1) setIndex(prevState => prevState - 1)
            setPopUp(false)
    }, [dispatch, token, index, albumBuffer, photos, album, isError, setIndex, photosList.length])

    const closeDelPopUp = useCallback(() => {
        setPopUp(false)
    }, [setPopUp])

    return (
        <div className="slider__container animate__animated animate__fadeInDown">
            <Carousel
                indicators={false}
                bsPrefix="carousel"
                className="slider"
                activeIndex={index}
                onSelect={handleSelect}
            >
                {photosList.map(photo => {
                    return (
                        <Carousel.Item key={photo.id} interval={1000 * 10}>
                            <div className="slider__item">
                                <img src={`/uploads/${photo.name}`} alt="" draggable={false}/>
                            </div>
                        </Carousel.Item>)
                })}
            </Carousel>
            {!!photosList.length && <div className="slider__image__info">
                <div className="slider__image__info__text">
                    <div>
                        <span>{photosList[index] ? photosList[index].size : ''}</span>
                    </div>
                    <div>
                        <span>{photosList[index] ? photosList[index].date : ''}</span>
                    </div>
                </div>
                <div className="slider__image__info__btn">
                    <Button variant="danger" onClick={onDelPhoto}>Delete</Button>
                </div>
            </div>}
            {popUp && <PhotoPopUp
                onDelete={onDelete}
                cancel={closeDelPopUp}
            />}
            <div className="slider__preview">
                {photosList.map((photo, i) => {
                    return <SliderPreview
                        key={photo.id + i}
                        photo={photo}
                        index={i}
                        selectImage={selectImage}
                        active={index === i}
                    />
                })}
            </div>
            <div className="slider__btn__close">
                <button onClick={onCloseSlider}>&#10005;</button>
            </div>
        </div>
    )
}

export default AlbumSlider