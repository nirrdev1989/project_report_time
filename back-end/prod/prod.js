const helmet = require('helmet')
const compression = require('compression')
const cors = require('cors')
const xss = require('xss-clean')
const keys = require('../config/keys')
// function allowCors(request, response, next) {
//     response.header('Access-Control-Allow-Origin', '*');
//     response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
//     response.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
//     if ('OPTIONS' == request.method) {
//         response.sendStatus(200);
//     } else {
//         next();
//     }
// }

module.exports = function (app) {
   app.use(helmet())
   app.use(compression())
   app.use(xss())
   app.use(cors({
      origin: keys.ORIGIN,
      methods: ['GET', 'POST'],
      credentials: true
   }))
}