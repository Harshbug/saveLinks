const bcrypt = require('bcryptjs')
const userRepository = require('../repositories/user.repository.js')
const jwtUtils = require('../utils/jwt.utils.js');

const jwt = require('jsonwebtoken')
const redis = require('../config/redis.js')

const authService = {
    register: async ({ username, email, password }) => {
        // step 1: check if email already exists
        const existingUser = await userRepository.findByEmail(email)
        if (existingUser) {
            throw new Error('Email already in use')
        }

        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10)

        //create the user
        const user = await userRepository.create({
            username,
            email,
            password: hashedPassword
        })

        //return user without password
        const { password: _, ...userWithoutPassword } = user.toObject()
        return userWithoutPassword
    },
    login: async ({ username, email, password }) => {
        // Find user by email → if not found, throw error
        const existingUser = await userRepository.findByEmail(email)
        if (!existingUser) {
            throw new Error('Email doesnot exists');
        }



        //now we need to compare password 
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch) {
            throw new Error('jyo password is wrong');
        }
        const { password: _, ...userWithoutPassword } = existingUser.toObject()
        const accessToken = jwtUtils.generateAccessToken(existingUser._id)
        const refreshToken = jwtUtils.generateRefreshToken(existingUser._id)
        await redis.set(
            `refresh:${existingUser._id}`,    // key
            refreshToken,                    // value
            'EX',                           // expiry mode
            60 * 60 * 24 * 7               // 7 days in seconds
        )
        return { user: userWithoutPassword, accessToken, refreshToken }
    },
    //Deleting refresh-token    
    logout: async (userId) => {
        await redis.del(`refresh:${userId}`)
    },
    refresh: async (refreshToken) => {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const userId = decoded.userId
        const redisToken = await redis.get(`refresh:${userId}`)
        if (!redisToken) {
            const error = new Error('Invalid refresh token')
            error.status = 401
            throw error
        }
        const newToken = jwtUtils.generateAccessToken(userId);
        return { accessToken: newToken }
    }


}


module.exports = authService