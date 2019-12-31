import '@babel/polyfill';
import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import { log } from 'debug';
import passport from 'passport';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
// eslint-disable-next-line no-unused-vars
import passportConfig from './config/passport';
import userRouter from './route/api/v1/user.route';
import adminRouter from './route/api/v1/admin.route';
import loanRouter from './route/api/v1/loan.route';
import swaggerDocument from '../swagger.json';

config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(passport.initialize());
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

app.get('/', (req, res) => {
  res.json({
    name: 'Quick Credit API',
    description: 'Quick Credit is an online lending platform that provides short term soft loans to individuals. This helps solve problems of financial inclusion as a way to alleviate poverty and empower low income earners.',
    verison: '1.0.0',
    author: 'Ridwan Onikoyi',
    documentation: 'http://localhost:8080/api/v1/documentation',
  });
});

app.use('/api/v1', userRouter);
app.use('/api/v1/admin', adminRouter);
app.use('/api/v1/loans', loanRouter);
app.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default app.listen(PORT, () => {
  log(`APP LISTENING ON ${PORT} `);
});
