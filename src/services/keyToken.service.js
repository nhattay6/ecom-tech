'use strict'

const keyTokenModel = require('../models/keytoken.model')

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey, privateKey }) => {
    try {
      // lv 0
      // const tokens = await keyTokenModel.create({
      //   user: userId,
      //   publicKey,
      //   privateKey
      // })
      
      // return tokens ? tokens.publicKey : null

      // lv xxx
      const filter = { user: userId }
      const update = {
        publicKey,
        privateKey,
        refreshTokenUsed: [],
        refreshToken
      }
      const options = { upsert: true, new: true }
      const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options)
      return tokens ? tokens.publicKey : null
    } catch (error) {
      return error
    }
  }
}

module.exports = KeyTokenService