function createError(statusCode, message) {
   let newError = new Error(message)
   newError.statusCode = statusCode
   newError.status = 'Fail'
   return newError
}

module.exports = createError