import express from 'express'
import bcrypt from 'bcrypt'
import pool from '../db/pool.js'
import jwt from 'jsonwebtoken'
import registerSchema from '../schemas/auth.js'
import { z } from 'zod'

const router = express.Router();

const SALT_ROUNDS = 10

router.post('/register', async (req, res) => {
    try{
        const { email, password } = req.body || {}

        const parse = registerSchema.safeParse({ email, password })

        if(!parse.success){
            const firstError = parse.error.issues[0]?.message || 'Invalid input';
            return res.status(400).json({ error: firstError });
        }

        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

        const result = await pool.query(
            `INSERT INTO users (email, hashed_password)
             VALUES ($1, $2)
             RETURNING id, email, created_at`,
             [email, passwordHash]
        )

        res.status(201).json({ user: result.rows[0] })
    } catch (err) {
        if(err.code === '23505'){
            return res.status(409).json({ error: 'An account with that email already exists' })
        }

        console.error(err)
        res.status(500).json({ error: 'Something went wrong'})
    }
})

export default router