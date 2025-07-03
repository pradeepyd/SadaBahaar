/*
  Warnings:

  - Added the required column `roomId` to the `Stream` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Room" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Room_pkey" PRIMARY KEY ("id")
);

-- Insert a default room
INSERT INTO "Room" ("id", "name", "createdAt") VALUES ('default-room-id', 'Default Room', CURRENT_TIMESTAMP);

-- Add roomId as nullable first
ALTER TABLE "Stream" ADD COLUMN "roomId" TEXT;

-- Update all existing streams to use the default room
UPDATE "Stream" SET "roomId" = 'default-room-id' WHERE "roomId" IS NULL;

-- Now set roomId as NOT NULL
ALTER TABLE "Stream" ALTER COLUMN "roomId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Stream" ADD CONSTRAINT "Stream_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Room" ADD COLUMN "currentSongId" TEXT;
ALTER TABLE "Room" ADD COLUMN "currentSongStartedAt" TIMESTAMP;
ALTER TABLE "Room" ADD CONSTRAINT "Room_currentSongId_fkey" FOREIGN KEY ("currentSongId") REFERENCES "Stream"(id) ON DELETE SET NULL;
ALTER TABLE "Room" ADD COLUMN "creatorId" TEXT;
ALTER TABLE "Room" ADD CONSTRAINT "Room_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"(id) ON DELETE CASCADE;
