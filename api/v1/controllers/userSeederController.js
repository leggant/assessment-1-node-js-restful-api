import crypto from "crypto";
import bcryptjs from "bcryptjs";
import PRISMA from "../../../utils/prisma.js";
import { getUsers } from "../../../utils/axiosRequests.js";

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/create
const dataGenerator = {
  imageurl: () => {
    const random = crypto.randomBytes(15).toString("hex");
    const imageurl = `https://avatars.dicebear.com/api/human/:${random}.svg?radius=50&size=200`;
    return imageurl;
  },
  hashedPassword: async (password) => {
    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);
    return hashedPassword;
  },
};

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
    Array.from(USERDATA.users).map(async (user) => ({
      firstName: user.firstName,
      lastName: user.lastName,
      userName: user.userName,
      email: user.email,
      password: await dataGenerator.hashedPassword(user.password),
      role: user.role,
      profileImgURL: await dataGenerator.imageurl(),
    })),
  ).then(async (userDataMap) => {
    await PRISMA.user
      .createMany({
        data: userDataMap,
      })
      .then((userSeederRes) => {
        console.info(
          `[SEED] ${userSeederRes.count} user records successfully created`,
        );
        return res.status(201).json({
          msg: `[SEED] ${userSeederRes.count} user records successfully created`,
        });
      })
      .catch((e) => {
        console.error("[SEED] Failed to create user records", e);
        return res
          .status(401)
          .json({ msg: "[SEED] Failed to create user records", e });
      });
  });
};

// eslint-disable-next-line import/prefer-default-export
export { seedUsers };
