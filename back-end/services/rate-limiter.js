const rateLimiter = require('express-rate-limit')
const createError = require('../helpers/error')

/**
 * 
 * @param {*} options 
 * limiter - limit requests
 */
function limitter(options) {
   return rateLimiter({
      windowMs: options.windowMs,
      max: options.max,
      message: 'יותר מידי נסיונות  נסה מאוחר יותר',
      handler: function (request, response, next) {
         response.status(429).send({
            message: 'יותר מידי נסיונות  נסה מאוחר יותר'
         })
         // next(createError(429, 'יותר מידי נסיונות  נסה מאוחר יותר'))
      }
   })
}


module.exports = {
   limitter,
}

