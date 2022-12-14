-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC_USER', 'ADMIN_USER');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('easy', 'medium', 'hard');

-- CreateEnum
CREATE TYPE "AnswerType" AS ENUM ('boolean', 'multiple');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileImgURL" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'BASIC_USER',
    "userScoreId" INTEGER,
    "userParticipantId" INTEGER,
    "userQuestionAnswerId" INTEGER,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScore" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "UserScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserParticipant" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,

    CONSTRAINT "UserParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserQuestionAnswer" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "quizId" TEXT NOT NULL,
    "questionId" INTEGER NOT NULL,
    "correctAnswer" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserQuestionAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "quizId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "correctAnswer" TEXT NOT NULL,
    "incorrectAnswers" JSONB NOT NULL,
    "userQuestionAnswerId" INTEGER NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quiz" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "answerType" "AnswerType" NOT NULL DEFAULT 'multiple',
    "difficulty" "Difficulty" NOT NULL DEFAULT 'easy',
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "questionList" JSONB NOT NULL,
    "scoreList" JSONB NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "userScoreId" INTEGER NOT NULL,
    "userParticipantId" INTEGER NOT NULL,
    "userQuestionAnswerId" INTEGER NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Quiz_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_userName_idx" ON "User"("email", "userName");

-- CreateIndex
CREATE UNIQUE INDEX "UserScore_id_userId_quizId_key" ON "UserScore"("id", "userId", "quizId");

-- CreateIndex
CREATE UNIQUE INDEX "UserParticipant_id_userId_quizId_key" ON "UserParticipant"("id", "userId", "quizId");

-- CreateIndex
CREATE UNIQUE INDEX "UserQuestionAnswer_id_userId_quizId_questionId_key" ON "UserQuestionAnswer"("id", "userId", "quizId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Question_quizId_key" ON "Question"("quizId");

-- CreateIndex
CREATE UNIQUE INDEX "Question_id_quizId_key" ON "Question"("id", "quizId");

-- CreateIndex
CREATE UNIQUE INDEX "Quiz_id_categoryId_name_key" ON "Quiz"("id", "categoryId", "name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userScoreId_fkey" FOREIGN KEY ("userScoreId") REFERENCES "UserScore"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userParticipantId_fkey" FOREIGN KEY ("userParticipantId") REFERENCES "UserParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_userQuestionAnswerId_fkey" FOREIGN KEY ("userQuestionAnswerId") REFERENCES "UserQuestionAnswer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_userQuestionAnswerId_fkey" FOREIGN KEY ("userQuestionAnswerId") REFERENCES "UserQuestionAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userScoreId_fkey" FOREIGN KEY ("userScoreId") REFERENCES "UserScore"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userParticipantId_fkey" FOREIGN KEY ("userParticipantId") REFERENCES "UserParticipant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quiz" ADD CONSTRAINT "Quiz_userQuestionAnswerId_fkey" FOREIGN KEY ("userQuestionAnswerId") REFERENCES "UserQuestionAnswer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
