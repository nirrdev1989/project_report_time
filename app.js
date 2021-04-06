require("dotenv").config();
const cors = require("cors");
const express = require("express");
// const debug = require('debug')
const path = require("path");
const keys = require('./back-end/config/keys')
const { handleError } = require('./back-end/middlewares/global.errors')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const memoryStore = require('memorystore')(session)

const app = express();

app.set('trust proxy', 1);

if (keys.NODE_ENV === 'production') {
   /** secure middleweres if prod mode */
   require('./back-end/prod/prod')(app)
}

if (keys.NODE_ENV === 'development') {
   const morgan = require('morgan')
   /** development mode log loggers */
   app.use(morgan('dev'))
   app.use(cors({
      origin: keys.ORIGIN,
      credentials: true,
   }))
}


const authRoutes = require("./back-end/routes/auth");
const teacherRoutes = require('./back-end/routes/teacher')
const signRouter = require('./back-end/routes/signature');

app.use(cookieParser())
app.use(express.json({ limit: '15kb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "client/dist/reports")));


/** Session confing */
app.use(session({
   store: new memoryStore({
      checkPeriod: 1000 * 5
   }),
   secret: keys.SESSION.secretSessionKey,
   resave: false,
   saveUninitialized: false,
   cookie: {
      expires: keys.SESSION.expiresIn,
      // httpOnly: true,
      // PROD
      sameSite: keys.NODE_ENV === 'production',
      secure: keys.NODE_ENV === 'production',
      ephemeral: keys.NODE_ENV === 'production'
   }
}))



/** Auth routes */
app.use("/api/v1/auth", authRoutes)

/**Teacher actions routes */
app.use('/api/v1/teacher', teacherRoutes)

/**Parent sign routes */
app.use('/api/v1/sign', signRouter)


/** response client html */
app.get("*", (request, response) => {
   response.sendFile(path.resolve("client/dist/reports/index.html"));
});

/** Errors handlers */
// app.use(apiNotFoundError)
app.use(handleError)


module.exports = app