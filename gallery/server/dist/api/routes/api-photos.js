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
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const path_1 = __importDefault(require("path"));
const mongoose_1 = require("mongoose");
const formatBytes_1 = require("../../services/formatBytes");
const multer = require('multer');
const config = require('config');
const jwt = require('jsonwebtoken');
const photosRouter = express_1.default.Router();
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
module.exports = photosRouter;
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
        fileSize: 1024 * 1024 * 5
    }
});
photosRouter.get('/public/uploads/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { filename } = req.params
        res.status(201).json({ image: 'images-1617944287403.jpg' });
    }
    catch (error) {
        res.status(404);
    }
}));
photosRouter.delete('/public/uploads/delete', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const _id = req.body.user._id;
        const arr = req.body;
        const fileForDelete = req.body[0].path;
        const fileId = req.body[0].id;
        console.log(fileId);
        console.log(arr);
        const updateArr = arr.filter((el) => !el.id === fileId);
        console.log(updateArr);
        yield User_1.User.findOneAndUpdate({ _id }, { photos: updateArr });
        fs.unlink(fileForDelete, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            //file removed
        });
        yield unlinkAsync(req.file.path);
        res.status(201).json({ message: 'file deleted' });
    }
    catch (error) {
        res.status(404);
    }
}));
photosRouter.post('/add/photos', upload.array('images', 10), authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files, body } = req;
        const { user } = body;
        const { _id } = user;
        if (!files.length) {
            return res.status(401).json({ message: 'Please, check file characters. Maximum size is 5 MB and format must be .png or .jpg (.jpeg).' });
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
                    id: Date.now(),
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
        const updateUser = yield User_1.User.findOne({ _id });
        res.status(201).json({ user: updateUser });
    }
    catch (error) {
        res.status(500).json({ message: 'Something was wrong.' });
    }
}));
photosRouter.get('/', authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
//
// authRouter.post('/login', async (req, res) => {
//     try {
//         const userData: IUser = req.body
//         const { email, password } = userData
//         const userList = await User.find()
//         let user
//
//         for (let i = 0; i < userList.length; i++) {
//             const userExist = await bcrypt.compare(email, userList[i].email)
//             if (userExist) {
//                 const isPasswordMatch = await bcrypt.compare(password, userList[i].password)
//                 if (isPasswordMatch) user = userList[i]
//             }
//         }
//
//         if (!user) return res.status(400).json({ message: "Incorrect email or password." })
//
//         const token = await jwt.sign(
//             { userId: user._id },
//             config.get('jwtSecret'),
//             { expiresIn: '1h' }
//         )
//
//         const responseData: TResUserData = {
//             token,
//             userId: user._id,
//             firstName: user.firstName,
//             lastName: user.lastName,
//             photos: user.photos
//         }
//
//         res.status(200).json(responseData)
//     } catch (error) {
//         res.status(500).json({ message: 'Something was wrong.' })
//     }
// })
//
// router.get('/', async (req, res: Response<TTodosArray | IResMsg>) => {
//     try {
//         let todos = await Todo.find()
//         todos = [...todos].reverse()
//         res.status(200).send(todos)
//     } catch (e) {
//         res.status(500).json({message: "Whoops! Something is wrong... Try to reload this page."})
//     }
// })
//
// router.get('/:id', async (req, res: Response<TTodosArray | IResMsg>) => {
//     try {
//         const { id: rawId } = req.params
//         const id = Number(rawId)
//         const todo = await Todo.findOne({ id })
//         if (!todo) {
//             return res.status(404).json({message: "Sorry, but we can't find this todo. Please check the number of id and try again."})
//         }
//         res.status(200).send([todo])
//     } catch (e) {
//         res.status(500).json({message: "Oops! Something is wrong! Please try again."})
//     }
// })
//
// router.get('/active', async (req, res: Response<TTodosArray | IResMsg>) => {
//     try {
//         const todos = await Todo.find({ completed: false })
//         res.status(200).send(todos)
//     } catch (e) {
//         res.status(500).json({message: "Whoops! Something is wrong... Try to reload this page."})
//     }
// })
//
// router.get('/completed', async (req, res: Response<TTodosArray | IResMsg>) => {
//     try {
//         const todos = await Todo.find({ completed: true })
//         res.status(200).send(todos)
//     } catch (e) {
//         res.status(500).json( {message: "Whoops! Something is wrong... Try to reload this page."}  )
//     }
// })
//
//
// router.post('/add', async (req, res: Response<ITodo | IResMsg>) => {
//     try {
//         const todo: ITodo = req.body
//         const { id } = todo
//         const isExist = await Todo.findOne({ id })
//         if (isExist) {
//             return res.status(400).send()
//         }
//         const newTodo = new Todo(todo)
//         await newTodo.save()
//         res.status(201).send(newTodo)
//     } catch (e) {
//         res.status(500).json({ message: "Something happened when you were adding todo. Please try again." })
//     }
// })
//
//
// router.put('/edit/text', async (req, res:Response<IResMsg>) => {
//     try {
//         const todo: ITodo = req.body
//         const { id, text, isEdit } = todo
//
//         await Todo.findOneAndUpdate({ id }, { ...todo, text, isEdit: !isEdit })
//         res.status(204).send()
//     } catch (e) {
//         res.status(500).json({ message: "Sorry, but something happened when you were trying to edit the text. Please try again." })
//     }
// })
//
// router.put('/edit/toggle', async (req, res: Response<IResMsg>) => {
//     try {
//         const { todo, _id }: IBodyTodoAndId = req.body
//         const { id, completed } = todo
//         const updatedTodo = await Todo.findOneAndUpdate({ id }, { ...todo, completed: !completed })
//         if (updatedTodo) {
//             io.emit('toggle todo', { todo: updatedTodo, _id })
//         } else {
//             res.status(500).json({ message: "Sorry, you can't toggling this todo because another user is updating this todo now." })
//         }
//         res.status(204).send()
//     } catch (e) {
//         res.status(500).json({ message: "Oh noo! Something happened when you were trying to toggle todo. Please try again." })
//     }
// })
//
// router.put('/edit/toggle/all', async (req, res: Response<IResMsg>) => {
//     try {
//         const { todos, _id }: IBodyTodosAndId = req.body
//
//         const completed = todos.every(todo => todo.completed)
//
//         todos.forEach(todo => todo.completed = !completed)
//
//         for (let i = 0; i < todos.length; i++) {
//             const { id } = todos[i]
//             await Todo.findOneAndUpdate({ id }, { ...todos[i] })
//         }
//         io.emit('toggle todos', ({ _id }))
//         res.status(204).send()
//     } catch (e) {
//         res.status(500).json({ message: "Oops! Something happened when you were trying to toggle all todos. Please try again." })
//     }
// })
//
// router.delete('/delete/completed', async (req, res: Response<IResMsg>) => {
//     try {
//         const { todos, _id }: IBodyTodosAndId = req.body
//
//         for (let i = 0; i < todos.length; i++) {
//             const todo = todos[i]
//             const { id } = todo
//
//             if (todo.completed) await Todo.deleteOne({ id })
//         }
//         io.emit('delete completed', ({ _id }))
//         res.status(204).send()
//     } catch (e) {
//         res.status(500).json({ message: "Whoops! Something happened when you were trying to delete completed todos. Please try again." })
//     }
// })
//
// router.delete('/delete', async (req, res: Response<IResMsg>) => {
//     try {
//         const { todo, _id }: IBodyTodoAndId = req.body
//         const { id } = todo
//
//         await Todo.deleteOne({ id })
//
//         io.emit('remove todo', { todo, _id })
//         res.status(204).send()
//     } catch (e) {
//         res.status(500).json({ message: "Sorry, but something happened when you were trying to delete this todo. Try again, please." })
//     }
// })
//# sourceMappingURL=api-photos.js.map