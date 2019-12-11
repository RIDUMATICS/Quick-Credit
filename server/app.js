import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import { log } from 'debug';
import userRouter from './route/api/v1/user.route';

config();

const app = express();

app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get('/', (req, res) => {
  res.send('API IS WORKING');
});

app.use('/api/v1/auth', userRouter);

app.listen(PORT, () => {
  log(`APP LISTENING ON ${PORT} `);
});
