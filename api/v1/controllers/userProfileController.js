import checkDataType from "../../../utils/checkDataType.js";
import {
  getSingleUserById,
  getSingleUserByParam,
  updateUserById,
  deleteUserById,
  deleteUserByParam,
  clearBlockedTokens,
  clearBlockedUsers,
} from "../../../utils/userRequests.js";

/**
 * Get user profile information through either the token provided in the request
 * for the current authenticated users data; or, if an admin, query a basic user
 * by their email or username values
 * @function ctGetUser
 * @async
 * @param {Request} req
 * @param {Response} res
 * @returns {Response} res
 */
const ctGetUser = async (req, res) => {
  try {
    /**
     * query is assigned data by the mw_userProfile middleware
     * which will provide the current users id as a string by default
     * If an admin uses this path with a query of another "basic" user
     * email or username, their token is first validated, if ok, the param is assigned
     * to the req.profileQuery as an object
     * @constant query
     * @type {string|{userName: string}|{email: string}}
     * @requires string|object
     */
    const query = req.profileQuery;
    /**
     * check if the data type of query is a string
     * ie. the current user is querying their own data
     * @constant {Boolean} queryById
     */
    const queryById = typeof query === "string";
    const userData = await (async () => {
      /**
       * if queryById is a string query user by id
       * otherwise query the user with the object email/username: string
       */
      const data = queryById
        ? await getSingleUserById(query)
        : await getSingleUserByParam(query);
      const datares = await data;
      /**
       * @returns {UserQuery}
       */
      return datares;
    })();
    const type = checkDataType(userData);
    const noData = type === "undefined" || type === null;
    if (noData) {
      return res.status(404).json({
        msg: "No User Profile Found",
      });
    }

    return res.status(200).json({
      data: {
        userData,
      },
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

/**
 * Get user profile information through either the token provided in the request
 * for the current authenticated users data; or, if an admin, query a basic user
 * by their email or username values
 * @function ctUpdateUser
 * @async
 * @param {Request} req
 * @param {Object} req.user - currently authenticated user data
 * @param {Object} req.body - user profile data to change
 * @param {Response} res - return update success status or an error output on failure
 * @returns {Response} res
 */
const ctUpdateUser = async (req, res) => {
  try {
    // eslint-disable-next-line prefer-destructuring
    const user = req.user;
    const updates = req.body;
    const updateRes = await updateUserById(user, updates);
    const ok = checkDataType(updateRes);
    if (ok === "boolean") {
      return res
        .status(400)
        .json({ msg: `Update Error ${user.userName} Update Not Completed.` });
    }
    return res
      .status(200)
      .json({ msg: `${updateRes.userName} Updated Successfully`, updateRes });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const ctDeleteUser = async (req, res) => {
  try {
    const query = req.profileQuery;
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    // user can either be a string, or an object with a single key value pair
    const type = checkDataType(query);
    const deleteWithId = type === "string";
    const reqStatus = await (async () => {
      const data = deleteWithId
        ? await deleteUserById(token, query)
        : await deleteUserByParam(token, query); // admin only
      const datares = await data;
      return datares;
    })();
    const clearedTokens = await clearBlockedTokens();
    const clearedUsers = await clearBlockedUsers();
    console.log("deleted invalid token count: ", clearedTokens);
    console.log("deleted invalid user count: ", clearedUsers);
    if (!reqStatus) {
      return res
        .status(404)
        .json({ msg: "Request User Could Not Be Found + Not Deleted." });
    }
    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export { ctGetUser, ctUpdateUser, ctDeleteUser };
