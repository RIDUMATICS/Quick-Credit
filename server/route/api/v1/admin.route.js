import { Router } from 'express';
import passport from 'passport';
import adminController from '../../../controller/admin.controller';
import checkIsAdmin from '../../../helper/checkIsAdmin';
import checkCookieMiddleware from '../../../helper/checkCookieMiddleware';

const adminRouter = Router();

adminRouter.post('/auth/signup', passport.authenticate('jwt', { session: false }), checkIsAdmin, adminController.addAdmin);
adminRouter.post('/auth/login', checkCookieMiddleware, adminController.loginAdmin);

export default adminRouter;
