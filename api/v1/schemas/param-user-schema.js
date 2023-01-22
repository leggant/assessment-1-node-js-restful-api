import { param } from "express-validator";

const UserParamSchema = [
  param("userId")
    .escape()
    .trim()
    .notEmpty()
    .withMessage("User ID is a required param")
    .isString()
    .withMessage("User ID must be a string")
    .toString(),
];

export default UserParamSchema;
