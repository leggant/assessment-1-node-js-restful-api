/**
 * User Related API Request Handler Methods
 * @module userRequests
 */
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import PRISMA from "./prisma.mjs";
import checkDataType from "./checkDataType.js";
import checkIfObjectIsEmpty from "./checkEmptyObject.js";
import USERTYPE from "../api/v1/constants/userType.js";
/**
 * API User Get Request Response Object
 * @typedef {Object} UserQuery
 * @property {string} firstName - User first name
 * @property {string} lastName - User last name
 * @property {string} userName - Users unique username
 * @property {string} email - Users unique email address
 * @property {string} profileImgURL - Users unique profile image link
 */
/**
 * Get a single user queried by user ID string
 * @function getSingleUserById
 * @param {string} id user id (UUID) string
 * @async
 * @returns {UserQuery}
 */
const getSingleUserById = async (id) => {
  const response = await PRISMA.user.findUnique({
    where: { id },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      userName: true,
      profileImgURL: true,
    },
  });
  return response;
};
const getSingleUserByParam = async (params) => {
  const search = Object.values(params);
  const response = await PRISMA.user.findFirstOrThrow({
    where: {
      OR: [
        {
          userName: {
            contains: search[1],
          },
        },
        {
          email: {
            contains: search[1],
          },
        },
      ],
    },
    select: {
      firstName: true,
      lastName: true,
      userName: true,
      email: true,
      profileImgURL: true,
    },
  });
  return response;
};

const updateUserById = async (userReq, data) => {
  const user = await PRISMA.user.findFirstOrThrow({
    where: { id: userReq.id },
  });
  const salt = data.password ? await bcryptjs.genSalt() : null;
  const hashedPassword = salt
    ? await bcryptjs.hash(data.password, salt)
    : user.password;
  const filteredData = data.confirmPassword
    ? Object.fromEntries(
        Object.entries(data).filter(
          ([key]) => !key.includes("confirmPassword"),
        ),
      )
    : data;
  const updateRes = await PRISMA.user.update({
    where: { id: userReq.id },
    select: {
      firstName: true,
      lastName: true,
      userName: true,
      email: true,
      password: true,
      profileImgURL: true,
    },
    data: {
      ...filteredData,
      password: hashedPassword,
    },
  });
  const resTypeOfData = checkDataType(updateRes);
  const resOk = resTypeOfData === "object";
  if (resOk) {
    updateRes.password = "#############################";
    return updateRes;
  }
  return resOk;
};

const updateUserByParam = async (params, data) => {
  const search = Object.values(params);
  const userSearch = await PRISMA.user.findFirstOrThrow({
    where: {
      OR: [
        {
          userName: {
            contains: search[1],
          },
        },
        {
          email: {
            contains: search[1],
          },
        },
      ],
    },
  });
  if (userSearch.role === USERTYPE.ADMIN) {
    return false;
  }
  const user = await PRISMA.user.update({
    where: {
      id: userSearch.id,
    },
    data: {
      userName: data.userName || undefined,
      email: data.email || undefined,
      role: data.role || undefined,
    },
  });
  const resTypeOfData = checkDataType(user);
  const resOk = resTypeOfData === "object";
  return resOk;
};

const deleteUserById = async (token, id) => {
  const user = await PRISMA.user.findFirst({
    where: { id },
  });
  let resTypeOfData = checkDataType(user);
  let resOk = resTypeOfData === "object" && !checkIfObjectIsEmpty(user);
  const deleteReq = resOk
    ? await PRISMA.user.delete({
        where: { id },
      })
    : null;
  resTypeOfData = checkDataType(deleteReq);
  resOk = resTypeOfData === "object";
  const userData = jwt.verify(token, process.env.JWT_SECRET);
  if (resOk) {
    const expireToken = await PRISMA.blockedToken.create({
      data: {
        token,
        exp: userData.exp,
      },
    });
    resTypeOfData = checkDataType(expireToken);
    resOk = resTypeOfData === "object";
    return resOk;
  }
  return resOk;
};

const deleteUserByParam = async (token, params) => {
  const search = Object.values(params);
  const userSearch = await PRISMA.user.findFirstOrThrow({
    where: {
      OR: [
        {
          userName: {
            contains: search[1],
          },
        },
        {
          email: {
            contains: search[1],
          },
        },
      ],
    },
  });
  if (userSearch.role === USERTYPE.ADMIN) {
    return false;
  }
  const user = await PRISMA.user.delete({
    where: {
      id: userSearch.id,
    },
  });
  let resTypeOfData = checkDataType(user);
  let resOk = resTypeOfData === "object";
  if (resOk) {
    const invalidBasicUser = await PRISMA.blockedUser.create({
      data: {
        uid: userSearch.id,
        exp: Date.now(),
      },
    });
    resTypeOfData = checkDataType(invalidBasicUser);
    resOk = resTypeOfData === "object";
    return resOk;
  }
  return resOk;
};

const clearBlockedTokens = async () => {
  const deleteBlockedTokens = await PRISMA.blockedToken.findMany({
    where: {
      exp: {
        lte: Date.now() - 3600000,
      },
    },
    select: {
      token: true,
    },
  });
  if (deleteBlockedTokens.length) {
    const clearAll = await PRISMA.blockedToken.deleteMany({
      where: {
        token: {
          in: deleteBlockedTokens[0].token,
        },
      },
    });
    return clearAll.count;
  }
  return 0;
};

const clearBlockedUsers = async () => {
  const deleteBlockedUsers = await PRISMA.blockedUser.findMany({
    where: {
      exp: {
        lte: Date.now() - 3600000,
      },
    },
    select: {
      uid: true,
    },
  });
  if (deleteBlockedUsers.length) {
    const clearAll = await PRISMA.blockedUser.deleteMany({
      where: {
        uid: {
          in: deleteBlockedUsers[0].uid,
        },
      },
    });
    return clearAll.count;
  }
  return 0;
};

const getAllUsers = async (PRISMAX, res, req, type, includes) => {
  try {
    let data;
    if (includes) {
      data = await PRISMAX.findMany({
        include: {
          ...includes,
        },
      });
    } else {
      data = await PRISMAX.findMany();
    }
    if (data.length === 0) {
      return res.status(200).json({ msg: `No ${type}s found` });
    }
    return res.json({ data });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export {
  getSingleUserById,
  getSingleUserByParam,
  getAllUsers,
  updateUserById,
  updateUserByParam,
  deleteUserById,
  deleteUserByParam,
  clearBlockedTokens,
  clearBlockedUsers,
};
