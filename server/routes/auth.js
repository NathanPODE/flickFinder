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
        const normalizedEmail = email.trim().toLowerCase();

        const parse = registerSchema.safeParse({ email: normalizedEmail, password })

        if(!parse.success){
            const firstError = parse.error.issues[0]?.message || 'Invalid input';
            return res.status(400).json({ error: firstError });
        }

        
        const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

        const result = await pool.query(
            `INSERT INTO users (email, hashed_password)
             VALUES ($1, $2)
             RETURNING id, email, created_at`,
             [normalizedEmail, passwordHash]
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

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};

          if(typeof email !== 'string' || typeof password !== 'string'){
            return res.status(400).json({ error: 'Email and password are required'});
        }

        const normalizedEmail = email.trim().toLowerCase();

        const result = await pool.query(
            `SELECT id, email, hashed_password FROM users WHERE email=$1`,
            [normalizedEmail]
        )

        const user = result.rows[0];
        if(!user){
            return res.status(401).json({ error: 'Invalid email or password'})
        }

        const passwordMatches = await bcrypt.compare(password, user.hashed_password)
        
        if(!passwordMatches){
            return res.status(401).json({ error: 'Invalid email or password'})
        }
        
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            {expiresIn: '1h'}
        )

        res.cookie('token', token, {
        httpOnly: true,                 
        sameSite: 'lax', 
        secure: false,            
        maxAge: 3600000               
        });

        res.json({ user: { id: user.id, email: user.email}})
     } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Something went wrong'})
     }

})

export default router