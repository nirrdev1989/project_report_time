const router = require('express').Router()
const teacherController = require('../controllers/teacher')
const { authSeets } = require('../middlewares/auth-sheets')
const { verifyToken } = require('../middlewares/auth-token')
const { findReport } = require('../middlewares/find-report')
const { validate } = require('../middlewares/validate')
const { authSession } = require('../middlewares/auth-session')
const cache = require('../middlewares/cache/cache')
const validators = require('../validators/validators')
const keys = require('../config/keys')
const { limitter } = require('../services/rate-limiter')

const limitReportsDays = 90
const limitResendSignDays = 1

const createReportLimitOptions = {
   windowMs: 30 * 60 * 1000,
   max: 10,
}


/** GET /api/teacher/students -  get students list */
router.get(
   '/students',
   authSession,
   verifyToken,
   cache.studentsList,
   authSeets,
   teacherController.getStudents
)

/** POST /api/teacher/create-report' 
 *  body : { ticketNo: string,
 * studentName:string,
 * reportActivitis: string,
 * reportComments: string,
 * parentEmail: email string ,
 * reportDate: date string,
 * reportStartTime: time string,
 * reportEndTime: time string,
 * reportRangeTimne: time string }
 * -
 * save report created
*/
router.post(
   '/create-report',
   limitter(createReportLimitOptions),
   authSession,
   verifyToken,
   [
      validators.numberPropery('ticketNo'),
      validators.stringProperty('studentName'),
      validators.stringProperty('reportActivitis'),
      validators.stringProperty('reportComments'),
      validators.email('parentEmail'),
      validators.datePropery(
         'reportDate',
         keys.CUSTOM_VALIDATORS_KEYS.dateLimit,
         limitReportsDays
      ),
      validators.timePropery(
         'reportStartTime',
         keys.CUSTOM_VALIDATORS_KEYS.timesRange
      ),
      validators.timePropery(
         'reportEndTime',
         keys.CUSTOM_VALIDATORS_KEYS.timesRange
      ),
      validators.timePropery(
         'reportRangeTimne',
         keys.CUSTOM_VALIDATORS_KEYS.range
      )
   ],
   validate,
   authSeets,
   findReport,
   teacherController.createReport
)

/** GET /api/teacher/reports-unconfirm -  get reports  unconfirm list  */
router.get(
   '/reports-unconfirm',
   authSession,
   verifyToken,
   // cache.reporrsList,
   authSeets,
   teacherController.getReportsUnConfirm
)

/** GET /api/teacher/reports/stats -  get reports  stats   */
router.get(
   '/reports/stats',
   authSession,
   verifyToken,
   authSeets,
   teacherController.getReportsStats
)

/** POST /api/teacher/resend/parent-sign' 
 *  body : { ticketNo: string,
 * studentName:string,
 * reportActivitis: string,
 * reportComments: string,
 * index:  number ,
 * reportDate: date string}
 * -
 * resend confirm email to parent
*/
router.post(
   '/resend/parent-sign',
   authSession,
   verifyToken,
   [
      validators.numberPropery('ticketNo'),
      validators.stringProperty('studentName'),
      validators.email('parentEmail'),
      validators.numberPropery('index'),
      validators.datePropery('reportDate')
   ],
   validate,
   authSeets,
   findReport,
   teacherController.resendParentSign
)


module.exports = router