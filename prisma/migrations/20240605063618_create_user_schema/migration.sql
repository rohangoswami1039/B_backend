/*
  Warnings:

  - You are about to drop the column `Created_ar` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "Created_ar",
ADD COLUMN     "Created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
