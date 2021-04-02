const nodemailer = require('nodemailer')
const keys = require('../config/keys')


/**
 * @param {*} options 
 * @param {*} callSuccess 
 * email transporter 
 */
function sendMail(options, callSuccess) {
   const transporter = nodemailer.createTransport({
      // host: '...',
      // port: XXXX,
      // secure: true, 
      service: 'gmail',
      auth: {
         user: keys.EMAIL_SENDER.auth.user,
         pass: keys.EMAIL_SENDER.auth.pass
      }
   })
   transporter.sendMail(options, (error, info) => {
      if (error) {
         console.log(error)
         // callSuccess(error, null)
      }
      //   callSuccess(null, true)
   })

}

module.exports = {
   sendMail
}
