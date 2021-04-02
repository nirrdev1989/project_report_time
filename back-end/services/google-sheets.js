const keys = require('../config/keys')
const fetch = require('node-fetch')
const { convertCSV } = require('../helpers/csv')


/**
 * @param {*} query 
 * @param {*} sheetId 
 * @param {*} authorizationToken 
 * find on google sheet doc
 */
module.exports.find = async function (query, sheetId, authorizationToken, sheetName) {
   const spreadsheetId = keys.GOOGLE_SHEETS.spreadsheetId

   try {
      const foundStudents = await fetch(
         `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&gid=${sheetId}&tq=${encodeURI(query)}`, {
         method: 'GET',
         headers: authorizationToken
      })

      const textResponse = await foundStudents.text()

      const convertData = await convertCSV(textResponse, sheetName)
      if (!convertData) {
         return
      }

      return convertData
   } catch (error) {
      throw error
   }
}

/**
 * 
 * @param {*} body 
 * @param {*} sheetName 
 * @param {*} authorizationToken 
 * save on goolge sheet doc
 */
module.exports.save = async function (body, sheetName, authorizationToken) {
   const spreadsheetId = keys.GOOGLE_SHEETS.spreadsheetId

   try {

      const saveItem = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}%21A%3AZ:append?valueInputOption=USER_ENTERED`, {
         method: 'POST',
         headers: authorizationToken,
         body: body
      })

      const jsonResponse = await saveItem.json()

      return jsonResponse
   } catch (error) {
      throw error
   }
}


/**
 * 
 * @param {*} range 
 * @param {*} sheetName 
 * @param {*} body 
 * @param {*} authorizationToken 
 * update google sheet doc
 */
module.exports.update = async function (range, sheetName, body, authorizationToken) {
   const spreadsheetId = keys.GOOGLE_SHEETS.spreadsheetId

   try {
      const update = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${sheetName}${range}?valueInputOption=USER_ENTERED`, {
         method: 'PUT',
         headers: authorizationToken,
         body: body
      })

      const responseJson = await update.json()

      return responseJson
   } catch (error) {
      throw error
   }

}




