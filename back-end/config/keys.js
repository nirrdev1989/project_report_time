/**
 * APP config vars
 */
module.exports = {
   port: process.env.NODE_ENV === 'production' ? 5000 : 3000,
   NODE_ENV: process.env.NODE_ENV,
   GOOGLE_SHEETS: {
      spreadsheetId: process.env.SPREADSHEETS_ID,
      scope: process.env.SEETS_SCOPE,
      sheetsIds: {
         teachers: process.env.SHEET_ID_TEACHERS,
         childrens: process.env.SHEET_ID_CHILDRENS,
         reports: process.env.SHEET_ID_REPORTS,
         stats: process.env.SHEET_ID_TEACHER_STATS
      },
      sheetsNames: {
         reports: process.env.SHEETS_NAME_REPORTS,
         teachers: process.env.SHEET_NAME_TEACHERS,
         childrens: process.env.SHEET_NAME_CHILDRENS,
         stats: process.env.SHETT_NAME_TEACHER_STATS
      }
   },
   EMAIL_SENDER: {
      auth: {
         user: process.env.AUTH_EMAIL_USER,
         pass: process.env.AUTH_EMAIL_PASS
      }
   },
   TOKENS: {
      ACCESS_TOKEN: {
         secretTokenKey: process.env.SECRET_ACCESS_TOKEN_KEY,
         expiresIn: 60

      },
      PARENT_SIGN_ACCESS_TOKEN: {
         secretTokenKey: process.env.SECRET_ACCESS_PARENT_TOKEN_KEY,
         expiresIn: 60 * 60 * 24
      }
   },
   SESSION: {
      expiresIn: 1000 * 60 * 60,
      secretSessionKey: process.env.SECRET_SESSION_KEY
   },
   COOKIE: {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_COOKIE
   },
   CONFIRM_CODE: {
      expiresIn: 60,
      length: 4
   },
   CUSTOM_VALIDATORS_KEYS: {
      dateLimit: 'DATE_LIMITS',
      timesRange: 'TIMES_RANGE',
      range: 'RANGE'
   },
   ORIGIN: process.env.NODE_ENV === 'production' ? 'site origin' : '*'
};

