import PRISMA from "./prisma.js";
import USERTYPE from "../api/v1/constants/userType.js";

const ADMINTESTUSER = {
  firstName: "John",
  lastName: "Doe",
  email: "jdnz001@op.ac.nz",
  userName: "jdnz001",
  role: USERTYPE.ADMIN,
  password: "Yogi##@4tdfg",
  confirmPassword: "Yogi##@4tdfg",
  profileImgURL: "https://testuser.me/api/portraits/men/1.jpg",
};

const BASICTESTUSER = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jednz002@op.ac.nz",
  userName: "jednz002",
  role: USERTYPE.BASIC,
  password: "Yogi##@4tdfg",
  confirmPassword: "Yogi##@4tdfg",
  profileImgURL: "https://testuser.me/api/portraits/women/5.jpg",
};

// const createTestAdminUser = async () => {
//   try {
//     const adminUser = await PRISMA.user.create({
//       data: {
//         ADMINTESTUSER,
//       },
//     });
//     console.log(adminUser);
//     return;
//   } catch (err) {
//     console.log(err);
//   }
// };

const deleteTestAdminUser = async () => {
  try {
    await PRISMA.user.delete({
      where: {
        userName: ADMINTESTUSER.userName,
      },
    });
    return;
  } catch (err) {
    console.log(err);
  }
};
const deleteTestBasicUser = async () => {
  try {
    await PRISMA.user.delete({
      where: {
        userName: BASICTESTUSER.userName,
      },
    });
    return;
  } catch (err) {
    console.log(err);
  }
};

export {
  deleteTestAdminUser,
  deleteTestBasicUser,
  ADMINTESTUSER,
  BASICTESTUSER,
};
