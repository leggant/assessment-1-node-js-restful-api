import USERTYPE from "../constants/userType.js";

const mwAdminUser = (req, res, next) => {
  try {
    const isAdmin = req.user.role === USERTYPE.ADMIN;
    if (!isAdmin) {
      // user is not an admin
      return res.status(401).json({ msg: "Admin Only: Request not permitted" });
    }
    // user is an admin
    return next();
  } catch (error) {
    return res.status(500).json({ msg: "Request: Error Occurred" });
  }
};

export default mwAdminUser;
