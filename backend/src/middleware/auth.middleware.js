const jwt = require('jsonwebtoken')

const authMiddleware = async (req, res, next) => {
  // step 1: read token from Authorization header
  // step 2: if no token, throw error
  // step 3: verify token
  // step 4: attach decoded userId to req.user
  // step 5: call next()
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1] 
  if(!token){
    const error = new Error("Unauthorized access");
    error.status = 401;
    throw error;
  }
  const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  req.user = { userId: decoded.userId }
  next(); 
}

module.exports = authMiddleware
