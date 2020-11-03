const keys = require('../config/keys')
const JsonWebToken = require('jsonwebtoken')




async function verifyTokenSign(request, response, next) {

    const { token } = request.body

    try {
        const decodedToken = await JsonWebToken.verify(token, keys.TOKENS.PARENT_SIGN_ACCESS_TOKEN.secretTokenKey)

        console.log(decodedToken, 'DECODE')

        request.respotInfo = {
            studentName: decodedToken.studentName,
            ticketNo: decodedToken.ticketNo,
            reportDate: decodedToken.reportDate,
            reportActivitis: decodedToken.reportActivitis,
            reportComments: decodedToken.reportComments,
            reportStartTime: decodedToken.reportStartTime,
            reportEndTime: decodedToken.reportEndTime,
            reportRangeTimne: decodedToken.reportRangeTimne,
            index: decodedToken.index,
        }

        Object.freeze(request.respotInfo)
        next()

    } catch (error) {
        console.log(error)
        response.status(500).send({
            message: "ERROR UNKNOW",
        });
    }
}


module.exports = {
    verifyTokenSign
}