import passport from 'passport';
import { Router } from 'express';
import loanController from '../../../controller/loan.controller';
import checkIsAdmin from '../../../helper/checkIsAdmin';

const loanRouter = Router();

loanRouter.post('/', passport.authenticate('jwt', { session: false }), loanController.createLoan);
loanRouter.get('/user', passport.authenticate('jwt', { session: false }), loanController.getLoanByUser);
loanRouter.get('/:id/repayments', passport.authenticate('jwt', { session: false }), loanController.getLoanRepayment);

// Only Admin can view all loan applications
loanRouter.get('/', passport.authenticate('jwt', { session: false }), checkIsAdmin, loanController.getAllLoans);
// Only Admin can view a specific loan application.
loanRouter.get('/:id', passport.authenticate('jwt', { session: false }), checkIsAdmin, loanController.getLoanById);
// Only Admin can approve or reject a loan application.
loanRouter.patch('/:id', passport.authenticate('jwt', { session: false }), checkIsAdmin, loanController.approveOrRejectLoan);
// Only Admin can post loan repayment transaction.
loanRouter.post('/:id/repayments', passport.authenticate('jwt', { session: false }), checkIsAdmin, loanController.postLoanRepayment);
export default loanRouter;
