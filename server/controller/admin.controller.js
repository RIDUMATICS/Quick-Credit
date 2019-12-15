import adminService from '../services/admin.service';
import setCookie from '../helper/setCookie';
import { successResponse } from '../helper/response';

class adminController {
  static addAdmin(req, res) {
    adminService.addAdmin(req.body)
      .then((resp) => {
        res.status(resp.status).json(resp);
      })
      .catch((err) => res.status(err.status).send(err));
  }

  static loginAdmin(req, res) {
    adminService.loginAdmin(req.body)
      .then((resp) => {
        // if response is successful and contains user data
        if (resp.data) { setCookie(res, resp.data); }
        return res.status(resp.status).json(resp);
      })
      .catch((err) => res.status(err.status).send(err));
  }

  static socialSign(req, res) {
    const resp = adminService.socialSign(req.user.dataValues);
    if (resp.data) { setCookie(res, resp.data); }
    return res.status(resp.status).json(resp);
  }

  static signOut(req, res) {
    res.clearCookie('jwt_token');
    res.status(204).json(successResponse(204, { success: true }));
  }
}

export default adminController;
