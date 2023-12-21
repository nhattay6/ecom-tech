'use strict'
const mongoose = require('mongoose')

// test connect
const connectString = `mongodb://localhost:27017/ecom_tech`
mongoose.connect(connectString)
  .then(() => console.log('Connect Mongodb Success'))
  .catch(err => console.log('Error Connect!', err))

// dev
if(1 === 1){
  mongoose.set('debug', true)
  mongoose.set('debug', {color: true})
}

module.exports = mongoose