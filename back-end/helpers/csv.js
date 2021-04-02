const parseCSV = require('csv-parse')


/**
 * @param {*} data
 * csv parser 
 */
function convertCSV(data, sheetName) {
   return new Promise((resolve, reject) => {
      parseCSV(data, {}, (error, result) => {
         if (sheetName && sheetName === 'REPORTS') {
            if (result[1]) {
               resolve(result.slice(1, result.length))
            } else {
               resolve(undefined)
            }
         }
         else if (result[0]) {
            resolve(result)

         } else {
            resolve(undefined)
         }
      })
   })
}

module.exports = {
   convertCSV
}