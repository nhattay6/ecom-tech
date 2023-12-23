'use strict'

const shopModel = require("../models/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp =  async ({name, email, password}) => {
    try {
      // step1: check email exists??
      const holderShop = await shopModel.findOne({ email }).lean() //giống toArray
      if(holderShop){
        return {
          code: 'xxx',
          message: 'Shop already registerd!'
        }
      }
      const passwordHash = await bycrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      })

      if(newShop){
        // created privateKey[user - sign token], publicKey[server - validate token]
        const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
          modulesLength: 4096
        })

        console.log({ privateKey, publicKey }) // save collection keyStore
      }

    } catch (error) {
      return {
        code: 'xxx',
        message: error.message,
        status: 'error',
      }
    }
  }
}

module.exports = AccessService