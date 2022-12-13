import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import PRISMA from "../../../utils/prisma.mjs";

const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      email,
      password,
      role,
      profileImgURL,
    } = req.body;

    let user = await PRISMA.user.findFirst({
      where: {
        email: {
          contains: email,
        },
        userName: {
          contains: userName,
        },
      },
    });

    if (user) {
      return res
        .status(409)
        .json({ msg: `${firstName} ${lastName} already exists. Please Login` });
    }

    /**
     * Validate the users input data
     */

    /**
     * A salt is random bits added to a password before it is hashed. Salts
     * create unique passwords even if two users have the same passwords
     */
    const salt = await bcryptjs.genSalt();

    /**
     * Generate a hash for a given string. The first argument
     * is a string to be hashed, i.e., Pazzw0rd123 and the second
     * argument is a salt, i.e., E1F53135E559C253
     */
    const hashedPassword = await bcryptjs.hash(password, salt);

    user = await PRISMA.user.create({
      data: {
        firstName,
        lastName,
        userName,
        email,
        password: hashedPassword,
        role,
        profileImgURL,
      },
    });

    /**
     * Delete the password property from the user object. It
     * is a less expensive operation than querying the User
     * table to get only user's email and name
     */
    delete user.password;

    return res.status(201).json({
      msg: `${userName} - successfully registered`,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, userName } = req.body;
    const user = await PRISMA.user.findFirst({
      where: {
        email: {
          contains: email,
        },
        userName: {
          contains: userName,
        },
      },
    });

    if (!user) {
      const errorMessage = email ? "Invalid Email" : "Invalid Username";
      return res.status(401).json({ msg: errorMessage });
    }

    /**
     * Compare the given string, i.e., Pazzw0rd123, with the given
     * hash, i.e., user's hashed password
     */
    const isPasswordCorrect = await bcryptjs.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    const { JWT_SECRET, JWT_LIFETIME } = process.env;

    /**
     * Return a JWT. The first argument is the payload, i.e., an object containing
     * the authenticated user's id and name, the second argument is the secret
     * or public/private key, and the third argument is the lifetime of the JWT
     */
    const token = jwt.sign(
      {
        id: user.id,
        userName: user.userName,
      },
      JWT_SECRET,
      { expiresIn: JWT_LIFETIME },
    );
    const datefmt = new Intl.RelativeTimeFormat("en-nz");
    const expiryTime = new Date(
      new Date().setHours(new Date().getHours() + 1),
    ).toLocaleTimeString(datefmt);
    const expiryDate = new Date(
      new Date().setHours(new Date().getHours() + 1),
    ).toLocaleDateString(datefmt);

    return res.status(200).json({
      msg: `${user.userName} - successfully logged in`,
      token,
      expiresAt: `${expiryDate}-${expiryTime}`,
    });
  } catch (err) {
    return res.status(500).json({
      msg: err.message,
    });
  }
};

export { register, login };
