/*
  Warnings:

  - You are about to drop the `Sumission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Sumission";

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "lang" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'processing',
    "output" TEXT NOT NULL DEFAULT '',
    "error" TEXT,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);
