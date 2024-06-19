/*
  Warnings:

  - Added the required column `percentage` to the `Download` table without a default value. This is not possible if the table is not empty.

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
    "percentage" INTEGER NOT NULL
);
INSERT INTO "new_Download" ("filename", "filesize", "id", "status", "url") SELECT "filename", "filesize", "id", "status", "url" FROM "Download";
DROP TABLE "Download";
ALTER TABLE "new_Download" RENAME TO "Download";
CREATE UNIQUE INDEX "Download_url_key" ON "Download"("url");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
