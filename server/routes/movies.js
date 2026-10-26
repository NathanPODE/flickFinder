import express from 'express'
import requireAuth from '../middleware/auth.js'
import pool from '../db/pool.js'

const router = express.Router()

router.use(requireAuth)

router.post('/')