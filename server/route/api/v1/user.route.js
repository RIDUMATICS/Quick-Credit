import { Router } from 'express';
import userController from '../../../controller/user.controller';

const userRouter = Router();

userRouter.post('/signup', userController.addUser);

userRouter.post('/login', userController.loginUser);


export default userRouter;
