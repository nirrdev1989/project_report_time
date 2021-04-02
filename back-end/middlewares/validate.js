const { validationResult } = require('express-validator')

/**
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * collect errors from user inputs
 */
async function validate(request, response, next) {

   const errors = validationResult(request)

   //  console.log(errors)

   if (!errors.isEmpty()) {
      return response.status(400).send({
         message: 'INVALID REQUEST'
      })
   }

   Object.freeze(request.body)
   next()
}


module.exports = { validate }