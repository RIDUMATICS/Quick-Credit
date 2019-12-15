import passport from 'passport';
import { Router } from 'express';
import userController from '../../../controller/user.controller';
import { errorResponse } from '../../../helper/response';

const checkCookieMiddleware = (req, res, next) => {
  // checks if a user have login then don't signup/login a new user
  if (req && req.cookies && req.cookies.jwt_token) {
    res.status(400).json(errorResponse(400, 'user have Login please logout first'));
  } else {
    next();
  }
};

const userRouter = Router();

userRouter.post('/auth/signup', checkCookieMiddleware, userController.addUser);

userRouter.post('/auth/login', checkCookieMiddleware, userController.loginUser);

userRouter.post('/oauth/google', checkCookieMiddleware, passport.authenticate('googleToken', { session: false }), userController.socialSign);

userRouter.post('/oauth/facebook', checkCookieMiddleware, passport.authenticate('facebookToken', { session: false }), userController.socialSign);

userRouter.get('/auth/logout', passport.authenticate('jwt', { session: false }), userController.signOut);
export default userRouter;
