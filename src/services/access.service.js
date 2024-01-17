'use strict'

const shopModel = require("../models/shop.model")
const bycrypt = require('bcrypt')
const crypto = require('crypto')
const KeyTokenService = require("./keyToken.service")
const { createTokenPair } = require("../auth/authUtils")
const { getInfoData } = require("../untils")
const { BadRequestError, AuthFailureError } = require("../core/error.response")
const { findByEmail } = require("./shop.service")
const keytokenModel = require("../models/keytoken.model")

const RoleShop = {
  SHOP: 'SHOP',
  WRITER: 'WRITER',
  EDITOR: 'EDITOR',
  ADMIN: 'ADMIN'
}

class AccessService {
  static signUp =  async ({name, email, password}) => {
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
  }
  /**
   * check email in dbs
   * match password
   * create AT vs RT and save
   * generate tokens
   * get data return login
   * @param {}
   */
  static login = async ({email, password, refreshToken = null}) => {
    // 1
    const foundShop = await findByEmail
    if(!foundShop) throw new BadRequestError('shop not registed')

    // 2
    const match = bcrypt.compare(password, foundShop.password)
    if(!match) throw new AuthFailureError('Authentication error')

    // 3
    const privateKey = crypto.randomBytes(64).toString('hex')
    const publicKey = crypto.randomBytes(64).toString('hex')
    // 4
    const { _id: userId } = foundShop
    const tokens = await createTokenPair({userId, email}, publicKey, privateKey)
    
    await KeyTokenService.createKeyToken({
      refreshToken: tokens.refreshToken,
      privateKey,
      publicKey
    })

    return {
      shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop}),
      tokens
    }
  }

  static logout = async (keyStore) => {
    const delKey = await KeyTokenService.removeKeyById(keyStore.id)
    console.log(delKey)
    return delKey
  }

  static handleRefreshToken = async ({ keyStore, user, refreshToken }) => {
    // const foundToken = await KeyTokenService.findByRefreshTokenUsed(refreshToken)

    // if(foundToken){
    //   const { userId, email } = await verifyJWT(refreshToken, foundToken.privateKey)

    //   // delete all token on keyStore
    //   await KeyTokenService.deleteKeyById(userId)
    //   throw new ForbiddenError('Something wrong happend !! Pls login')
    // }
    // // to do
  }
}

module.exports = AccessService