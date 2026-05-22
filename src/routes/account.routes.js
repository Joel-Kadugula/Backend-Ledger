const express = require('express')
const accountController = require('../controllers/account.controller')
const authMiddlewares = require('../middlewares/auth.middleware')


const router = express.Router()


/**
* - POST /api/account 
* - Create a new account
* - Protected route
 */

router.post('/', authMiddlewares.authMiddleware, accountController.createAccountController )

/**
* - GET /api/account 
* - Get all accounts of the logged-in user
* - Protected route
 */

router.get('/', authMiddlewares.authMiddleware, accountController.getUserAccountsController)

/**
* - GET /api/account/balance/:accountId 
* - Get balance 
* - Protected route
 */

router.get('/balance/:accountId', authMiddlewares.authMiddleware, accountController.getAccountBalanceController)

module.exports = router