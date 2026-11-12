import jwt from 'jsonwebtoken'
import { COOKIE_OPTIONS } from '../config/cookies.js'

const ONE_HOUR_MS = 60 * 60 * 1000

export function issueSession(res, userId) {
    const token = jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    )

    res.cookie('token', token, { ...COOKIE_OPTIONS, maxAge: ONE_HOUR_MS })
}