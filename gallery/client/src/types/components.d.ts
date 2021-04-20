import { TImage } from "./photo"

export interface IPhoto {
    key: number
    photoName: string
    size: string
    date: string
    id: number
    onOpenSlider: (action: boolean) => void
    albumList: (action: boolean) => void
}

export interface IAlbum {
    key: string
    albumName: string
    photos: TImage[]
    onOpenSlider: (action: boolean) => void
    albumList: (action: boolean) => void
}

export interface IAlbumCreator {
    onCloseAlbumCreator: () => void
}

export interface ISlider {
    closeSlider: (action: boolean) => void
    album: boolean
}

export interface ISliderPreviewItem {
    active: boolean
    key: number
    index: number
    selectImage: (index: number) => void
    photo: TImage
}

export interface IAlbumPopUp {
    albumName: string
    cancelDel: () => void
}

export interface TPhotoPopUp {
    onDelete: () => void
    cancel: () => void
}