const express = require('express')
const authController = require('../controllers/auth.controller.js')
const authMiddleware = require('../middleware/auth.middleware.js')
const { validateRegister } = require('../middleware/validate.js')

const router = express.Router()
router.post('/register', validateRegister, authController.register)
router.post('/login', authController.login)

router.post('/logout', authMiddleware, authController.logout);
router.post('/refresh',authController.refresh);

module.exports = router