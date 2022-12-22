import { body, check } from "express-validator";
import USERTYPE from "../constants/userType.js";

const UpdateSchema = [
  body("firstName")
    .optional({ nullable: true })
    .escape()
    .trim()
    .isAlpha()
    .withMessage("First Name Must Only Contain Letters")
    .isLength({ min: 2, max: 50 })
    .withMessage("First Name Must Be Between 2 and 50 characters"),
  body("lastName")
    .optional({ nullable: true })
    .escape()
    .trim()
    .isAlpha()
    .withMessage("Last Name Must Only Contain Letters")
    .isLength({ min: 2, max: 50 })
    .withMessage("Last Name Must Be Between 2 and 50 characters"),
  body("userName")
    .optional({ nullable: true })
    .escape()
    .trim()
    .isAlphanumeric()
    .withMessage("Username Cannot Contain Special Characters")
    .isLength({ min: 5, max: 10 })
    .withMessage("Username Must Be Between 5 and 10 characters"),
  body("email")
    .optional({ nullable: true })
    .escape()
    .trim()
    .isEmail()
    .withMessage("Email Must Be Valid")
    .normalizeEmail()
    .custom((emailVal, { req }) => {
      if (!emailVal.startsWith(req.body.userName.toLowerCase())) {
        throw new Error("Email must begin with the Username");
      }
      return true;
    }),
  body("role")
    .optional({ nullable: true })
    .escape()
    .trim()
    .isIn([USERTYPE.ADMIN, USERTYPE.BASIC])
    .withMessage("User Role Must Be A Valid Type"),
  body("password")
    .optional({ nullable: true })
    .escape()
    .trim()
    .isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1 })
    .withMessage(
      "Password must have at least 8 characters, one number and one special character",
    )
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 char min and 16 char max lengths"),
  body("confirmPassword")
    .optional({ nullable: true })
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
    .optional({ nullable: true })
    .trim()
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
      allow_underscores: true,
    })
    .withMessage("URL Must be Valid."),
];

export default UpdateSchema;
