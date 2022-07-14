-- DropIndex
DROP INDEX `Session_sessionToken_key` ON `Session`;

-- AlterTable
ALTER TABLE `Session` MODIFY `sessionToken` LONGTEXT NOT NULL;
