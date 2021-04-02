const googleSheetsService = require("../services/google-sheets");
const { sendMail } = require("../send-email/transporter");
const { ConfirmCode } = require("../services/confirm-code");
const { emailOptions } = require("../services/emails/emails.options");
const emailTamplate = require('../services/emails/email.tamplates')
const keys = require("../config/keys");
const { convertSheetsDataToObjectsArray } = require('../helpers/tojson');
const catchAsync = require("../helpers/catchAsync");
const createError = require("../helpers/error");
const responseWithToken = require("../helpers/responseWithToken");


exports.userIsLogged = catchAsync(async function (request, response, next) {
   if (!request.userData.teacherId) {
      next(createError(401, 'Unauthorized'))
      return
   }

   response.status(201).send({
      message: "User log",
      isLog: true,
   })
})


exports.authTeacherEmail = catchAsync(async function (request, response, next) {
   const { teacherEmail } = request.body;
   const query = `select A,B,C,D where C='${teacherEmail}'`;
   const sheetId = keys.GOOGLE_SHEETS.sheetsIds.teachers;

   const teacher = await googleSheetsService.find(
      query,
      sheetId,
      request.sheetsClientData.authorizationToken
   );
   // console.log(teacher)

   if (!teacher || teacher.length === 0) {
      next(createError(404, "משתמש לא נמצא"))
      return
   }

   const toJson = convertSheetsDataToObjectsArray(teacher, 'TEACHERS')[0]

   const newCode = new ConfirmCode()

   const options = emailOptions(
      toJson.email,
      emailTamplate.confirmCode(newCode.getConfirmCode())
   );

   sendMail(options);

   request.session.user = {
      userId: toJson.id,
      email: toJson.email,
      firstName: toJson.firstName,
      companyContent: toJson.companyContent,
      confirmCode: newCode.getConfirmCode(),
      confirmCodeExpiresIn: new Date().getTime() + (keys.CONFIRM_CODE.expiresIn * 1000),
      studentsList: [],
      reportsList: []
   }

   return response.status(200).send({
      message: "USER FOUND",
      confirmCodeExpire: keys.CONFIRM_CODE.expiresIn,
   });
})


exports.authConfirmCode = catchAsync(async function (request, response, next) {
   const { code } = request.body;
   const { userId, email, companyContent, firstName, confirmCode, confirmCodeExpiresIn } = request.session.user

   if (code === confirmCode && new Date().getTime() < confirmCodeExpiresIn) {
      request.session.user.confirmCode = undefined
      return responseWithToken({
         message: "User log",
         isLog: true,
         tokenExpiresIn: keys.TOKENS.ACCESS_TOKEN.expiresIn,
         userName: firstName,
         companyContent: companyContent
      },
         request.session.user,
         response
      )
   }

   next(createError(402, "קוד שגוי, נסה שנית"))
})


exports.newConfirmCode = catchAsync(async function (request, response, next) {

   const { email } = request.session.user

   const newCode = new ConfirmCode()

   const options = emailOptions(
      email,
      emailTamplate.confirmCode(newCode.getConfirmCode())
   );

   request.session.user.confirmCode = newCode.getConfirmCode()
   request.session.user.confirmCodeExpiresIn = new Date().getTime() + (keys.CONFIRM_CODE.expiresIn * 1000)

   sendMail(options)

   response.status(200).send({
      message: "נשלח קוד חדש",
      confirmCodeExpire: keys.CONFIRM_CODE.expiresIn,
   });
})


exports.logout = function (request, response, next) {

   response.cookie('jwt', 'logout', {
      expires: new Date(Date.now() + 1000 * 5),
      httpOnly: true
   })

   console.log('LOGOUT')

   response.status(200).send({
      message: 'Logout'
   })
}

