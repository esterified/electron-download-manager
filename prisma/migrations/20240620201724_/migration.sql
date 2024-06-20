/*
  Warnings:

  - You are about to drop the column `fileLocation` on the `Download` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Download" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'downloading',
    "filename" TEXT,
    "filesize" TEXT,
    "speed" TEXT,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "filepath" TEXT,
    "tags" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Download" ("createdAt", "filename", "filepath", "filesize", "id", "percentage", "speed", "status", "tags", "updatedAt", "url") SELECT "createdAt", "filename", "filepath", "filesize", "id", "percentage", "speed", "status", "tags", "updatedAt", "url" FROM "Download";
DROP TABLE "Download";
ALTER TABLE "new_Download" RENAME TO "Download";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
