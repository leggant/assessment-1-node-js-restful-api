import { getById } from "../../../utils/userRequests.mjs";
import PRISMA from "../../../utils/prisma.mjs";

export default async function mwUser(req, res, next) {
  const PRISMAX = PRISMA.user;
  const id = req.user.id;
  const data = await getById(PRISMAX, id, res, "user");
  req.userData = data;
  return next();
}
