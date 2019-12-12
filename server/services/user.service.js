import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { successResponse, errorResponse } from '../helper/response';
import { User } from '../models';
import generateToken from '../helper/generateToken';

config();

class userService {
  static async addUser({
    email, firstName, lastName, password, address,
  }) {
    try {
      const count = await User.count({
        where: {
          email: email.toLowerCase(),
        },
      });

      if (count) {
        return errorResponse(409, 'Email has already been taken.');
      }
      email = email.toLowerCase();
      const salt = await bcrypt.genSalt(+process.env.SALT)
      password = await bcrypt.hash(password, salt);
      const user = await User.create({
        email,
        firstName,
        lastName,
        password,
        address,
        signMethod: 'local',
        status: 'unverified',
        isAdmin: false,
      });
      return successResponse(201, { token: `Bearer ${generateToken(user)}` });
    } catch (err) {
      return errorResponse(500, err);
    }
  }

  static async loginUser({ email, password }) {
    try {
      // check if user exits
      const user = await User.findByPk(email.toLowerCase());
      if (!user) return errorResponse(401, 'The email and password you entered did not match our records. Please double-check and try again.');
      // check if user password is correct
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return errorResponse(401, 'The email and password you entered did not match our records. Please double-check and try again.');

      return successResponse(200, { token: `Bearer ${generateToken(user)}` });
    } catch (err) {
      return errorResponse(500, err);
    }
  }
}

export default userService;
