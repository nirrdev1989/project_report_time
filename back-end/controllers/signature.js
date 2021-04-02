const keys = require('../config/keys');
const catchAsync = require('../helpers/catchAsync');
const createError = require('../helpers/error');
const googleSheetsService = require("../services/google-sheets");


exports.verifyLink = catchAsync(async function (request, response, next) {
   if (!request.respotInfo) {
      next(createError(404, 'INVALID REPORT'))
      return
   }

   const { ticketNo, reportDate } = request.respotInfo
   const query = `select G,H where I=${ticketNo} and A=date '${reportDate}'`
   const sheetId = keys.GOOGLE_SHEETS.sheetsIds.reports

   const findReport = await googleSheetsService.find(
      query,
      sheetId,
      request.sheetsClientData.authorizationToken,
      'REPORTS'
   )

   if (!findReport || findReport.length === 0) {
      next(createError(404, 'INVALID REPORT'))
      return
   }

   if (findReport[0][0] === 'TRUE' && findReport[0][1] !== '') {
      next(createError(429, 'דיווח חתום'))
      return
   }

   response.status(200).send({
      studentName: request.respotInfo.studentName,
      ticketNo: request.respotInfo.ticketNo,
      reportDate: request.respotInfo.reportDate,
      reportActivitis: request.respotInfo.reportActivitis,
      reportComments: request.respotInfo.reportComments,
      reportStartTime: request.respotInfo.reportStartTime,
      reportEndTime: request.respotInfo.reportEndTime,
      reportRangeTimne: request.respotInfo.reportRangeTimne,
      index: request.respotInfo.index,
   })
})


exports.parentSign = catchAsync(async function (request, response, next) {
   const { index } = request.respotInfo

   const sheetName = keys.GOOGLE_SHEETS.sheetsNames.reports
   const range = `!G${index}:H${index}`

   const body = `{"values":[
            [    
                ${true},
                "${request.body.singImageBase64}"
            ]
        ]}`


   const updateDateParent = await googleSheetsService.update(
      range,
      sheetName,
      body,
      request.sheetsClientData.authorizationToken
   )

   if (updateDateParent.updatedColumns > 0) {
      return response.status(200).send({
         message: 'SIGNATURE UPDATE'
      })
   }

   next(createError(402, "UPDATE SIGN FAIL"))
})