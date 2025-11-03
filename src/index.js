import express from 'express'
import 'dotenv/config'
import authRouter from './routes/authRoutes.route.js'
import connectDB from './lib/db.js'
import cors from 'cors'
import bookRouter from './routes/bookRoutes.route.js'
import job from "./lib/cron.js";

const app = express()
const PORT = process.env.PORT

job.start();
app.use(express.json())
app.use(cors())
app.use('/api/auth',authRouter)
app.use('/api/books', bookRouter)

app.get('/', async (req,res) => {
    res.send('BOOKWORM SERVER IS RUNNING!!')
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}!`)
    connectDB()
})
