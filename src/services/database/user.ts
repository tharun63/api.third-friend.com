import { UserModel } from "../../models/user";
import bcrypt from "bcrypt";
const saltRounds = 12;

export class UserDataServiceProvider {
  public async saveUser(userData) {
    // Hash Password
    userData.password = await bcrypt.hash(userData.password, saltRounds);
    return await UserModel.create(userData);
  }

  public async saveUserFromGoogle(userData) {
    return await UserModel.create(userData);
  }

  // Updated Email Verified Status
  async updateEmailVerifiedStatus(email, status) {
    // Update Email Verified Status
    const emailVerified = await UserModel.updateOne(
      { email },
      { email_verified: status, status: "ACTIVE" }
    );
    return emailVerified;
  }

  async login(email, password) {
    let match = false;
    const userDetails: any = await this.getUserByEmail(email);
    if (userDetails) {
      match = await bcrypt.compare(password, userDetails.password);
    }
    return match ? userDetails : null;
  }

  async getUserByEmail(email) {
    return await UserModel.findOne({
      email,
      status: { $ne: "ARCHIVED" },
    }).lean();
  }

  async emailExists(email) {
    const emailCount = await UserModel.countDocuments({ email });
    return emailCount ? true : false;
  }

  async userNameExists(username) {
    const userNamesCount = await UserModel.countDocuments({
      username,
      status: { $ne: "ARCHIVED" },
    });
    return userNamesCount ? true : false;
  }
 
  async updateUserById(advertiserId, data) {
    return UserModel.updateOne({ _id: advertiserId }, { $set: data });
  }
  async updateUserByQuery(query, data) {
    return UserModel.updateOne(query, { $set: data });
  }

  async updateUserByEmail(email, data) {
    return UserModel.findOne({ email }, { $set: data });
  }

  async updatePassword(advertiserId, password, passwordExpires = null) {
    // Hash Password
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return await UserModel.updateOne(
      { _id: advertiserId },
      {
        $set: {
          password: hashedPassword,
        //   password_expired_at: passwordExpires,
        },
      }
    );
  }

  async getAllUsers({
    query = {},
    skip = null,
    limit = null,
    sort = {},
    projection = {},
    lean = false,
  }) {
    if (lean) {
      return UserModel.find(query)
        .collation({ locale: "en" })
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select(projection)
        .lean();
    }
    return UserModel.find(query)
      .collation({ locale: "en" })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select(projection);
  }

  async countAllUsers(query = {}) {
    return UserModel.countDocuments(query);
  }
  async updateUsers(query = {}, data) {
    return UserModel.updateMany(query, data);
  }


  async userById(userId, removePassword = false) {
    if (removePassword) {
      return UserModel.findOne({ _id: userId }, { password: 0 })
    } else {
      return UserModel.findById(userId);
    }
  }
}
