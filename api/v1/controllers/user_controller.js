import PRISMA from "../../../utils/prisma.mjs";
import { updateById } from "../../../utils/userRequests.mjs";

const PRISMAX = PRISMA.user;

const getUser = (req, res) => {
  try {
    const user = req.userData;
    return res.status(200).json({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName,
        email: user.email,
        profileImageURL: user.profileImgURL,
      },
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = req.user;
    const updates = req.body;
    const oldData = req.userData;
    const type = `user: ${user.userName}`;
    return await updateById(PRISMAX, user.id, updates, res, type);
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const deleteUser = async (req, res) => {
  console.log("hit DeleteUserData");
  try {
    const { userName, email } = req.body;
    return res.status(201).json({
      msg: `${userName} - successfully registered`,
      data: email,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};
// const getUserScores = async (req, res) => {
//   try {
//     const { userName, email } = req.body;

//     let user = await PRISMA.user.findFirst({
//       where: {
//         email: {
//           contains: email,
//         },
//         userName: {
//           contains: userName,
//         },
//       },
//     });

//     if (user) {
//       return res
//         .status(409)
//         .json({ msg: `${userName} already exists. Please Login` });
//     }

//     /**
//      * Validate the users input data
//      */

//     /**
//      * A salt is random bits added to a password before it is hashed. Salts
//      * create unique passwords even if two users have the same passwords
//      */

//     /**
//      * Generate a hash for a given string. The first argument
//      * is a string to be hashed, i.e., Pazzw0rd123 and the second
//      * argument is a salt, i.e., E1F53135E559C253
//      */

//     user = await PRISMA.user.create({
//       data: {
//         userName,
//         email,
//       },
//     });

//     /**
//      * Delete the password property from the user object. It
//      * is a less expensive operation than querying the User
//      * table to get only user's email and name
//      */
//     delete user.password;

//     return res.status(201).json({
//       msg: `${userName} - successfully registered`,
//       data: user,
//     });
//   } catch (err) {
//     return res.status(500).json({
//       msg: err.message,
//     });
//   }
// };
export { getUser, updateUser, deleteUser };
