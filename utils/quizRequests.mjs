/**
 * Quiz Related API Request Handler Methods
 * @module quizRequests
 */
const getById = async (PRISMAX, id, res, type, includes) => {
  try {
    let response;
    if (includes) {
      response = await PRISMAX.findUnique({
        where: { id: Number(id) },
        include: {
          ...includes,
        },
      });
    } else {
      response = await PRISMAX.findUnique({
        where: { id: Number(id) },
      });
    }
    if (!response) {
      return res
        .status(200)
        .json({ msg: `No ${type} with the id: ${id} found` });
    }
    return res.json({ data: response });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const getAll = async (PRISMAX, res, type, includes) => {
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
  try {
    let result = await PRISMAX.findUnique({
      where: { id: Number(id) },
    });
    if (!result) {
      return res
        .status(200)
        .json({ msg: `No ${type} with the id: ${id} found` });
    }
    result = await PRISMAX.update({
      where: { id: Number(id) },
      data,
    });
    return res.json({
      msg: `${type} with the id: ${id} successfully updated`,
      data: result,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const deleteById = async (PRISMAX, id, res, type) => {
  try {
    const result = await PRISMAX.findUnique({
      where: { id: Number(id) },
    });
    if (!result) {
      return res
        .status(200)
        .json({ msg: `No ${type} with the id: ${id} found` });
    }

    await PRISMAX.delete({
      where: { id: Number(id) },
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

export { createNew, getAll, getById, updateById, deleteById };
