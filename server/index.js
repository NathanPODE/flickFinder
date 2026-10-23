import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import authRouter from './routes/auth.js'
import cookieParser from 'cookie-parser'
import pool from './db/pool.js'
import { getMovieSuggestions } from './services/gemini.js'

dotenv.config()

const app = express()

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))

app.use(express.json())
app.use(cookieParser())

app.use('/api/auth', authRouter)

app.get('/', (req, res) => {
    res.status(200).json({ message: 'Working'})
})

app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()')
        res.json({ status: 'ok', dbTime: result.rows[0].now });
    } catch (err) {
        console.error(err)
        res.status(500).json({ status: 'error', messgae: 'Could not reach database'})
    }
})

app.get('/api/test-gemini', async (req, res) => {
  try {
    const suggestions = await getMovieSuggestions('Romantic Comedies')
    res.json(suggestions)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not reach Gemini' })
  }
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
