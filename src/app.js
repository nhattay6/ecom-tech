const morgan = require('morgan')
const { default: helmet } = require('helmet')
const compression = require('compression')
require('dotenv').config()
const express = require('express')

const app = express()

// init middlewares
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}))

// init db
require('./dbs/init.mongodb')

// init routes
app.use('/', require('./routes'))

// handling error

module.exports = app