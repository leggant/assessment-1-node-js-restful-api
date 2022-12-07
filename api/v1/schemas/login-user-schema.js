import { body } from "express-validator";

const LoginSchema = [
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
  body("password")
    .escape()
    .trim()
    .isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1 })
    .withMessage(
      "Password must have at least 8 characters, one number and one special character",
    )
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 char min and 16 char max lengths"),
];

export default LoginSchema;
