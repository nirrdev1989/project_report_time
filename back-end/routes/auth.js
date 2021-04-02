const router = require('express').Router()
const authControllers = require('../controllers/auth')
const { authSeets } = require('../middlewares/auth-sheets')
const validators = require('../validators/validators')
const { validate } = require('../middlewares/validate')
const { authSession } = require('../middlewares/auth-session')
const { limitter } = require('../services/rate-limiter')
const { verifyToken } = require('../middlewares/auth-token')


const authEmailLimitsOptions = {
   windowMs: 15 * 60 * 1000,
   max: 3,
}

const authConfirmCodeOptions = {
   windowMs: 15 * 60 * 1000,
   max: 7,
}

router.get(
   '/userIsLogged',
   verifyToken,
   authControllers.userIsLogged
)

router.get(
   '/logout',
   authControllers.logout
)

/** POST /api/auth/teacherEmail - body: {teacherEmail: string} find user email */
router.post(
   '/teacherEmail',
   limitter(authEmailLimitsOptions),
   [validators.email('teacherEmail')],
   validate,
   authSeets,
   authControllers.authTeacherEmail
)

/** GET /api/auth/new-confirm-code -  get new confirm code  */
router.get(
   '/new-confirm-code',
   limitter(authConfirmCodeOptions),
   authSession,
   authControllers.newConfirmCode
)


/** POST /api/auth/confirm - body: {code: 4 digits} auth confirm code  */
router.post(
   '/confirm-code',
   limitter(authConfirmCodeOptions),
   authSession,
   [validators.confirmCode('code')],
   validate,
   authControllers.authConfirmCode
)



module.exports = router;