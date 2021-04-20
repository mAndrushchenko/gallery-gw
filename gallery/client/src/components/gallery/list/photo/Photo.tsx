import React, { FC, useCallback, useState } from 'react'
import { notification } from "../../../notifacation/notification"
import { deletePhotosById } from "../../../../store/userSlice"
import { tokenSelector } from "../../../../store/tokenSlice"
import { TAppDispatch } from "../../../../types/store-types"
import { setError } from "../../../../store/errorSlice"
import { useDispatch, useSelector } from "react-redux"
import { IPhoto } from "../../../../types/components"
import { msg } from "../../../../api/errorMessages"
import PhotoPopUp from "./photo-pop-up/PhotoPopUp"
import { Button } from "react-bootstrap"
import {
    addPhotosToBuffer,
    bufferSelector,
    removeFromBuffer
} from "../../../../store/bufferSlice"
import './Photo.scss'


const Photo: FC<IPhoto> = ({ photoName, size, date, id, onOpenSlider, albumList }) => {
    const dispatch = useDispatch<TAppDispatch>()
    const { token } = useSelector(tokenSelector)
    const { photosBuffer } = useSelector(bufferSelector)
    const [active, setActive] = useState(false)
    const [popUp, setPopUp] = useState(false)

    const onCheck = useCallback(() => {
        setActive(prevState => !prevState)
        !active ? dispatch(addPhotosToBuffer({ id })) :
            dispatch(removeFromBuffer({ id }))

    }, [dispatch, setActive, active, id])

    const onDelete = useCallback(() => {
        if (token && photosBuffer.length) {
            dispatch(deletePhotosById({ photosBuffer, token }))
        } else if (token) {
            dispatch(deletePhotosById({ photosBuffer: [{ id }], token }))
        } else {
            notification(msg.tokenError)
            dispatch(setError('Something happened with your authorization '))
        }
        setPopUp(false)
    }, [dispatch, photosBuffer, token, id, setPopUp])

    const showDelPopUp = useCallback(() => {
        setPopUp(true)
    }, [setPopUp])

    const closeDelPopUp = useCallback(() => {
        setPopUp(false)
    }, [setPopUp])

    const openSlider = useCallback(() => {
        onOpenSlider(true)
        albumList(false)
    }, [onOpenSlider, albumList])

    return (
        <>
            {popUp && <PhotoPopUp
                onDelete={onDelete}
                cancel={closeDelPopUp}
            />}
            <div className={`photo__container ${active ? "photo__checkbox__active" : ""}`}>
                <div className="photo">
                    <div className="photo__image">
                        <img src={`/uploads/${photoName}`} alt="" onClick={openSlider} draggable={false}/>
                    </div>
                </div>
                <div className="photo__left_side__checkbox">
                    <input type="checkbox" onChange={onCheck} checked={active}/>
                </div>
                <div className="photo__right_side__description">
                    <div className="photo__btn__delete">
                        <Button variant="danger" onClick={showDelPopUp}>Delete</Button>
                    </div>
                    <div className="photo__info">
                        <div>
                            <span>{size}</span>
                        </div>
                        <div>
                            <span>{date}</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Photo