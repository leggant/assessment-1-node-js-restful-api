import crypto from "crypto";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import PRISMA from "../../../utils/prisma.js";
import { getUsers } from "../../../utils/axiosRequests.js";

const seedUsers = async (req, res) => {
  const USERDATA = await getUsers();
  const userNames = USERDATA.users.map(({ userName }) => userName);
  const deleteUsers = await PRISMA.user.deleteMany({
    where: {
      userName: {
        in: userNames,
      },
    },
  });
  console.info(`[SEED] ${deleteUsers.count} user records deleted.`);
  Promise.all(
    USERDATA.users.map(async (user) => {
      const random = crypto.randomBytes(15).toString("hex");
      const salt = await bcryptjs.genSalt();
      const hashedPassword = await bcryptjs.hash(user.password, salt);
      const imageurl = `https://avatars.dicebear.com/api/human/:${random}.svg?radius=50&size=200`;
      const createusers = PRISMA.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          password: hashedPassword,
          role: user.role,
          profileImgURL: imageurl,
        },
      });
      return createusers;
    }),
  )
    .then((data) => {
      const count = Object.keys(data).length;
      console.info(`[SEED] ${count} user records successfully created`);
      return res
        .status(201)
        .json({ msg: `[SEED] ${count} user records successfully created` });
    })
    .catch((e) => {
      console.error("[SEED] Failed to create user records", e);
      return res
        .status(401)
        .json({ msg: "[SEED] Failed to create user records", e });
    });
};

// eslint-disable-next-line import/prefer-default-export
export { seedUsers };
