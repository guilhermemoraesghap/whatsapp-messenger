/*
  Warnings:

  - A unique constraint covering the columns `[user_id]` on the table `connections` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "connections" ADD COLUMN     "user_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "connections_user_id_key" ON "connections"("user_id");

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
