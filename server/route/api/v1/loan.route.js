import passport from 'passport';
import { Router } from 'express';
import loanController from '../../../controller/loan.controller';
import checkIsAdmin from '../../../helper/checkIsAdmin';

const loanRouter = Router();

loanRouter.post('/', passport.authenticate('jwt', { session: false }), loanController.createLoan);
loanRouter.get('/', passport.authenticate('jwt', { session: false }), checkIsAdmin, loanController.getAllLoans);
loanRouter.get('/:id/repayments', passport.authenticate('jwt', { session: false }), loanController.getLoanRepayment);

export default loanRouter;
