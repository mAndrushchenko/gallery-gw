"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.photosRouter = void 0;
const express_1 = __importDefault(require("express"));
const formatBytes_1 = require("../../services/formatBytes");
const User_1 = require("../../models/User");
const mongoose_1 = require("mongoose");
const path_1 = __importDefault(require("path"));
const multer = require('multer');
const config = require('config');
const jwt = require('jsonwebtoken');
const fs = require('fs');
exports.photosRouter = express_1.default.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/uploads');
    },
    filename: (req, file, cb) => {
        const ext = [".jpeg", ".jpg", ".png", ".bmp"];
        const extExist = ext.find((item) => file.originalname.endsWith(item));
        !!extExist
            ? cb(null, file.fieldname + '-' + Date.now() + extExist)
            : cb(new mongoose_1.Error('The file does not match the file extension: ".jpeg", ".jpg", ".png", ".bmp"'));
    },
});
const upload = multer({
    storage,
    limits: {
        fileSize: 1024 * 1024 * 3
    }
});
exports.photosRouter.delete('/delete/photos', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, photos } = req.body.user;
        const arr = req.body.photosBuffer;
        const updatePhotosList = photos.filter((photo) => {
            const photoForDelete = arr.some((el) => el.id === photo.id);
            if (photoForDelete) {
                fs.unlink(photo.path, (err) => {
                    if (err) {
                        return res.status(500).json({ message: `${photo.name} doesn't exist on the server.` });
                    }
                });
            }
            return !photoForDelete;
        });
        yield User_1.User.findOneAndUpdate({ _id }, { photos: updatePhotosList });
        res.status(201).json({ message: 'File deleted' });
    }
    catch (error) {
        res.status(404);
    }
}));
exports.photosRouter.post('/add/photos', upload.array('images', 10), authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files, body } = req;
        const { user } = body;
        const { _id } = user;
        if (!files.length) {
            return res.status(401).json({
                message: 'Please, check file characters. Maximum size is 5 MB and format must be .png or .jpg (.jpeg).'
            });
        }
        const arrOfPhotos = user.photos;
        for (let key in files) {
            if (files.hasOwnProperty(key)) {
                const { filename: name, size, path: filepath } = files[key];
                const date = new Date();
                const day = date.getDate();
                const month = date.getMonth() + 1;
                const year = date.getFullYear();
                const newImage = {
                    name,
                    id: Date.now() + Math.floor(Math.random() * Math.pow(10, 10)),
                    format: path_1.default.extname(name).replace('.', ''),
                    size: formatBytes_1.formatBytes(size),
                    path: filepath,
                    inAlbum: '',
                    date: `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${year}`
                };
                arrOfPhotos.push(newImage);
            }
        }
        yield User_1.User.findOneAndUpdate({ _id }, { photos: arrOfPhotos });
        //For to be sure that user updated in the database
        const updateUser = yield User_1.User.findOne({ _id });
        res.status(201).json({ user: updateUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Something was wrong.' });
    }
}));
exports.photosRouter.post('/add/album', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, photos, albums } = req.body.user;
        const { photosBuffer, albumName } = req.body;
        const albumPhotos = [];
        const newPhotosList = [];
        photos.forEach(photo => {
            if (photosBuffer.some(el => photo.id === el.id)) {
                albumPhotos.push(photo);
            }
            else {
                newPhotosList.push(photo);
            }
        });
        const newAlbum = {
            photos: albumPhotos,
            albumName
        };
        const albumList = [...albums, newAlbum];
        yield User_1.User.findOneAndUpdate({ _id }, { albums: albumList, photos: newPhotosList });
        //For to be sure that user updated in the database
        const updateUser = yield User_1.User.findOne({ _id });
        res.status(201).json({ user: updateUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Something was wrong.' });
    }
}));
exports.photosRouter.delete('/delete/album', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, albums } = req.body.user;
        const { albumName } = req.body;
        const updateAlbums = albums.filter(album => album.albumName !== albumName);
        yield User_1.User.findOneAndUpdate({ _id }, { albums: updateAlbums });
        res.status(201).json({ message: 'Album deleted!' });
    }
    catch (error) {
        res.status(500).json({ message: 'Something was wrong. Please, try again.' });
    }
}));
exports.photosRouter.delete('/delete/album/only', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _id, albums, photos } = req.body.user;
        const { albumName } = req.body;
        let photosFromAlbum = [];
        albums.forEach(album => {
            if (album.albumName === albumName) {
                if (album.photos.length) {
                    photosFromAlbum = [...album.photos];
                }
            }
        });
        const updatePhotos = [...photos, ...photosFromAlbum];
        const updateAlbums = albums.filter(album => album.albumName !== albumName);
        yield User_1.User.findOneAndUpdate({ _id }, { photos: updatePhotos, albums: updateAlbums });
        const updateUser = yield User_1.User.findOne({ _id });
        res.status(201).json({ user: updateUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Something was wrong.' });
    }
}));
exports.photosRouter.get('/', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.user ? res.status(201).json(req.body.user) :
            res.status(404).json({ message: 'Not found' });
    }
    catch (error) {
        res.status(500).json({ message: 'Something was wrong.' });
    }
}));
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = typeof authHeader === "string" && authHeader.split(' ')[1];
    if (!token)
        return res.sendStatus(401);
    jwt.verify(token, config.get('jwtSecret'), (err, user) => __awaiter(this, void 0, void 0, function* () {
        if (err)
            return res.sendStatus(403);
        req.body.user = yield User_1.User.findOne({ _id: user.userId });
        if (!req.body.user)
            return res.sendStatus(500).json({ message: 'Server error. Please, login again' });
        next();
    }));
}
//# sourceMappingURL=api-user.js.map