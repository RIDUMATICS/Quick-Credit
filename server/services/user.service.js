import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../helper/response';
import { User } from '../models';

class userService {
  static async addUser(userInput, query) {
    try {
      const count = await User.count({
        where: {
          email: userInput.email,
        },
      });
      if (count) {
        return errorResponse(400, 'Email already exists');
      }
      const {
        email, firstName, lastName, password, address,
      } = userInput;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const isAdmin = !!query.admin;
      const status = query.admin ? 'verified' : 'unverified';
      return User.create({
        email, firstName, lastName, password: hashedPassword, address, status, isAdmin,
      }).then((user) => successResponse(201, user))
        .catch((err) => errorResponse(400, err));
    } catch (err) {
      return errorResponse(500, err);
    }
  }
}

export default userService;
