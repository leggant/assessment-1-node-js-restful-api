import PRISMA from "../../../utils/prisma.mjs";
import { getUsers } from "../../../utils/axiosRequests.mjs";

const seedUsers = async (req, res) => {
  const deleteUsers = await PRISMA.user.deleteMany({});
  console.log(deleteUsers);
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
    .then(() => console.info("[SEED] Successfully created user records"))
    .catch((e) => console.error("[SEED] Failed to create user records", e));
};

// eslint-disable-next-line import/prefer-default-export
export { seedUsers };
