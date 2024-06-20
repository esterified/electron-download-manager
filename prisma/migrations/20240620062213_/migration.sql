-- CreateTable
CREATE TABLE "Download" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'downloading',
    "filename" TEXT,
    "filesize" TEXT,
    "speed" TEXT,
    "percentage" INTEGER NOT NULL DEFAULT 0,
    "filepath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
