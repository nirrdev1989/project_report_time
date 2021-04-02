const keys = require("../config/keys");
const { createToken } = require("../services/tokens");


function responseWithToken(data, user, response) {

   const token = createToken({
      teacherId: user.userId,
   }, keys.TOKENS.ACCESS_TOKEN.secretTokenKey, keys.TOKENS.ACCESS_TOKEN.expiresIn);

   let cookieOptions = {
      expires: new Date(Date.now() + (process.env.ACCESS_TOKEN_EXPIRES_COOKIE * 1000 * 60 * 60)),
      httpOnly: true
   }

   if (process.env.NODE_ENV === 'production') {
      cookieOptions.secure = true
   }

   response.cookie('jwt', token, cookieOptions)

   response.status(201).send({
      ...data,
      // token: token
   })
}

module.exports = responseWithToken