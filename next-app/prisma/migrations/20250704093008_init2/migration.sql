/*
  Warnings:

  - Made the column `creatorId` on table `Room` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Room" DROP CONSTRAINT "Room_currentSongId_fkey";

-- AlterTable
ALTER TABLE "Room" ALTER COLUMN "currentSongStartedAt" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "creatorId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_currentSongId_fkey" FOREIGN KEY ("currentSongId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Room" ADD CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
