/*
  Warnings:

  - A unique constraint covering the columns `[userId,provider,providerAccountId]` on the table `Account` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX `Account_provider_providerAccountId_userId_key` ON `Account`;

-- CreateIndex
CREATE UNIQUE INDEX `Account_userId_provider_providerAccountId_key` ON `Account`(`userId`, `provider`, `providerAccountId`);
