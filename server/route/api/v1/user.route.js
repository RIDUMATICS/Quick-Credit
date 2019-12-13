import passport from 'passport';
import { Router } from 'express';
import userController from '../../../controller/user.controller';


const userRouter = Router();

userRouter.post('/auth/signup', userController.addUser);

userRouter.post('/auth/login', userController.loginUser);

userRouter.post('/oauth/google', passport.authenticate('googleToken', { session: false }), userController.socialSign);


export default userRouter;
