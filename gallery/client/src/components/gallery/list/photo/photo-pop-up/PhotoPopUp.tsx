import React, { FC, useCallback } from 'react'
import { TAppDispatch } from "../../../../../types/store-types"
import { TPhotoPopUp } from "../../../../../types/components"
import { deleteError, errorSelector } from "../../../../../store/errorSlice"
import { useDispatch, useSelector } from "react-redux"
import { Button } from "react-bootstrap"
import './PhotoPopUp.scss'

const PhotoPopUp:FC<TPhotoPopUp> = ({onDelete, cancel}) => {
    const { isError } = useSelector(errorSelector)
    const dispatch = useDispatch<TAppDispatch>()

    const onDeletePhoto = useCallback(() => {
        if (isError) dispatch(deleteError())
        onDelete()
    }, [dispatch, onDelete, isError])

    return (
        <div className="pop_up__photo__delete animate__animated animate__fadeInDownBig animate__faster">
            <div className="pop_up__photo__text">
                    <span>Are you sure that you want to delete this photos?</span>
            </div>
            <div className="pop_up__photo__btn__group">
                <Button onClick={onDeletePhoto} variant="success">Yes</Button>
                <Button onClick={cancel}  variant="danger">No</Button>
            </div>
        </div>
    )
}

export default PhotoPopUp
