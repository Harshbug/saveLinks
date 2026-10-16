const jwt = require('jsonwebtoken')

const jwtUtils = {
  generateAccessToken: (userId) => {
    // creates a token with userId inside 
    // signed with JWT_ACCESS_SECRET
    // expires in 15 minutes
   return jwt.sign(
      { userId },                          // payload - what's inside the token
      process.env.JWT_ACCESS_SECRET,       // secret - used to sign it
      { expiresIn: '15m' }                 // options - when it expires
    )
  },

  generateRefreshToken: (userId) => {
    // creates a token with { userId } inside  
    // signed with JWT_REFRESH_SECRET
    // expires in 7 days
    return jwt.sign(
      { userId },                          // payload - what's inside the token
      process.env.JWT_REFRESH_SECRET,       // secret - used to sign it
      { expiresIn: '7d' }                 // options - when it expires
    )
  }
}

module.exports = jwtUtils