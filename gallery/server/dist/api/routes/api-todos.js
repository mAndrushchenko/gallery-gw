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
// import { IBodyTodoAndId, IBodyTodosAndId, ITodo, TTodosArray, IResMsg } from "../../types/server-types"
const User_1 = require("../../models/User");
// import { io } from '../index'
const router = express_1.default.Router();
module.exports = router;
// router.post('/login', (req, res) => {
//     try {
//         console.log(req.body)
//         res.status(200).send()
//     } catch (err) {
//         console.log(err)
//         res.status(400).send()
//     }
//
// })
router.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const newUser = new User_1.User(user);
        yield newUser.save();
        res.status(201).send();
    }
    catch (e) {
        res.status(500).json({ message: "Something happened when you were adding todo. Please try again." });
    }
}));
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
//# sourceMappingURL=api-todos.js.map