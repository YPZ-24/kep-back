import express from 'express'
import cors from 'cors';
import config from './config/config'
import {errorHandler, wrapError} from './utils/middleware/errorHandler'
import notFoundHandler from './utils/middleware/notFoundHandler';
import subjectsApi from './routes/subject.routes';
import questionsApi from './routes/question.routes';
import usersApi from './routes/user.routes';
import passportMiddleware from './middlewares/passport';
import passport from 'passport';

//INSTANCE EXPRESS
let app = express()

//SETTINGS
app.set('PORT', config.PORT)

//MIDDLEWARES
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended: false}))
app.use(passport.initialize());
passport.use(passportMiddleware);

//ROUTES
subjectsApi(app)
questionsApi(app)
usersApi(app)

//ERROR MIDDLEWARE
app.use(wrapError)
app.use(errorHandler)

//NOT FOUND
app.use(notFoundHandler)

export default app;
