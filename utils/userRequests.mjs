import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import PRISMA from "./prisma.mjs";
import checkDataType from "./checkDataType.js";
import checkIfObjectIsEmpty from "./checkEmptyObject.js";

const getSingleUserById = async (id = "") => {
  const response = await PRISMA.user.findUnique({
    where: { id },
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
  });
  return response;
};

const deleteUserById = async (token, id = "") => {
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
  const user = await PRISMA.user.delete({
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
  let resTypeOfData = checkDataType(user);
  let resOk = resTypeOfData === "object";
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

const clearBlockedTokens = async () => {
  const deleteBlockedTokens = await PRISMA.blockedToken.findMany({
    where: {
      exp: {
        gte: Date.now(),
      },
    },
  });
  if (deleteBlockedTokens.length) {
    const clearAll = await PRISMA.blockedToken.deleteMany({
      where: {
        id: {
          in: deleteBlockedTokens,
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

const createNew = async (PRISMAX, data, res, type, includes) => {
  try {
    await PRISMAX.create({
      data,
    });
    let updatedData;
    if (includes) {
      updatedData = await PRISMAX.findMany({
        include: {
          ...includes,
        },
      });
    } else {
      updatedData = await PRISMAX.findMany();
    }
    return res.status(201).json({
      msg: `${type} successfully created`,
      data: updatedData,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const updateById = async (PRISMAX, id, data, res, type) => {
  let response;
  try {
    response = await PRISMAX.findUnique({
      where: { id },
    });
    if (!response) {
      return res
        .status(200)
        .json({ msg: `No ${type} with the id: ${id} found` });
    }
    // https://bobbyhadz.com/blog/javascript-check-if-object-is-empty
    if (Object.keys(data).length === 0) {
      return res.status(200).json({ msg: "No data provided in the request." });
    }
    const salt = data.password ? await bcryptjs.genSalt() : null;
    const hashedPassword = salt
      ? await bcryptjs.hash(data.password, salt)
      : null;
    response = await PRISMAX.update({
      where: { id },
      data: {
        firstname: data.firstname || undefined,
        lastName: data.lastName || undefined,
        userName: data.userName || undefined,
        email: data.email || undefined,
        password: hashedPassword || undefined,
        role: data.role || undefined,
        profileImgURL: data.profileImgURL || undefined,
      },
    });
    return res.status(200).json({ msg: "User Successfully Updated." });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export {
  createNew,
  getSingleUserById,
  getSingleUserByParam,
  getAllUsers,
  updateById,
  deleteUserById,
  deleteUserByParam,
  clearBlockedTokens,
};
