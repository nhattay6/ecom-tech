'use strict'
const { model, Schema, Types} = require('mongoose'); // Erase if already required

const DOCUMENT_NAME = 'Shop'
const COLLECTION_NAME = 'Shops'

// Declare the Schema of the Mongo model
var shopSchema = new Schema({
    name:{
        type: String,
        trim: true,
        maxLength: 150,
    },
    email:{
        type: String,
        unique:true,
        trim: true
    },
    password:{
        type: String,
        required: true,
    },
    status:{
        type: String,
        required: true,
    },
    verify:{
      type:String,
      enum: ['active', 'inactive'],
      default: 'inactive',
    },
    roles:{
      type: Array,
      default: [],
    },
}, {
  timestamps: true,
  collection: COLLECTION_NAME
});

module.exports = model(DOCUMENT_NAME, shopSchema);