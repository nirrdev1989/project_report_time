const { authorizeClient } = require("../db-google-sheets/connect-google-sheets");

/**
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * auth sheets 
 */
async function authSeets(request, response, next) {
   authorizeClient((error, client) => {
      // console.log(client)
      if (error) {
         return response.status(401).send({
            message: "Unauthorize",
         });
      } else {
         client.getRequestHeaders().then(async (authorizationToken) => {
            request.sheetsClientData = {
               authorizationToken: authorizationToken,
            }
            Object.freeze(request.sheetsClientData)
            next();
         });
      }
   });
}

module.exports = {
   authSeets,
};
