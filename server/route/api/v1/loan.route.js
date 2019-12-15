import passport from 'passport';
import { Router } from 'express';
import loanController from '../../../controller/loan.controller';

const loanRouter = Router();

loanRouter.post('/', passport.authenticate('jwt', { session: false }), loanController.createLoan);

export default loanRouter;
