import moment from "moment";
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

const BASICTESTUSER1 = {
  firstName: "Jane",
  lastName: "Doe",
  email: "jednz003@op.ac.nz",
  userName: "jednz003",
  role: USERTYPE.BASIC,
  password: "Yogi##@4tdfgx",
  confirmPassword: "Yogi##@4tdfgx",
  profileImgURL: "https://testuser.me/api/portraits/women/6.jpg",
};

const BASICTESTUSER2 = {
  firstName: "Bella",
  lastName: "Legg",
  email: "bellanz03@op.ac.nz",
  userName: "bellanz03",
  role: USERTYPE.BASIC,
  password: "Yogi##@4tdfg",
  confirmPassword: "Yogi##@4tdfg",
  profileImgURL: "https://testuser.me/api/portraits/women/20.jpg",
};

const validTestDate = () => {
  const date = moment().toDate();
  const newdate = moment(date).format("Y-MM-DD");
  const testStart = moment(date).add(1, "days").format("Y-MM-DD");
  const testEnd = moment(date).add(3, "days").format("Y-MM-DD");
  return { newdate, testStart, testEnd };
};

const invalidTestDate = () => {
  const date = moment().toDate();
  const newdate = moment(date).format("Y-MM-DD");
  const testStart = moment(date).subtract(10, "days").format("Y-MM-DD");
  const testEnd = moment(date).add(13, "days").format("Y-MM-DD");
  return { newdate, testStart, testEnd };
};

const TESTQUIZZES = [
  {
    categoryId: 12,
    name: "Yogis Quiz Test",
    difficulty: QUIZCONSTS.LEVEL.EASY,
    answerType: QUIZCONSTS.ANSTYPE.MULTI,
    numQuestions: 10,
    startDate: validTestDate().testStart,
    endDate: validTestDate().testEnd,
  },
  {
    categoryId: 22,
    name: "Yogis Quiz Test #1",
    difficulty: QUIZCONSTS.LEVEL.HARD,
    answerType: QUIZCONSTS.ANSTYPE.TRUEFALSE,
    numQuestions: 10,
    startDate: validTestDate().testStart,
    endDate: validTestDate().testEnd,
  },
  {
    categoryId: 13,
    name: "Yogis Quiz Test #2",
    difficulty: QUIZCONSTS.LEVEL.MED,
    answerType: QUIZCONSTS.ANSTYPE.MULTI,
    numQuestions: 10,
    startDate: invalidTestDate().testStart,
    endDate: invalidTestDate().testEnd,
  },
  {
    categoryId: 9,
    name: "Yogis Quiz Test #3",
    difficulty: QUIZCONSTS.LEVEL.EASY,
    answerType: QUIZCONSTS.ANSTYPE.MULTI,
    numQuestions: 10,
    startDate: invalidTestDate().testStart,
    endDate: invalidTestDate().testEnd,
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
  const userNames = [BASICTESTUSER1.userName, BASICTESTUSER2.userName];
  try {
    await PRISMA.user.deleteMany({
      where: {
        userName: {
          in: userNames,
        },
      },
    });
    return;
  } catch (err) {
    console.error(`User ${err.meta.cause}`);
  }
};

const deleteTestQuizzes = async () => {
  const quizNames = ["Yogis Updated Quiz Name"];
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
  validTestDate,
  ADMINTESTUSER,
  BASICTESTUSER1,
  BASICTESTUSER2,
  TESTQUIZZES,
};
