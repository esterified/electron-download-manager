-- CreateTable
CREATE TABLE "Download" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL,
    "filename" TEXT,
    "filesize" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "Download_url_key" ON "Download"("url");
