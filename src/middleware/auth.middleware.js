import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const protectRoute = async (req, res, next) => {
    try {
        const token = req.header('Authorization').split(' ')[1]
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized, Access Denied !!' })
        }
        // verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        // find user
        const user = await User.findById(decoded.userId).select('-password')
        if(!user) {
            return res.status(404).json({ message: 'Token is not valid !' })
        }
        req.user = user
        next()
    } catch (error) {
        console.error('Authentication error: ', error.message)
        return res.status(401).json({ message: 'Authentication failed' })
    }
}

export default protectRoute