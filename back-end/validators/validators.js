const { check } = require('express-validator')
const { daysRange, timesRange, conculateRangeToTime } = require('../helpers/dates.ranges')
const keys = require('../config/keys')
const isBase64 = require('is-base64');

const errorMessage = 'INVALID VALUES'

/**
 * Validators - validate user inputs
 */

module.exports = {
   email: function (property) {
      return check(property, errorMessage)
         .exists()
         .isEmail()
   },
   confirmCode: function (property) {
      return check(property, errorMessage)
         .exists()
         .isNumeric()
         .isLength({ min: keys.CONFIRM_CODE.length, max: keys.CONFIRM_CODE.length })
   },
   numberPropery: function (property) {
      return check(property, errorMessage)
         .exists()
         .isNumeric()
   },
   stringProperty: function (property) {
      return check(property, errorMessage)
         .exists()
         .isString()
   },
   datePropery: function (property, key, limit) {
      return check(property, errorMessage)
         .exists()
         .isDate()
         .custom((result) => {
            if (key === 'DATE_LIMITS') {
               const now = new Date().getTime()
               const value = new Date(result).getTime()
               if (now < value - (1000 * 60 * 60) || daysRange(now, value) > limit) {
                  throw new Error()
               }
               return true
            }

            return true
         })
   },
   timePropery: function (property, key) {
      return check(property, errorMessage)
         .exists()
         .matches(/^\s*([01]?\d|2[0-3]):?([0-5]\d)\s*$/)
         .custom((result, { req }) => {

            if (key === 'TIMES_RANGE') {
               if (timesRange(req.body.reportStartTime, req.body.reportEndTime) <= 0) {
                  throw new Error()
               }

               const meetingDate = new Date(req.body.reportDate).toLocaleDateString();
               const dateToday = new Date().toLocaleDateString();

               if (meetingDate === dateToday) {
                  let now = new Date()
                  let time = req.body.reportStartTime.split(':') || req.body.reportEndTime.split(':')
                  let timeValue = new Date(now.getFullYear(), now.getMonth(), now.getDate(), Number(time[0]), Number(time[1]), 0).getTime()

                  if (now.getTime() < timeValue) {
                     throw new Error()
                  }
               }
            }
            else if (key === 'RANGE') {
               const time = conculateRangeToTime(
                  timesRange(req.body.reportStartTime, req.body.reportEndTime)
               )
               if (time !== result) {
                  throw new Error()
               }
            }

            return true
         })

   },
   imageBase64: function (property) {
      return check(property, errorMessage)
         .exists()
         .trim()
         .custom((result) => {
            const checkBase64 = isBase64(result, { allowMime: true, mimeRequired: true })
            if (!checkBase64) {
               throw new Error()
            }

            return true
         })
   }
}

