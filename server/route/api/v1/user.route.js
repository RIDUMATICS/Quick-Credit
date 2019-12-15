import passport from 'passport';
import { Router } from 'express';
import userController from '../../../controller/user.controller';
import checkCookieMiddleware from '../../../helper/checkCookieMiddleware';


const userRouter = Router();

userRouter.post('/auth/signup', checkCookieMiddleware, userController.addUser);

userRouter.post('/auth/login', checkCookieMiddleware, userController.loginUser);

userRouter.post('/oauth/google', checkCookieMiddleware, passport.authenticate('googleToken', { session: false }), userController.socialSign);

userRouter.post('/oauth/facebook', checkCookieMiddleware, passport.authenticate('facebookToken', { session: false }), userController.socialSign);

userRouter.get('/auth/logout', passport.authenticate('jwt', { session: false }), userController.signOut);

export default userRouter;