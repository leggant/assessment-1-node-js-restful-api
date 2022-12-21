import PRISMA from "../../../utils/prisma.mjs";
import checkDataType from "../../../utils/checkDataType.js";

import {
  getSingleUserById,
  getSingleUserByParam,
  updateById,
  deleteUserById,
  deleteUserByParam,
  clearBlockedTokens,
} from "../../../utils/userRequests.mjs";

const PRISMAX = PRISMA.user;

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
        firstName: userData.firstName,
        lastName: userData.lastName,
        userName: userData.userName,
        email: userData.email,
        profileImageURL: userData.profileImgURL,
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
    const type = `user: ${user.userName}`;
    return await updateById(PRISMAX, user.id, updates, res, type);
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
        : await deleteUserByParam(token, query);
      const datares = await data;
      return datares;
    })();
    const cleared = await clearBlockedTokens();
    console.log("expired/deleted tokens deleted: ", cleared);
    if (!reqStatus) {
      return res.status(404).json({ msg: "User Not Found/Was Not Deleted." });
    }
    return res.status(200).json({ msg: "User Deleted Successfully" });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export { ctGetUser, ctGetAllUsers, ctUpdateUser, ctDeleteUser };
