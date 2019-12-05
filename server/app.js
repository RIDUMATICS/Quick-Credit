import express from 'express';
import { config } from 'dotenv';
import morgan from 'morgan';
import { log } from 'debug';

config();

const app = express();

app.use(morgan('dev'));

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
  res.send('API IS WORKING');
});

app.listen(PORT, () => {
  log(`APP LISTENING ON ${PORT} `);
});
