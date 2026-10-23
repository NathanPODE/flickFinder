import express from 'express'
import requireAuth from '../middleware/auth.js'
import { getMovieSuggestions } from '../services/gemini.js'
import { searchMovie } from '../services/tmdb.js'
import pool from '../db/pool.js'

const router = express.Router()

router.use(requireAuth)

router.post('/', async (req, res) => {
    try {
        const { prompt, excludeTitles } = req.body || {}

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' })
        }

        const suggestions = await getMovieSuggestions(prompt, excludedTitles)
        const movies = []

        for(const suggestion of suggestions){
            const tmdbMovie = await searchMovie(suggestion.title)

            if (tmdbMovie) {
                movies.push({
                    ...tmdbMovie,
                    reason: suggestion.reason // Attach Gemini's reason to the TMDB data!
                })
            }
        }

        if(movies.length === 0){
            return res.status(404).json({ error: 'No movies found' });
        }

        return res.status(200).json({ movies })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})