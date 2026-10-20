import jwt from 'jsonwebtoken';

function requireAuth(req, res, next){
    const token = req.cookies.token

    if(!token){
        return res.status(401).json({ error: 'No token found'})
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (err) {
        console.error(err)
        res.status(401).json({ error: 'Invalid or expired token'})
    }
}

export default requireAuth