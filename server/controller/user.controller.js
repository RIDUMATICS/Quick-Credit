import userService from '../services/user.service';

const userController = {
  addUser(req, res) {
    userService.addUser(req.body, req.query)
      .then((resp) => {
        res.cookie('jwt_token', resp.data.token, {
          httpOnly: true,
        });
        return res.status(resp.status).json(resp);
      })
      .catch((err) => res.status(err.status).send(err));
  },

  loginUser(req, res) {
    userService.loginUser(req.body)
      .then((resp) => {
        res.cookie('jwt_token', resp.data.token, {
          httpOnly: true,
        });
        return res.status(resp.status).json(resp);
      })
      .catch((err) => res.status(err.status).send(err));
  },

  socialSign(req, res) {
    const resp = userService.socialSign(req.user.dataValues);
    res.cookie('jwt_token', resp.data.token, {
      httpOnly: true,
    });
    res.status(resp.status).json(resp);
  },
};

export default userController;
