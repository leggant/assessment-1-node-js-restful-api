import { body } from "express-validator";
import USERTYPE from "../constants/userType.js";

const registerSchema = [
  body("firstName")
    .escape()
    .trim()
    .isAlpha()
    .withMessage("First Name Must Only Contain Letters")
    .isLength({ min: 2, max: 50 })
    .withMessage("First Name Must Be Between 2 and 50 characters")
    .notEmpty()
    .withMessage("First Name Is Required"),
  body("lastName")
    .escape()
    .trim()
    .isAlpha()
    .withMessage("Last Name Must Only Contain Letters")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last Name Must Be Between 2 and 50 characters")
    .notEmpty()
    .withMessage("Last Name Is Required"),
  body("userName")
    .escape()
    .trim()
    .isAlphanumeric()
    .isLength({ min: 5, max: 10 })
    .withMessage("Username Must Be Between 5 and 10 characters")
    .notEmpty()
    .withMessage("Username Is Required"),
  body("email")
    .escape()
    .trim()
    .isEmail()
    .normalizeEmail()
    .notEmpty()
    .withMessage("Email Is Required")
    .custom((emailVal, { req }) => {
      if (!emailVal.startsWith(req.body.userName.toLowerCase())) {
        throw new Error("Email must begin with the Username");
      }
      return true;
    }),
  body("role")
    .escape()
    .trim()
    .isIn([USERTYPE.ADMIN, USERTYPE.BASIC])
    .withMessage("User Role Must Be A Valid Type")
    .notEmpty()
    .withMessage("User Role Is Required"),
  body("password")
    .escape()
    .trim()
    .isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1 })
    .withMessage(
      "Password must have at least 8 characters, one number and one special character",
    )
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 char min and 16 char max lengths"),
  body("confirmPassword")
    .escape()
    .trim()
    .isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1 })
    .withMessage(
      "Confirmation Password must have at least 8 characters, one number and one special character",
    )
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 char min and 16 char max lengths")
    .custom((pass, { req }) => {
      if (pass !== req.body.password) {
        throw new Error("Password and Confirmation Password Mismatch");
      }
      return true;
    }),
  body("profileImgURL")
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      allow_underscores: true,
    }),
];

export default registerSchema;
