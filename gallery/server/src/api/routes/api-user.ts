import express from 'express'
import { TPhotosBuffer, TAlbum, TImage } from "../../types/photo"
import { formatBytes } from "../../services/formatBytes"
import { IUser } from "../../types/user"
import { User } from '../../models/User'
import { Error } from "mongoose"
import path from 'path'

const multer = require('multer')
const config = require('config')
const jwt = require('jsonwebtoken')
const fs = require('fs')

export const photosRouter = express.Router()

const storage = multer.diskStorage({
    destination: (req: Request, file: Blob, cb: Function) => {
        cb(null, './public/uploads')
    },
    filename: (req: Request, file: any, cb: Function) => {
        const ext = [".jpeg", ".jpg", ".png", ".bmp"]
        const extExist = ext.find((item) => file.originalname.endsWith(item))

        !!extExist
            ? cb(null, file.fieldname + '-' + Date.now() + extExist)
            : cb(new Error('The file does not match the file extension: ".jpeg", ".jpg", ".png", ".bmp"'))
    },
})

const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    }
})

photosRouter.delete('/delete/photos', authenticateToken, async (req, res) => {
    try {
        const { _id, photos } = req.body.user
        const arr = req.body.photosBuffer
        const updatePhotosList = photos.filter((photo: any) => {
            const photoForDelete = arr.some((el: any) => el.id === photo.id)
            if (photoForDelete) {
                fs.unlink(photo.path, (err: any) => {
                    if (err) {
                        return res.status(500).json({ message: `${photo.name} doesn't exist on the server.` })
                    }
                })
            }
            return !photoForDelete
        })

        await User.findOneAndUpdate({ _id }, { photos: updatePhotosList })
        res.status(201).json({ message: 'File deleted' })
    } catch (error) {
        res.status(404)
    }
})


photosRouter.post('/add/photos', upload.array('images', 10), authenticateToken, async (req, res) => {
    try {
        const { files, body }: any = req
        const { user } = body
        const { _id } = user

        if (!files.length) {
            return res.status(401).json({
                message: 'Please, check file characters. Maximum size is 5 MB and format must be .png or .jpg (.jpeg).'
            })
        }
        const arrOfPhotos: TImage[] = user.photos

        for (let key in files) {
            if (files.hasOwnProperty(key)) {
                const { filename: name, size, path: filepath } = files[key]

                const date = new Date()
                const day = date.getDate()
                const month = date.getMonth() + 1
                const year = date.getFullYear()

                const newImage: TImage = {
                    name,
                    id: Date.now() + Math.floor(Math.random() * 10 ** 10),
                    format: path.extname(name).replace('.', ''),
                    size: formatBytes(size),
                    path: filepath,
                    inAlbum: '',
                    date: `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`
                }
                arrOfPhotos.push(newImage)
            }
        }

        await User.findOneAndUpdate({ _id }, { photos: arrOfPhotos })
        //For to be sure that user updated in the database
        const updateUser = await User.findOne({ _id })

        res.status(201).json({ user: updateUser })
    } catch (error) {
        res.status(500).json({ message: 'Something was wrong.' })
    }
})

photosRouter.post('/add/album', authenticateToken, async (req, res) => {
    try {
        const { _id, photos, albums }: IUser = req.body.user
        const { photosBuffer, albumName }: { photosBuffer: TPhotosBuffer[], albumName: string } = req.body

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

        const albumList = [...albums, newAlbum]

        await User.findOneAndUpdate({ _id }, { albums: albumList, photos: newPhotosList })
        //For to be sure that user updated in the database
        const updateUser = await User.findOne({ _id })
        res.status(201).json({ user: updateUser })
    } catch (error) {
        res.status(500).json({ message: 'Something was wrong.' })
    }
})

photosRouter.delete('/delete/album', authenticateToken, async (req, res) => {
    try {
        const { _id, albums }: IUser = req.body.user
        const { albumName }: { albumName: string } = req.body

        const updateAlbums = albums.filter(album => album.albumName !== albumName)

        await User.findOneAndUpdate({ _id }, { albums: updateAlbums })
        res.status(201).json({ message: 'Album deleted!' })
    } catch (error) {
        res.status(500).json({ message: 'Something was wrong. Please, try again.' })
    }
})

photosRouter.delete('/delete/album/only', authenticateToken, async (req, res) => {
    try {
        const { _id, albums, photos }: IUser = req.body.user
        const { albumName }: { albumName: string } = req.body

        let photosFromAlbum: TImage[] = []

        albums.forEach(album => {
            if (album.albumName === albumName) {
                if (album.photos.length) {
                    photosFromAlbum = [...album.photos]
                }
            }
        })

        const updatePhotos = [...photos, ...photosFromAlbum]
        const updateAlbums = albums.filter(album => album.albumName !== albumName)

        await User.findOneAndUpdate({ _id }, { photos: updatePhotos, albums: updateAlbums })
        const updateUser = await User.findOne({ _id })
        res.status(201).json({ user: updateUser })
    } catch (error) {
        res.status(500).json({ message: 'Something was wrong.' })
    }
})

photosRouter.get('/', authenticateToken, async (req, res) => {
    try {
        req.body.user ? res.status(201).json(req.body.user) :
            res.status(404).json({ message: 'Not found' })
    } catch (error) {
        res.status(500).json({ message: 'Something was wrong.' })
    }
})


function authenticateToken(req: any, res: any, next: any) {
    const authHeader = req.headers['authorization']
    const token = typeof authHeader === "string" && authHeader.split(' ')[1]
    if (!token) return res.sendStatus(401)
    jwt.verify(token, config.get('jwtSecret'), async (err: Error, user: any) => {
        if (err) return res.sendStatus(403)
        req.body.user = await User.findOne({ _id: user.userId })
        if (!req.body.user) return res.sendStatus(500).json({ message: 'Server error. Please, login again' })
        next()
    })
}