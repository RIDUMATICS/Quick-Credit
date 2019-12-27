import { Loan, Repayment, User } from '../models';
import { successResponse, errorResponse } from '../helper/response';
import sendMail from '../helper/email';
import messageTemplate from '../helper/messageTemplate';

class loanService {
  static async createLoan(userEmail, { tenor, amount }) {
    try {
      userEmail = userEmail.toLowerCase();
      amount = +amount; // convert string to integer
      tenor = +tenor; // convert string to integer
      const user = await User.findByPk(userEmail);
      const pendingLoan = await Loan.count({
        where: {
          user: userEmail,
          status: 'pending',
        },
      });
      const unpaidLoan = await Loan.count({
        where: {
          user: userEmail,
          status: 'approved',
          repaid: false,
        },
      });
      if (user.status === 'unverified') return errorResponse(400, 'Account has not been verified');
      if (unpaidLoan) return errorResponse(400, 'Still have an unpaid loan');
      if (pendingLoan) return errorResponse(400, 'Still have a pending loan');
      if (tenor > 12 || tenor < 1) return errorResponse(400, 'Tenor is between 1 to 12 months');

      const interest = (5 * amount) / 100;
      const paymentInstallment = (amount + interest) / tenor;
      const balance = paymentInstallment * tenor;
      const newLoan = await Loan.create({
        user: userEmail,
        createdOn: new Date().getTime(),
        status: 'pending',
        repaid: false,
        tenor,
        amount,
        paymentInstallment,
        balance,
        interest,
      });
      return successResponse(201, { loan: newLoan });
    } catch (error) {
      return errorResponse(500, error);
    }
  }

  static async getLoanRepayment({ id }, email) {
    try {
      const loan = await Loan.findOne({
        where: {
          id,
          user: email,
        },
      });

      if (!loan) return errorResponse(404, 'Loan not found'); // check if loan is not valid

      const repayment = await Repayment.findAll({
        where: {
          loanId: id,
        },
      });

      if (!repayment) return errorResponse(404, 'Repayment not found');

      const paymentInstallment = repayment.map(({ createdOn, amount }) => ({ createdOn, amount }));

      const { amount, interest } = loan;
      return successResponse(200, {
        amount, interest, paymentInstallment,
      });
    } catch (error) {
      return errorResponse(500, error);
    }
  }

  static async getAllLoans(query) {
    try {
      if (query.status || query.repaid) return this.getLoansByRepaid(query);
      const loans = await Loan.findAll();
      return successResponse(200, loans);
    } catch (error) {
      return errorResponse(500, error);
    }
  }

  static async getLoansByRepaid({ status, repaid }) {
    try {
      // check if query is good
      if (status !== 'approved' || (repaid !== 'true' && repaid !== 'false')) {
        return errorResponse(400, 'Query not supported');
      }
      const loans = await Loan.findAll({
        where: {
          status,
          repaid,
        },
      });
      return successResponse(200, loans);
    } catch (error) {
      return errorResponse(500, error);
    }
  }

  static async getLoanById({ id }) {
    try {
      const loan = await Loan.findByPk(id);
      if (!loan) return errorResponse(404, 'Loan not found');
      return successResponse(200, loan);
    } catch (error) {
      return errorResponse(500, error);
    }
  }

  static async getLoanByUser(email) {
    try {
      const loans = await Loan.findAll({
        where: {
          user: email,
        },
      });
      if (!loans) return errorResponse(404, 'Loan not found');
      return successResponse(200, loans);
    } catch (error) {
      return errorResponse(500, error);
    }
  }

  static async approveOrRejectLoan(id, { status }) {
    try {
      const loan = await Loan.findByPk(id);
      if (!loan) return errorResponse(404, 'Loan not found');

      // check if args is good
      if (status !== 'approved' && status !== 'rejected') return errorResponse(400, 'Status not supported');

      const updatedLoan = await loan.update({
        status,
      });
      // don't want to send email in test mode
      if (status === 'approved' && process.env.NODE_ENV !== 'test') {
        await sendMail(loan.user, 'APPROVAL OF REQUEST FOR LOAN', messageTemplate.loanApproval(loan));
      } else if (status === 'rejected' && process.env.NODE_ENV !== 'test') {
        await sendMail(loan.user, 'REJECTION OF REQUEST FOR LOAN', messageTemplate.loanRejection(loan));
      }

      return successResponse(200, { loan: updatedLoan });
    } catch (error) {
      return errorResponse(500, error);
    }
  }

  static async postLoanRepayment(id, { amount }) {
    try {
      const loan = await Loan.findOne({
        where: {
          id,
          status: 'approved',
        },
      });

      if (!loan) return errorResponse(404, 'Loan not found'); // check if loan is not valid

      if (loan.balance === 0) return errorResponse(404, 'No outstanding payment'); // check if loan is fully paid

      await loan.update({
        balance: loan.balance - amount,
        repaid: loan.balance - amount === 0,
      });

      const repayment = await Repayment.create({
        loanId: id,
        createdOn: new Date().getTime(),
        amount,
      });
      return successResponse(201, repayment);
    } catch (error) {
      return errorResponse(500, error);
    }
  }
}

export default loanService;
