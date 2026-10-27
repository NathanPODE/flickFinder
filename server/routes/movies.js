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

router.get('/', async (req, res) => {
    try {

        if (req.query.watched !== 'true' && req.query.watched !== 'false') {
            return res.status(400).json({ error: 'watched query parameter must be "true" or "false"' })
        }

        const watched = req.query.watched === 'true'

        const result = await pool.query(
            `SELECT id, tmdb_id, title, poster_path, synopsis, watched, created_at
             FROM user_movies 
             WHERE user_id = $1 AND watched = $2`,
            [req.userId, watched]
        )

        res.json({ movies: result.rows })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)

        if(!Number.isInteger(id)){
            return res.status(400).json({ error: 'Invalid movie id'})
        }

        const result = await pool.query(
            `UPDATE user_movies SET watched = NOT watched WHERE id = $1 and user_id = $2 RETURNING id, title, watched`,
            [id, req.userId]
        )

        const movie = result.rows[0]

        if(!movie){
            return res.status(404).json({ error: 'Movie not found' });
        }

        res.json({ movie })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ error: 'Something went wrong' })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = Number(req.params.id)
        
        if(!Number.isInteger(id)){
            return res.status(400).json({ error: 'Invalid movie id'})
        }

        const result = await pool.query(
            `DELETE FROM user_movies WHERE id = $1 AND user_id = $2 RETURNING id`,
            [id, req.userId]
        )

        if(result.rows.length === 0){
            return res.status(404).json({ error: 'Movie not found'})
        }

        res.status(204).end()
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

export default router