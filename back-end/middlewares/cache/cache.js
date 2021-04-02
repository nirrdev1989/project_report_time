/**
 * cache - cache data
 */
module.exports = {
   studentsList: function (request, response, next) {
      const { studentsList } = request.session.user
      // console.log('cache students')
      if (studentsList.length > 0) {
         return response.status(200).send({ toJson: studentsList })
      }

      next()
   },
   reporrsList: function (request, response, next) {
      const { reportsList } = request.session.user
      // console.log('cache reports')
      if (reportsList.length > 0) {
         return response.status(200).send({ toJson: reportsList })
      }

      next()
   }
}