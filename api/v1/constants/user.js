import USERTYPE from "./userType.js";

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
    this.role = userData.role;
  }

  validPassword() {
    return this.password === this.confirmPassword;
  }

  isAdmin() {
    return this.role === USERTYPE.ADMIN;
  }
}

export default User;
