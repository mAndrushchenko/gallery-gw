import React, { FC, useCallback } from 'react'
import { ISliderPreviewItem } from "../../../../../../types/components"
import './SliderPreview.scss'

const SliderPreview: FC<ISliderPreviewItem> = ({ photo, selectImage, index, active }) => {
    const selectImageByIndex = useCallback(() => {
        selectImage(index)
    }, [selectImage, index])

    return (
        <div onClick={selectImageByIndex}
             className={`slider__preview__image ${active ? 'slider__preview__image__active' : ''}`}>
            <img src={`/uploads/${photo.name}`} alt="" draggable={false}/>
        </div>
    )
}

export default SliderPreview