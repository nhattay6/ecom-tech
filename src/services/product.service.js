'use strict'

const { product, clothing, electronic } = require('../models/product.model')

class ProductFactory {
  static async createProduct(type, payload){
    switch (type){
      case 'Electronics':
        return new Electronics(payload).createProduct()
      case 'Clothing':
        return new Electronics(payload).createProduct()
      default: 
        throw new BadRequestError(`Invalid Product Types ${type}`)
    }
  }
}

class Product {
  constructor({
    product_name, product_thumb, product_description, product_price,
    product_type, product_shop, product_attributes, product_quantity
  }){
    this.product_name = product_name
    this.product_thumb = product_thumb
    this.product_description = product_description
    this.product_price = product_price
    this.product_type = product_type
    this.product_shop = product_shop
    this.product_attributes = product_attributes
    this.product_attributes = product_quantity
  }

  async createProduct(){
    return await product.create(this)
  }
}

class Clothing extends Product {
  async createProduct(){
    const newClothing = await clothing.create(this.product_attributes)
    if(!newClothing) throw new BadRequestError('create new Clothing error')

    const newProduct = await super.createProduct()
    if(!newProduct) throw new BadRequestError('create new Product error')

    return newProduct
  }
}

class Electronics extends Product {
  async createProduct(){
    const newElectronic = await clothing.create(this.product_attributes)
    if(!newElectronic) throw new BadRequestError('create new Clothing error')

    const newProduct = await super.createProduct()
    if(!newProduct) throw new BadRequestError('create new Product error')

    return newProduct
  }
}

module.exports = ProductFactory