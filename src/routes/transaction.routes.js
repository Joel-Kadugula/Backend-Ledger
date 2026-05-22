const express = require("express")
const authMiddleware = require('../middlewares/auth.middleware')
const transactionController = require('../controllers/transaction.controller')

const router = express.Router()

/**
* - POST /api/transactions
* - Create a new transaction
 */

router.post('/', authMiddleware.authMiddleware, transactionController.createTransaction)

/**
* - POST /api/transactions/system/initial-funds
* - Create initial funds transaction from system user 
 */

router.post('/system/initial-funds', authMiddleware.authSystemUserMiddleware, transactionController.createInitialFundsTransaction)

module.exports = router