import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import { log } from 'debug';
import passport from 'passport';
import cookieParser from 'cookie-parser';
// eslint-disable-next-line no-unused-vars
import passportConfig from './config/passport';
import userRouter from './route/api/v1/user.route';
import adminRouter from './route/api/v1/admin.route';
import loanRouter from './route/api/v1/loan.route';

config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(passport.initialize());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.send('API IS WORKING');
});

app.use('/api/v1', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/loans', loanRouter);

app.listen(PORT, () => {
  log(`APP LISTENING ON ${PORT} `);
});
