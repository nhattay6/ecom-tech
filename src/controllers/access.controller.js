'use strict'

const AccessService = require("../services/access.service")
const {OK, CREATED, SuccessResponse} = require('../core/success.response')
class AccessController {
  signUp = async (req, res, next) => {
    new CREATED({
      message: 'Registed OK!',
      metadata: await AccessService.signUp(req.body),
      options: {
        limit: 10
      }
    }).send(res)
  }

  login = async (req, res, next) => {
    new SuccessResponse({
      metadata: await AccessService.login(req.body)
    })
  } 
}

module.exports = new AccessController()