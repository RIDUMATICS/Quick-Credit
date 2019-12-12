import jwt from 'jsonwebtoken';
import { config } from 'dotenv';


config();

const generateToken = ({ email }) => {
  const token = jwt.sign(
    {
      iss: 'Quick-Credit',
      sub: email,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1),
    }, process.env.secretOrPrivateKey,
  );
  return token;
};

export default generateToken;
