'use strict'
const mongoose = require('mongoose')
const { db: { host, port, name }} = require('../configs/config.mongodb')

// test connect
const connectString = `mongodb://${host}:${port}/${name}`

class Database {
  constructor(){
    this.connect()
  }
  // connect
  connect(type = 'mongodb') {
    // dev
    if(true){
      mongoose.set('debug', true)
      mongoose.set('debug', {color: true})
    }

    mongoose.connect(connectString)
      .then(() => console.log('Connect Mongodb Success'))
      .catch(err => console.log('Error Connect!', err))
  }

  static getInstance() {
    if(!Database.instance){
      Database.instance = new Database()
    }
    return Database.instance
  }
}

const instanceMongodb = Database.getInstance()

module.exports = instanceMongodb