import { config } from 'dotenv';
import bcrypt from 'bcryptjs';
import { User as Admin } from '../models';
import { successResponse, errorResponse } from '../helper/response';

config();

class adminService {
  static async addAdmin({
    email, firstName, lastName, password, address,
  }) {
    try {
      email = email.toLowerCase();
      const admin = await Admin.findByPk(email);
      if (admin) {
        return errorResponse(409, 'Email has already been taken.');
      }
      const salt = await bcrypt.genSalt(+process.env.SALT);
      password = await bcrypt.hash(password, salt);
      await Admin.create({
        email,
        firstName,
        lastName,
        password,
        address,
        signMethod: 'local',
        status: 'verified',
        isAdmin: true,
      });
      return successResponse(201, { admin: { email, firstName, lastName } });
    } catch (err) {
      return errorResponse(500, err);
    }
  }

  static async loginAdmin({ email, password }) {
    try {
      email = email.toLowerCase();
      // check if user exits
      const admin = await Admin.findOne({
        where: {
          email,
          isAdmin: true,
        },
      });
      if (!admin) return errorResponse(401, 'The email and password you entered did not match our records. Please double-check and try again.');
      // check if user password is correct
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) return errorResponse(401, 'The email and password you entered did not match our records. Please double-check and try again.');
      const { firstName, lastName } = admin;
      return successResponse(200, { user: { email: admin.email, firstName, lastName } });
    } catch (err) {
      return errorResponse(500, err);
    }
  }

  static socialSign(user) {
    const { email, firstName, lastName } = user;
    return successResponse(200, { user: { email, firstName, lastName } });
  }
}

export default adminService;
