/**
 * @param {*} request 
 * @param {*} response 
 * @param {*} next
 * error handler not found request 
 */
// function apiNotFoundError(request, response, next) {
//    console.log('ERROR NOT FOUND')
//    const error = new Error('NOT-FOUND')
//    error.message = 'NOT FOUND'
//    error.status = 404
//    next(error)
// }

/**
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * error handler  bad request
 */
function handleError(error, request, response, next) {
   error.status = error.status || 'Error'
   error.statusCode = error.statusCode || 500

   if (process.env.NODE_ENV === 'production') {
      // if(error.code === 11000) 'Dup'
      if (error.name === 'JsonWebTokenError') {
         error.message = 'Unauthorized'
      }
   }
   response.status(error.statusCode).send({
      status: error.status,
      message: error.message,
      error: process.env.NODE_ENV === 'development' ? error : null
   })

}


module.exports = {
   handleError
}
