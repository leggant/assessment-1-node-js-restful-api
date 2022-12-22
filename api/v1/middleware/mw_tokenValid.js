import jwt from "jsonwebtoken";
import PRISMA from "../../../utils/prisma.mjs";
import checkDataType from "../../../utils/checkDataType.js";
import USERTYPE from "../constants/userType.js";

const mwTokenValid = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const checkBlockedToken = await PRISMA.blockedToken.findFirst({
      where: { token },
    });
    let type = checkDataType(checkBlockedToken);
    if (type === "object") {
      return res.status(403).json({
        msg: "Authentication Token Is Invalid.",
      });
    }
    // if the data type is not an object, it will be null
    // next get the token payload
    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);
    // check: is the user associated with the token a basic user
    // and is this basic user in the BlockedUsers
    // table i.e deleted by Admin User
    // if this is the case, any token issued to this basic user
    // within the last hour will still be valid
    if (tokenPayload.role === USERTYPE.BASIC) {
      const checkBlockedUser = await PRISMA.blockedUser.findFirst({
        where: { uid: tokenPayload.id },
      });
      type = checkDataType(checkBlockedUser);
      if (type === "object") {
        return res.status(403).json({
          msg: "Account Suspended/Deleted By Admin",
        });
      }
    }
    return next();
  } catch (error) {
    return res.status(403).json({
      msg: "Not authorized to access this route",
    });
  }
};

export default mwTokenValid;
