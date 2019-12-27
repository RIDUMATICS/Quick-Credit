import jwt from 'jsonwebtoken';
import loanService from '../services/loan.service';


class loanController {
  static createLoan(req, res) {
    // get user email from jwt
    const { sub } = jwt.decode(req.cookies.jwt_token);
    loanService.createLoan(sub, req.body)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.status).send(err));
  }

  static getLoanRepayment(req, res) {
    // get user email from jwt
    const { sub } = jwt.decode(req.cookies.jwt_token);
    loanService.getLoanRepayment(req.params, sub)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.json).json(err));
  }

  static getAllLoans(req, res) {
    loanService.getAllLoans(req.query)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.json).json(err));
  }

  static getLoanById(req, res) {
    loanService.getLoanById(req.params)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.json).json(err));
  }

  static getLoanByUser(req, res) {
    const { sub } = jwt.decode(req.cookies.jwt_token);
    loanService.getLoanByUser(sub)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.json).json(err));
  }

  static approveOrRejectLoan(req, res) {
    loanService.approveOrRejectLoan(req.params.id, req.body)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.json).json(err));
  }

  static postLoanRepayment(req, res) {
    loanService.postLoanRepayment(req.params.id, req.body)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.json).json(err));
  }
}

export default loanController;
