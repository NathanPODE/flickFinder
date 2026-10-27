import express from 'express'
import requireAuth from '../middleware/auth.js'
import { getMovieSuggestions } from '../services/gemini.js'
import { searchMovie } from '../services/tmdb.js'
import suggestionsSchema from '../schemas/suggestions.js'
import pool from '../db/pool.js'

const router = express.Router()

router.use(requireAuth)

router.post('/', async (req, res) => {
    try {
        const parse = suggestionsSchema.safeParse(req.body || {})

        if (!parse.success) {
            const firstError = parse.error.issues[0]?.message || 'Invalid input'
            return res.status(400).json({ error: firstError })
        }

        const { prompt, excludeTitles = [] } = parse.data

        const watchlistResult = await pool.query(
            'SELECT title FROM user_movies WHERE user_id = $1',
            [req.userId]
        )
        
        const watchlistTitles = watchlistResult.rows.map((row) => row.title)

        const allExcluded = [...excludeTitles, ...watchlistTitles]

        const suggestions = await getMovieSuggestions(prompt, allExcluded)

        const moviePromises = suggestions.map(async (suggestion) => {
            const tmdbMovie = await searchMovie(suggestion.title)
            if (!tmdbMovie) return null
            return {
                ...tmdbMovie,
                reason: suggestion.reason
            }
        })

        const results = await Promise.all(moviePromises)
        
        const movies = results.filter(movie => movie !== null)

        if (movies.length === 0) {
            return res.status(404).json({ error: 'No movies found' })
        }

        return res.status(200).json({ movies })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

export default router