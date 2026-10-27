import express from 'express'
import requireAuth from '../middleware/auth.js'
import pool from '../db/pool.js'
import moviePostSchema from '../schemas/movies.js';

const router = express.Router()

router.use(requireAuth)

router.post('/', async (req, res) => {
    try {
        

        const parse = moviePostSchema.safeParse( req.body || {} )

        if(!parse.success){
            const firstError = parse.error.issues[0]?.message || 'Invalid input';
            return res.status(400).json({ error: firstError });
        }

        const { movie } = parse.data

         
        const result = await pool.query(
            `INSERT INTO user_movies (tmdb_id, user_id, title, poster_path, synopsis)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, tmdb_id, title, poster_path, synopsis, watched, created_at`,
             [movie.id, req.userId, movie.title, movie.poster_path, movie.overview]
        )

        res.status(201).json({ movie: result.rows[0] })
    } catch (err) {
        if(err.code = '23505'){
            return res.status(404).json({ error: 'Movie is already added'})
        }
        console.error(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

export default router