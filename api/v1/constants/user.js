import USERTYPE from "./userType.js";
import PRISMA from "../../../utils/prisma.mjs";

class User {
  /**
   * @param {Object} userData Information related to the user request
   */
  constructor(userData) {
    this.id = userData.id;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.userName = userData.userName;
    this.email = userData.email;
    this.password = userData.password;
    this.confirmPassword = userData.confirmPassword;
    this.profileImgURL = userData.profileImgURL;
    this.role = userData.role;
  }

  async getUserIfUserExists(userName = "", email = "") {
    const user = await PRISMA.user.findFirst({
      where: {
        email: {
          contains: this.email || email,
        },
        userName: {
          contains: this.userName || userName,
        },
      },
    });
    return user;
  }

  validPassword() {
    return this.password === this.confirmPassword;
  }

  isAdmin() {
    return this.role === USERTYPE.ADMIN;
  }
}

export default User;
