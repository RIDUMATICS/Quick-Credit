import { Router } from 'express';
import userController from '../../../controller/user.controller';

const userRouter = Router();

userRouter.post('/signup', (req, res, next) => {
  if (req.query.admin) {
    console.log('admin route');
    // only admin can signup new admin
    // use passport-jwt to verify that the person is admin
  }
  next();
}, userController.addUser);


export default userRouter;
