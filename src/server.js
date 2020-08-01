'use strict'

// imports
import express from 'express'
import cors from 'cors'
const app = express()

// vars
const PORT = process.env.PORT

// import files
const routes = require('./routes')

app.disable('x-powered-by')
app.use(express.json())
app.use(cors())

// routes
app.use(routes)

// server initialization
app.listen(PORT, function () {
  console.log(`Server is running on PORT:${PORT}`)
})
