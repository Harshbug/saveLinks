const { z } = require('zod')

const registerSchema = z.object({
  username: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6)
})
/*
Reads refreshToken from req.body
Calls authService.refresh(refreshToken)
Returns the result with status 200
*/
const validateRegister = (req, res, next) => {
  registerSchema.parse(req.body)
  next()
}

module.exports = { validateRegister }