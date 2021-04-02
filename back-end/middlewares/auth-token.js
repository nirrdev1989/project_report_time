const keys = require('../config/keys')
const JsonWebToken = require('jsonwebtoken')
const { destroySession } = require('./auth-session')
const createError = require('../helpers/error')
const catchAsync = require('../helpers/catchAsync')

/**
 * @param {*} request 
 * @param {*} response 
 * @param {*} next
 * verify token - authorize  user
 */

exports.verifyToken = catchAsync(async function (request, response, next) {

   const token = request.cookies.jwt

   if (!token) {
      destroySession(request)
      next(createError(401, 'Unauthorized'))
      return
   }

   const decodedToken = await JsonWebToken.verify(token, keys.TOKENS.ACCESS_TOKEN.secretTokenKey)

   if (!decodedToken || Object.keys(decodedToken).length === 0) {
      destroySession(request)
      next(createError(401, 'Unauthorized'))
      return
   }

   console.log(decodedToken, 'DECODE TOKEN')
   console.log('IAT: ', new Date(decodedToken.iat))
   console.log('EXP: ', new Date(decodedToken.exp))
   request.userData = {
      teacherId: decodedToken.teacherId,
      // teacherEmail: decodedToken.teacherEmail,
      // teacherFirstName: decodedToken.teacherFirstName,
   }

   Object.freeze(request.userData)

   // const { teacherEmail } = request.body;
   // const query = `select A,B,C,D where C='${teacherEmail}'`;
   // const sheetId = keys.GOOGLE_SHEETS.sheetsIds.teachers;

   // const teacher = await googleSheetsService.find(
   //    query,
   //    sheetId,
   //    request.sheetsClientData.authorizationToken
   // );
   // // console.log(teacher)

   // if (!teacher || teacher.length === 0) {
   //    next(createError(404, "משתמש לא נמצא"))
   //    return
   // }
   next()
})
