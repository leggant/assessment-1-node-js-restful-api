import PRISMA from "./prisma.js";
import USERTYPE from "../api/v1/constants/userType.js";
import QUIZCONSTS from "../api/v1/constants/quiz.js";

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

const TESTQUIZZES = [
  {
    categoryId: 22,
    name: "Yogis Quiz Test #1",
    difficulty: QUIZCONSTS.LEVEL.EASY,
    answerType: QUIZCONSTS.ANSTYPE.MULTI,
    numQuestions: 10,
    startDate: "2023-01-23",
    endDate: "2023-01-27",
  },
  {
    categoryId: 13,
    name: "Yogis Quiz Test #2",
    difficulty: QUIZCONSTS.LEVEL.EASY,
    answerType: QUIZCONSTS.ANSTYPE.MULTI,
    numQuestions: 10,
    startDate: "2023-01-23",
    endDate: "2023-01-27",
  },
  {
    categoryId: 9,
    name: "Yogis Quiz Test #3",
    difficulty: QUIZCONSTS.LEVEL.EASY,
    answerType: QUIZCONSTS.ANSTYPE.MULTI,
    numQuestions: 10,
    startDate: "2023-01-23",
    endDate: "2023-01-27",
  },
];

const deleteTestAdminUser = async () => {
  try {
    await PRISMA.user.delete({
      where: {
        userName: ADMINTESTUSER.userName,
      },
    });
    return;
  } catch (err) {
    console.error(`User ${err.meta.cause}`);
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
    console.error(`User ${err.meta.cause}`);
  }
};

const deleteTestQuizzes = async () => {
  const quizNames = [];
  TESTQUIZZES.forEach((x) => quizNames.push(x.name));
  try {
    await PRISMA.quiz.deleteMany({
      where: {
        name: {
          in: quizNames,
        },
      },
    });
    return;
  } catch (err) {
    console.error(`Quiz ${err.meta.cause}`);
  }
};

export {
  deleteTestAdminUser,
  deleteTestBasicUser,
  deleteTestQuizzes,
  ADMINTESTUSER,
  BASICTESTUSER,
  TESTQUIZZES,
};
