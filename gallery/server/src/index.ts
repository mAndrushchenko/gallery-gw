import express, { Application, Response, Request } from 'express'
import mongoose from 'mongoose'
import config from 'config'
import cors from 'cors'
import path from 'path'
import { authRouter } from './api/routes/api-auth'
import { photosRouter } from './api/routes/api-user'

const app: Application = express()
const http = require('http').createServer(app)
const bodyParser = require('body-parser')

const PORT = config.get('port') || 8000
const uri: string = config.get('mongoUri')


app.use(express.static(path.join(__dirname, '../../', 'client/build')))

app.get('(/|/gallery|/login|/registration)', (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../','client/build', 'index.html'))
})

app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('public/uploads'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/api/auth', authRouter)
app.use('/api/user', photosRouter)

async function start () {
    try {
        await mongoose.connect(uri, {
            useCreateIndex: true,
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        },)

        http.listen(PORT, () => {
            console.log(`Server has been started on port ${PORT}...`)
        })
    } catch (e){
        console.log(e.message)
        process.exit(1)
    }
}

start()

