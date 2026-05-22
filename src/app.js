const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()
app.use(express.json())
app.use(cookieParser())

/**
* - Routes Requried
 */

const authRoutes = require('./routes/auth.routes')
const accountRoutes = require('./routes/account.routes')
const transactionRoutes = require('./routes/transaction.routes')

/**
* - Use Routes 
 */

app.get("/", (req, res) => {
  res.send("Ledger Service is up and running");
});

app.use('/api/auth', authRoutes)
app.use('/api/account', accountRoutes)
app.use('/api/transactions', transactionRoutes)



module.exports = app