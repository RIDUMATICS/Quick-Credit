import jwt from 'jsonwebtoken';
import userService from '../services/user.service';
import { successResponse } from '../helper/response';
import setCookie from '../helper/setCookie';


const userController = {
  addUser(req, res) {
    userService.addUser(req.body)
      .then((resp) => {
        if (resp.data) { setCookie(res, resp.data); }
        return res.status(resp.status).json(resp);
      })
      .catch((err) => res.status(err.status).send(err));
  },

  loginUser(req, res) {
    userService.loginUser(req.body)
      .then((resp) => {
        // if response is successful and contains user data
        if (resp.data) { setCookie(res, resp.data); }
        return res.status(resp.status).json(resp);
      })
      .catch((err) => res.status(err.status).send(err));
  },

  socialSign(req, res) {
    const resp = userService.socialSign(req.user.dataValues);
    if (resp.data) { setCookie(res, resp.data); }
    return res.status(resp.status).json(resp);
  },

  verifyUser(req, res) {
    userService.verifyUser(req.params)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.status).send(err));
  },

  resetPassword(req, res) {
    // get user email from jwt
    const { sub } = jwt.decode(req.cookies.jwt_token);
    userService.resetPassword(sub, req.body)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.status).send(err));
  },

  sendPasswordResetEmail(req, res) {
    userService.sendPasswordResetEmail(req.body.email)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.status).send(err));
  },

  receiveNewPassword(req, res) {
    userService.receiveNewPassword(req.params, req.body.newPassword)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.status).send(err));
  },

  signOut(req, res) {
    res.clearCookie('jwt_token');
    res.status(204).json(successResponse(204, { success: true }));
  },
};

export default userController;
