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
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const User_1 = require("../../models/User");
const validation_1 = require("../../services/validation");
const config = require('config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
exports.authRouter = express_1.default.Router();
exports.authRouter.post('/register', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = req.body;
        const { email, password, firstName, lastName } = user;
        const userList = yield User_1.User.find();
        if (!validation_1.isRegDataValid(email, password, firstName, lastName)) {
            return res.status(400).json({ message: 'Please, check your registration data.' });
        }
        const hashEmail = yield bcrypt.hash(email, 12);
        const hashPassword = yield bcrypt.hash(password, 12);
        for (let i = 0; i < userList.length; i++) {
            if (yield bcrypt.compare(email, userList[i].email)) {
                return res.status(400).json({ message: 'This user already exist.' });
            }
        }
        const userWithHashData = Object.assign(Object.assign({}, user), { email: hashEmail, password: hashPassword });
        const newUser = new User_1.User(userWithHashData);
        yield newUser.save();
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Something was wrong.' });
    }
}));
exports.authRouter.post('/login', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        const { email, password } = userData;
        const userList = yield User_1.User.find();
        let user;
        for (let i = 0; i < userList.length; i++) {
            if (yield bcrypt.compare(email, userList[i].email)) {
                if (yield bcrypt.compare(password, userList[i].password))
                    user = userList[i];
            }
        }
        if (!user)
            return res.status(400).json({ message: "Incorrect email or password." });
        const token = yield jwt.sign({ userId: user._id }, config.get('jwtSecret'));
        const responseData = {
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            photos: user.photos,
            albums: user.albums
        };
        res.status(200).json(responseData);
    }
    catch (error) {
        res.status(500).json({ message: 'Something was wrong.' });
    }
}));
//# sourceMappingURL=api-auth.js.map