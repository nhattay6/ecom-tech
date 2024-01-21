'user strict'

const { model, Schema, Types } = require('mongoose')

const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
  product_name: {
    type: String,
    required: true
  },
  product_thumb: {
    type: String,
    required: true
  },
  product_description: String,
  product_price: {
    type: Number,
    required: true
  },
  product_quantity: {
    type: Number,
    required: true
  },
  product_type: {
    type: String,
    required: true,
    enum: ['Electronics', 'Clothing', 'Furniture']
  },
  product_shop: String,
  product_attributes: {
    type: Schema.Types.Mixed,
    required: true
  },
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, productSchema)

const clothingSchema = new Schema({
  brand: { type: String, required: true },
  size: String,
  material: String
}, {
  collection: 'clothes',
  timestamps: true
})

const electronicSchema = new Schema({
  brand: { type: String, required: true },
  size: String,
  material: String
}, {
  collection: 'electronics',
  timestamps: true
})

module.exports = {
  product: model(DOCUMENT_NAME, productSchema),
  clothing: model(DOCUMENT_NAME, clothingSchema),
  electronic: model(DOCUMENT_NAME, electronicSchema),
}


