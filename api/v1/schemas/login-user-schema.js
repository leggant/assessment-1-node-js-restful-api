import { body, oneOf, check } from "express-validator";

const LoginSchema = [
  oneOf([
    check("userName")
      .exists({ checkFalsy: true, checkNull: true })
      .escape()
      .trim()
      .isAlphanumeric()
      .isLength({ min: 5, max: 10 })
      .withMessage("Username Must Be Between 5 and 10 characters"),
    check("email")
      .exists({ checkFalsy: true, checkNull: true })
      .escape()
      .trim()
      .isEmail()
      .normalizeEmail(),
  ]),
  body("password")
    .trim()
    .isStrongPassword({ minLength: 8, minNumbers: 1, minSymbols: 1 })
    .withMessage(
      "Password must have at least 8 characters, one number and one special character",
    )
    .isLength({ min: 8, max: 16 })
    .withMessage("Password must be 8 char min and 16 char max lengths")
    .notEmpty({ ignore_whitespace: true })
    .withMessage("A Password is Required."),
];

export default LoginSchema;
