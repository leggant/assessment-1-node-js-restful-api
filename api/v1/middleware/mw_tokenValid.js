import PRISMA from "../../../utils/prisma.mjs";
import checkDataType from "../../../utils/checkDataType.js";

const mwTokenValid = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const checkBlockedToken = await PRISMA.blockedToken.findFirst({
      where: { token },
    });
    const type = checkDataType(checkBlockedToken);
    if (type === "object") {
      return res.status(403).json({
        msg: "Authentication Token Is Invalid.",
      });
    }
    return next();
  } catch (error) {
    return res.status(403).json({
      msg: "Not authorized to access this route",
    });
  }
};

export default mwTokenValid;
