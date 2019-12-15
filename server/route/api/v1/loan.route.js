import passport from 'passport';
import { Router } from 'express';
import loanController from '../../../controller/loan.controller';

const loanRouter = Router();

loanRouter.post('/', passport.authenticate('jwt', { session: false }), loanController.createLoan);
loanRouter.get('/:id/repayments', passport.authenticate('jwt', { session: false }), loanController.getLoanRepayment);

export default loanRouter;
