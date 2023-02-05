import jwt from "jsonwebtoken";
import PRISMA from "../../../utils/prisma.js";
import USERTYPE from "../constants/userType.js";
import checkDataType from "../../../utils/checkDataType.js";

const mwTokenValid = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader.split(" ")[1];
    const checkBlockedToken = await PRISMA.blockedToken.findUnique({
      where: { token },
    });
    let type = checkDataType(checkBlockedToken);
    /**
     * if the type is an object then a value has been found
     * and the request should be blocked, the user has an invalid token
     */
    if (type === "object") {
      return res.status(403).json({
        msg: "Authentication Token Is Invalid.",
      });
    }

    /**
     * if the data type is not an object, it will be null
     * next get the token payload
     */
    const tokenPayload = jwt.verify(token, process.env.JWT_SECRET);

    /**
     * check if the user assigned the token is a basic user type by comparing the role
     * provided in the token.
     * if true, then get request the database blockedUser table to see if the
     * users id (uid) has been added by an admin user.
     * if this is the case, any token issued to this basic user
     * within the last hour will still be valid
     */
    if (tokenPayload.role === USERTYPE.BASIC) {
      const checkBlockedUser = await PRISMA.blockedUser.findFirst({
        where: { uid: tokenPayload.id },
      });
      type = checkDataType(checkBlockedUser);
      /**
       * check the return value, if null the request can continue;
       * if the type is an object then a value has been found
       * and the request should be blocked, the user has been deleted by an admin
       * within the last hour
       */
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
