import USERTYPE from "../constants/userType.js";
import checkIfObjectIsEmpty from "../../../utils/checkEmptyObject.js";

const mwUserProfileQuery = (req, res, next) => {
  try {
    const id = req.user.id;
    const isAdmin = req.user.role === USERTYPE.ADMIN;
    const isBasic = req.user.role === USERTYPE.BASIC;
    const queryAdminUserOnly = checkIfObjectIsEmpty(req.params);
    if (isBasic || (isAdmin && queryAdminUserOnly)) {
      // only allowed to query their own data
      // request user by id in req.user.id
      req.profileQuery = id;
    } else if (isAdmin && !queryAdminUserOnly) {
      // a query param has been used in the request
      // this is used to query a user other than the current
      // admin user that is authenticated
      // check which param has been provided in the query
      req.profileQuery = req.params;
    }
    return next();
  } catch (error) {
    return res.status(404).json({ msg: "Error querying user profile data" });
  }
};

export default mwUserProfileQuery;
