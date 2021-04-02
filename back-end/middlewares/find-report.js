const googleSheetsService = require('../services/google-sheets')
const keys = require('../config/keys')
const { convertSheetsDataToObjectsArray } = require('../helpers/tojson')
const createError = require('../helpers/error')

/**
 * 
 * @param {*} request 
 * @param {*} response 
 * @param {*} next 
 * 
 * find sigle report 
 */
async function findReport(request, response, next) {
   const { ticketNo, reportDate } = request.body
   const query = `select A,B,C,D,E,F,I,L,M where J=${Number(request.userData.teacherId)}and I=${ticketNo} and A=date '${reportDate}'`
   const sheetId = keys.GOOGLE_SHEETS.sheetsIds.reports

   try {
      const report = await googleSheetsService.find(
         query,
         sheetId,
         request.sheetsClientData.authorizationToken,
         'REPORTS'
      )
      if (report) {
         request.findReport = convertSheetsDataToObjectsArray(report, 'REPORTS')[0]
         Object.freeze(request.findReport)
         return next()
      }

      next()

   } catch (error) {
      // console.log(error)
      response.status(500).send({
         message: "ERROR UNKNOW",
      });
   }

}


module.exports = {
   findReport
}