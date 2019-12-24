import jwt from 'jsonwebtoken';
import { User as Admin } from '../models';
import { errorResponse } from './response';

const checkIsAdmin = (req, res, next) => {
  const token = req.cookies.jwt_token;
  const { sub } = jwt.decode(token);
  Admin.findOne({
    where: {
      email: sub,
      isAdmin: true,
    },
  }).then((admin) => (admin ? next() : res.status(401).json(errorResponse(401, 'Only admin can access'))))
    .catch((err) => errorResponse(500, err));
};

export default checkIsAdmin;
