import userService from '../services/user.service';

const userController = {
  addUser(req, res) {
    userService.addUser(req.body, req.query)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.status).send(err));
  },

  loginUser(req, res) {
    userService.loginUser(req.body)
      .then((resp) => res.status(resp.status).json(resp))
      .catch((err) => res.status(err.status).send(err));
  },
};

export default userController;
