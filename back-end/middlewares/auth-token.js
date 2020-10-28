const keys = require('../config/keys')
const JsonWebToken = require('jsonwebtoken')

async function verifyToken(request, response, next) {

    console.log('AUTH TOKEN MIDDLEWERE')

    try {
        const token = request.headers.authorization.split(' ')[1]

        const decodedToken = await JsonWebToken.verify(token, keys.TOKENS.ACCESS_TOKEN.secretTokenKey)

        request.userData = {
            teacherId: decodedToken.teacherId,
            teacherEmail: decodedToken.teacherEmail,
            teacherFirstName: decodedToken.teacherFirstName,
        }

        next()

    } catch (error) {
        console.log('Unauthorized user')
        response.status(403).send({
            message: 'Unauthorized',
        })
    }

}

module.exports = {
    verifyToken
}