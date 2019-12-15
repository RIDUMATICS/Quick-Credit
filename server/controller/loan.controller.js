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

  static getLoanRepayment(req, res ) {
    loanService.getLoanRepayment(req.params)
      .then(resp => res.status(200).json(resp))
      .catch(err => res.status(500).json(err));
  }
}

export default loanController;
