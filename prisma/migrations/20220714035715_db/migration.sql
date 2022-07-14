/*
  Warnings:

  - A unique constraint covering the columns `[email,password]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `User_email_password_key` ON `User`(`email`, `password`);
