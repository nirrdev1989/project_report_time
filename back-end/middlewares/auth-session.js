/**
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * auth session
 */
function authSession(request, response, next) {
   if (!request.session.user) {
      destroySession(request)
      return response.status(401).send({
         message: 'Unauthorized'
      })
   }
   next()
}

/**
 * 
 * @param {*} request
 * destroy user session 
 */
function destroySession(request) {
   request.session.destroy()
   request.session = null
}

module.exports = {
   authSession,
   destroySession
}