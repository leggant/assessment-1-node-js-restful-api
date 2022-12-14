import {
  getSingleUserById,
  getSingleUserByParam,
} from "../../../utils/userRequests.mjs";
import PRISMA from "../../../utils/prisma.mjs";
import USERTYPE from "../constants/userType.js";
import checkIfObjectIsEmpty from "../../../utils/checkEmptyObject.js";

export default async function mwUser(req, res, next) {
  const PRISMAX = PRISMA.user;
  try {
    const id = req.user.id;
    if (req.user.role === USERTYPE.BASIC) {
      // only allowed to query their own data
      // request user by id in req.user.id
      const data = await getSingleUserById(PRISMAX, res, req, null, id, "user");
      req.userData = data;
    } else if (req.user.role === USERTYPE.ADMIN) {
      const queryAuthenticatedAdminUser = checkIfObjectIsEmpty(req.params);
      if (queryAuthenticatedAdminUser) {
        const data = await getSingleUserById(
          PRISMAX,
          res,
          req,
          null,
          id,
          "user",
        );
        req.userData = data;
      } else {
        // a query param has been used in the request
        // this is used to query a user other than the current
        // admin user that is authenticated
        // check which param has been provided in the query
        const queryUserName = req.params.userName ? req.params.userName : null;
        const queryEmail = req.params.email ? req.params.email : null;
        const queryId = req.params.id ? req.params.id : null;
        // if no query param used, assume the admin user
        // is running a query on their own account profile
        console.log(req.user);
        console.log(req.params);
        console.log(queryEmail);
        const data = await getSingleUserByParam(
          PRISMAX,
          res,
          req,
          null,
          id,
          "user",
        );
        req.userData = data;
      }
    }
  } catch (error) {
    console.log(error);
  }
  return next();
}
