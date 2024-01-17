'use strict'

const JWT = require('jsonwebtoken')
const { asyncHandler } = require('../helpers/asyncHandler')
const { AuthFailureError, NotFoundError } = require('../core/error.response')
const { findByUserId } = require('../services/keyToken.service')

const HEADER = {
  API_KEY: 'x-api-key',
  CLIENT_ID: 'x-client-id',
  AUTHORIZATION: 'authorization',
  REFRESHTOKEN: 'REFRESHTOKEN',
}

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    // accessToken
    const accessToken = await JWT.sign(payload, publicKey, {
      algorithm: 'RS256',
      expiresIn: '2 days'
    })

    const refreshToken = await JWT.sign(payload, privateKey, {
      algorithm: 'RS256',
      expiresIn: '7 days'
    })

    JWT.verify(accessToken, publicKey, (err, decode) => {
      if(err) {
        console.log('error verify token::', err)
      } else {
        console.log('decode verify', decode)
      }
    })
    return { accessToken, refreshToken }
  } catch (error) {
    console.error(error)
  }
}

const authentication = asyncHandler(async (req, res, next) => {
  /**
    1 - check userId missing
    2 - get accessToken
    3 - verifyToken
    4 - check user in db
    5 - check keyStore with this userId
    6 - OK => return next()
  */
  const userId = req.headers[HEADER.CLIENT_ID]
  if(!userId) throw new AuthFailureError('Invalid Request')

  const keyStore = await findByUserId(userId)
  if(!keyStore) throw new NotFoundError('Not found keStore')

  if(req.headers[HEADER.REFRESHTOKEN]){
    try {
      const refreshToken = req.headers[HEADER.REFRESHTOKEN]
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey)
      if(userId !== decodeUser.userId) throw new AuthFailureError('invalid UserId')
      req.keyStore = keyStore
      req.user = decodeUser
      req.refreshToken = refreshToken
      return next()
    } catch (error) {
      throw error
    }
  }

  const accessToken = req.headers[Headers.AUTHORIZATION]
  if(!accessToken) throw new AuthFailureError('Invalid Request')

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey)
    if(userId !== decodeUser.userId) throw new AuthFailureError('Invalid UserId')
    req.keyStore = keyStore
    return next()
  } catch (error) {
    throw error
  }
})

module.exports = {
  createTokenPair,
  authentication
}