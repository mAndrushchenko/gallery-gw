import express from 'express'
import { User } from '../../models/User'
import { IUser, TResUserData } from "../../types/user"
import { isRegDataValid } from "../../services/validation"

const config = require('config')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

export const authRouter = express.Router()

authRouter.post('/register', async (req, res) => {
    try {
        const user: IUser = req.body
        const { email, password, firstName, lastName } = user
        const userList = await User.find()

        if (!isRegDataValid(email, password, firstName, lastName)) {
            return res.status(400).json({ message: 'Please, check your registration data.' })
        }

        const hashEmail: string = await bcrypt.hash(email, 12)
        const hashPassword: string = await bcrypt.hash(password, 12)

        for (let i = 0; i < userList.length; i++) {
            if (await bcrypt.compare(email, userList[i].email)) {
                return res.status(400).json({ message: 'This user already exist.' })
            }
        }

        const userWithHashData = { ...user, email: hashEmail, password: hashPassword }
        const newUser = new User(userWithHashData)
        await newUser.save()
        res.status(204).send()
    } catch (error) {
        res.status(500).json({ message: 'Something was wrong.' })
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const userData: IUser = req.body
        const { email, password } = userData
        const userList = await User.find()
        let user

        for (let i = 0; i < userList.length; i++) {
            if (await bcrypt.compare(email, userList[i].email)) {
                if  (await bcrypt.compare(password, userList[i].password)) user = userList[i]
            }
        }

        if (!user) return res.status(400).json({ message: "Incorrect email or password." })

        const token = await jwt.sign(
            { userId: user._id },
            config.get('jwtSecret')
        )

        const responseData: TResUserData = {
            token,
            firstName: user.firstName,
            lastName: user.lastName,
            photos: user.photos,
            albums: user.albums
        }

        res.status(200).json(responseData)
    } catch (error) {
        res.status(500).json({ message: 'Something was wrong.' })
    }
})
