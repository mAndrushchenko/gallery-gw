import React, { useCallback, useState } from 'react'
import FirstLoadMenu from "../first-load-menu/FirstLoadMenu"
import AlbumSlider from "./album/album-slider/AlbumSlider"
import { userSelector } from "../../../store/userSlice"
import { useSelector } from "react-redux"
import Album from "./album/Album"
import Photo from "./photo/Photo"
import './List.scss'

const List = () => {
    const { photos, albums } = useSelector(userSelector)
    const [sliderActive, setSliderActive] = useState(false)
    const [isAlbum, setIsAlbum] = useState(false)

    const showSlider = useCallback((action: boolean) => {
        setSliderActive(action)
    }, [setSliderActive])

    const sliderConfiguration = useCallback((action:boolean) => {
        setIsAlbum(action)
    }, [setIsAlbum])
    return (
        <>
            {(!photos.length && !albums.length) ? <FirstLoadMenu/> :
                <div className="list__container">
                    <div className="list animate__animated animate__zoomIn ">
                        {!!albums.length && albums.map(album => {
                            return <Album
                                key={album.albumName}
                                albumName={album.albumName}
                                photos={album.photos}
                                onOpenSlider={showSlider}
                                albumList={sliderConfiguration}
                            />
                        })}
                        {!!photos.length && photos.map(photo => {
                            return <Photo
                                key={photo.id}
                                size={photo.size}
                                albumList={sliderConfiguration}
                                onOpenSlider={showSlider}
                                photoName={photo.name}
                                date={photo.date}
                                id={photo.id}
                            />
                        })}
                    </div>
                    <div className="list__footer"/>
                    {sliderActive && <AlbumSlider
                        album={isAlbum}
                        closeSlider={showSlider}
                    />}
                </div>}
        </>
    )
}

export default List