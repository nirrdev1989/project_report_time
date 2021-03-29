// const dotENV = require('dotenv')
// dotENV.config({ path: `${__dirname}/.env` })


process.on('uncaughtException', (error) => {
   console.log('uncaughtException', error)
   process.exit(1)
})

const PORT = process.env.PORT || 3000
const app = require('./app')

const server = app.listen(PORT, () => { console.log('Server run at port', PORT) })

process.on('unhandledRejection', (error) => {
   console.log('unhandledRejection', error)
   server.close(() => {
      process.exit(1)
   })
})

