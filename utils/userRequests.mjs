import bcryptjs from "bcryptjs";
import PRISMA from "./prisma.mjs";

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

const deleteById = async (PRISMAX, id, res, type) => {
  try {
    const result = await PRISMAX.findUnique({
      where: { id },
    });
    if (!result) {
      return res
        .status(200)
        .json({ msg: `No ${type} with the id: ${id} found` });
    }

    await PRISMAX.delete({
      where: { id },
    });

    return res.json({
      msg: `${type} with the id: ${id} successfully deleted`,
    });
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
  deleteById,
};
