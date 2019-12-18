import jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();


const generateToken = ({ email }, expiresIn = 86400) => { // 86400 = 1 day
  const payload = {
    iss: 'Quick-Credit',
    sub: email,
  };
  const token = jwt.sign(payload, process.env.secretOrPrivateKey, { expiresIn });
  return token;
};

export default generateToken;
