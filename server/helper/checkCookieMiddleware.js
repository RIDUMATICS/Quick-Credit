import { errorResponse } from './response';

const checkCookieMiddleware = (req, res, next) => {
  // checks if a user have login then don't signup/login a new user
  if (req && req.cookies && req.cookies.jwt_token) {
    res.status(400).json(errorResponse(400, 'user have Login please logout first'));
  } else {
    next();
  }
};

export default checkCookieMiddleware;
