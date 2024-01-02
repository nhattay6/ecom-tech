'use strict'

const shopModel = require("../models/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../untils")
const { BadRequestError } = require("../core/error.response")

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp =  async ({name, email, password}) => {
    // try {
      // step1: check email exists??
      const holderShop = await shopModel.findOne({ email }).lean() //giống toArray
      if(holderShop){
        throw new BadRequestError('Error: Shop already registered!')
      }
      const passwordHash = await bycrypt.hash(password, 10)
      const newShop = await shopModel.create({
        name, email, password: passwordHash, roles: [RoleShop.SHOP]
      })
      
      if(newShop){
        // created privateKey[user - sign token], publicKey[server - validate token]
        
        // const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        //   modulesLength: 4096,
        //   publicKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   },
        //   privateKeyEncoding: {
        //     type: 'pkcs1',
        //     format: 'pem'
        //   }
        // })

        const privateKey = crypto.randomBytes(64).toString('hex')
        const publicKey = crypto.randomBytes(64).toString('hex')

        // Public key CryptoGraphy Standards!
        console.log({ privateKey, publicKey }) // save collection keyStore
        
        const keyStore = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
          privateKey
        })

        if(!keyStore) {
          return {
            code: 'xxx',
            message: 'error'
          }
        }
        
        // created token pair
        const tokens = await createTokenPair({userId: newShop._id, email}, publicKey, privateKey)
        console.log('create token success::', tokens)
        
        return {
          code: 201,
          metadata: {
            shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
            tokens
          }
        }
      }
      
      return {
        code: 200,
        metadata: null
      }
      
    // } catch (error) {
    //   return {
    //     code: 'xxx',
    //     message: error.message,
    //     status: 'error',
    //   }
    // }
  }
}

module.exports = AccessService