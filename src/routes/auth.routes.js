const express = require('express')
const authControllers = require("../controllers/auth.controller")


const router = express.Router()

/* POST /api/auth/register */
router.post('/register', authControllers.userRegisterController)

/* POST /api/auth/login */
router.post('/login', authControllers.userLoginController)

/**
* - POST /api/auth/logout 
 */
router.post('/logout', authControllers.userLogoutController)

module.exports = router