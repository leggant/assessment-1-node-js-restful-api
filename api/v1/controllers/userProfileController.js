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

const ctGetUser = async (req, res) => {
  try {
    const query = req.profileQuery;
    // user can either be a string, or an object with a single key value pair
    let type = checkDataType(query);
    const queryById = type === "string";
    const userData = await (async () => {
      const data = queryById
        ? await getSingleUserById(query)
        : await getSingleUserByParam(query);
      const datares = await data;
      return datares;
    })();
    type = checkDataType(userData);
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

const ctGetAllUsers = async (req, res) => {
  console.log("Hit get all users");
};

const ctUpdateUser = async (req, res) => {
  try {
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
        .json({ msg: "Request User Could Not Be Found/Could Not Be Deleted." });
    }
    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export { ctGetUser, ctGetAllUsers, ctUpdateUser, ctDeleteUser };
