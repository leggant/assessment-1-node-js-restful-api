import PRISMA from "../../../utils/prisma.mjs";
import { getUsers } from "../../../utils/axiosRequests.mjs";

const seedUsers = async (req, res) => {
  const deleteUsers = await PRISMA.user.deleteMany({});
  console.info(`[SEED] ${deleteUsers.count} user records deleted.`);
  const USERDATA = await getUsers();
  Promise.all(
    USERDATA.users.map((user) => {
      const createusers = PRISMA.user.create({
        data: {
          firstName: user.firstName,
          lastName: user.lastName,
          userName: user.userName,
          email: user.email,
          password: user.password,
          role: user.role,
          profileImgURL: "",
        },
      });
      return createusers;
    }),
  )
    .then((data) => {
      const count = Object.keys(data).length;
      console.info(`[SEED] ${count} user records successfully created`);
      res
        .status(201)
        .json({ msg: `[SEED] ${count} user records successfully created` });
    })
    .catch((e) => {
      console.error("[SEED] Failed to create user records", e);
      res.status(401).json({ msg: "[SEED] Failed to create user records" });
    });
};

// eslint-disable-next-line import/prefer-default-export
export { seedUsers };
