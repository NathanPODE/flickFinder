import express from 'express'
import bcrypt from 'bcrypt'
import pool from '../db/pool.js'
import requireAuth from '../middleware/auth.js'
import { changeEmailSchema } from '../schemas/auth.js'

const router = express.Router()

router.use(requireAuth)

router.patch('/email', async (req, res) => {
    try{
        const parse = changeEmailSchema.safeParse(req.body || {});

        if(!parse.success){
            const firstError = parse.error.issues[0]?.message || 'Invalid input';
            return res.status(400).json({ error: firstError });
        }

        const { newEmail, password } = parse.data;

        const lookup = await pool.query(
            `SELECT hashed_password FROM users WHERE id = $1`,
            [req.userId]
        )

        const user = lookup.rows[0]

        if (!user) {
            return res.status(404).json({ error: 'User not found' })
        }

        const passwordMatches = await bcrypt.compare(password, user.hashed_password)

        if(!passwordMatches){
            return res.status(403).json({ error: 'Incorrect password' })
        }

        const result = await pool.query(
            `UPDATE users SET email = $1 WHERE id = $2 RETURNING id, email`,
            [newEmail, req.userId]
        )

        res.json({ user: result.rows[0] })
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'That email is already in use' })
        }
        console.error(err)
        res.status(500).json({ error: 'Something went wrong' })
    }
})

export default router