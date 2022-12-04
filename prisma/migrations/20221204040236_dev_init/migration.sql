-- CreateEnum
CREATE TYPE "Role" AS ENUM ('BASIC_USER', 'ADMIN_USER');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" CHAR(10) NOT NULL,
    "firstName" CHAR(50) NOT NULL,
    "lastName" CHAR(50) NOT NULL,
    "password" CHAR(16) NOT NULL,
    "profilePictureURL" TEXT,
    "role" "Role" NOT NULL DEFAULT 'BASIC_USER',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_profilePictureURL_key" ON "User"("profilePictureURL");
