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
}

export default loanController;
