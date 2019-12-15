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

  signOut(req, res) {
    res.clearCookie('jwt_token');
    res.status(204).json(successResponse(204, { success: true }));
  },
};

export default userController;