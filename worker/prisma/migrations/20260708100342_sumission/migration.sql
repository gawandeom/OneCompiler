/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('processing', 'failure', 'sucess');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Sumission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'processing',
    "error" TEXT NOT NULL,

    CONSTRAINT "Sumission_pkey" PRIMARY KEY ("id")
);
