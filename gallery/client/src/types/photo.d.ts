export type TAlbum = {
    albumName: string
    photos: TImage[]
}

export type TImage = {
    id: number
    name: string
    size: string
    format: string
    path: string
    inAlbum: string
    date: string
}