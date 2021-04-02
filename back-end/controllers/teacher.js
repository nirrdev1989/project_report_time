const googleSheetsService = require("../services/google-sheets");
const keys = require("../config/keys");
const { convertSheetsDataToObjectsArray } = require('../helpers/tojson');
const { sendMail } = require("../send-email/transporter");
const { createToken } = require('../services/tokens')
const { findFirstNumberOnString } = require('../helpers/numbers-on-string')
const { emailOptions } = require("../services/emails/emails.options");
const emailTamplate = require('../services/emails/email.tamplates')
const { daysRange } = require('../helpers/dates.ranges');
const catchAsync = require("../helpers/catchAsync");
const createError = require("../helpers/error");
const responseWithToken = require("../helpers/responseWithToken");



exports.getStudents = catchAsync(async function (request, response, next) {
   const query = `select * where F=${Number(request.userData.teacherId)}`;
   const sheetId = keys.GOOGLE_SHEETS.sheetsIds.childrens


   const sdudents = await googleSheetsService.find(
      query,
      sheetId,
      request.sheetsClientData.authorizationToken,
   )

   if (!sdudents) {
      return response.status(200).send([]);
   }

   const toJson = convertSheetsDataToObjectsArray(sdudents, 'CHILDRENS')

   request.session.user.studentsList = toJson

   return responseWithToken({
      tokenExpiresIn: keys.TOKENS.ACCESS_TOKEN.expiresIn,
      toJson: toJson
      // userName: firstName,
   },
      { userId: request.userData.teacherId },
      response
   )
})


exports.createReport = catchAsync(async function (request, response, next) {
   if (request.findReport) {
      next(createError(400, 'דיווח לא חוקי יתכן שבוצע דיווח כפול ליום זה'))
      return
   }

   const {
      studentName,
      ticketNo,
      reportDate,
      reportActivitis,
      reportComments,
      reportStartTime,
      reportEndTime,
      reportRangeTimne,
      parentEmail } = request.body

   const nowDate = new Date().toDateString()

   let body = `{"values":[
        [
            "${reportDate}",
            "${reportStartTime}",
            "${reportEndTime}",
            "${reportRangeTimne}",
            "${reportActivitis}",
            "${reportComments ? reportComments : null}",
            ${false},
            ${null},
            "${ticketNo}",
            "${request.userData.teacherId}",
            "${new Date(reportDate).getMonth() + 1}",
            "${nowDate}"
        ]
    ]}`

   const reportCreated = await googleSheetsService.save(
      body,
      keys.GOOGLE_SHEETS.sheetsNames.reports,
      request.sheetsClientData.authorizationToken,
      'REPORTS'
   )

   if (reportCreated.updates.updatedRows > 0) {
      const token = createToken({
         studentName: studentName,
         ticketNo: ticketNo,
         reportDate: reportDate,
         reportActivitis: reportActivitis,
         reportComments: reportComments,
         reportStartTime: reportStartTime,
         reportEndTime: reportEndTime,
         reportRangeTimne: reportRangeTimne,
         index: findFirstNumberOnString(reportCreated.updates.updatedRange)
      },
         keys.TOKENS.PARENT_SIGN_ACCESS_TOKEN.secretTokenKey,
         keys.TOKENS.PARENT_SIGN_ACCESS_TOKEN.expiresIn
      )

      const options = emailOptions(parentEmail, emailTamplate.parentSign(token))
      sendMail(options)

      request.session.user.reportsList = []


      return responseWithToken({
         tokenExpiresIn: keys.TOKENS.ACCESS_TOKEN.expiresIn,
         message: 'REPORT CREATED',
         index: findFirstNumberOnString(reportCreated.updates.updatedRange),
         // userName: firstName,
      },
         { userId: request.userData.teacherId },
         response
      )
   } else {
      next(createError(401, "REPORT CREATED FAIL"))
   }

})


exports.getReportsUnConfirm = catchAsync(async function (request, response, next) {
   const sheetId = keys.GOOGLE_SHEETS.sheetsIds.reports
   const query = `select A,B,C,D,E,F,I,L,M where J=${Number(request.userData.teacherId)}and G=${false}`;

   const reports = await googleSheetsService.find(
      query,
      sheetId,
      request.sheetsClientData.authorizationToken,
      'REPORTS'
   )

   if (!reports) {
      return response.status(200).send([]);
   }

   const toJson = convertSheetsDataToObjectsArray(reports, 'REPORTS')

   request.session.user.reportsList = toJson

   // return response.status(200).send(toJson)


   return responseWithToken({
      tokenExpiresIn: keys.TOKENS.ACCESS_TOKEN.expiresIn,
      toJson: toJson
      // userName: firstName,
   },
      { userId: request.userData.teacherId },
      response
   )
})


exports.getReportsStats = catchAsync(async function (request, response, next) {
   const sheetId = keys.GOOGLE_SHEETS.sheetsIds.stats
   const qurey = `select B,C,D where A=${Number(request.userData.teacherId)}`

   const repostsStats = await googleSheetsService.find(
      qurey,
      sheetId,
      request.sheetsClientData.authorizationToken
   )

   const toJson = convertSheetsDataToObjectsArray(repostsStats, 'REPORTS_STATS')[0]

   return responseWithToken({
      tokenExpiresIn: keys.TOKENS.ACCESS_TOKEN.expiresIn,
      toJson: toJson
      // userName: firstName,
   },
      { userId: request.userData.teacherId },
      response
   )
})


exports.resendParentSign = catchAsync(async function (request, response, next) {
   if (!request.findReport) {
      next(createError(404, "INVALID REPORT"))
      return
   }

   const {
      ticketNo,
      reportDate,
      reportActivitis,
      reportComments,
      reportStartTime,
      reportEndTime,
      reportRangeTimne,
      lastResendDateToParent } = request.findReport

   const {
      studentName,
      parentEmail,
      index } = request.body


   const today = new Date().getTime()
   const lastDateResendSign = new Date(lastResendDateToParent).getTime()

   if (daysRange(today, lastDateResendSign) < 1) {
      next(createError(400, "INVALID REQUEST"))
      return
   }

   const sheetName = keys.GOOGLE_SHEETS.sheetsNames.reports
   const range = `!L${Number(index) + 1}`

   let body = `{"values":[
            [
                "${new Date().toDateString()}"
            ]
        ]}`


   const updateDateParent = await googleSheetsService.update(
      range,
      sheetName,
      body,
      request.sheetsClientData.authorizationToken
   )

   // console.log(updateDateParent)
   if (updateDateParent.updatedColumns > 0) {
      const token = createToken({
         studentName: studentName,
         ticketNo: ticketNo,
         reportDate: reportDate,
         reportActivitis: reportActivitis,
         reportComments: reportComments,
         reportStartTime: reportStartTime,
         reportEndTime: reportEndTime,
         reportRangeTimne: reportRangeTimne,
         index: Number(index) + 1
      },
         keys.TOKENS.PARENT_SIGN_ACCESS_TOKEN.secretTokenKey,
         keys.TOKENS.PARENT_SIGN_ACCESS_TOKEN.expiresIn
      )

      const options = emailOptions(parentEmail, emailTamplate.parentSign(token))
      sendMail(options)

      request.session.user.reportsList = []

      return responseWithToken({
         tokenExpiresIn: keys.TOKENS.ACCESS_TOKEN.expiresIn,
         message: 'UPDATE RESEND DATE PARENT SIGN'
         // userName: firstName,
      },
         { userId: request.userData.teacherId },
         response
      )
   }

   next(createError(400, "UPDATE RESEND SIGN PARENT FAIL"))
})