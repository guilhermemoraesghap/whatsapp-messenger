/*
  Warnings:

  - You are about to drop the column `user_id` on the `connections` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[company_id]` on the table `connections` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `company_id` to the `connections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "connections" DROP CONSTRAINT "connections_user_id_fkey";

-- DropIndex
DROP INDEX "connections_user_id_key";

-- AlterTable
ALTER TABLE "connections" DROP COLUMN "user_id",
ADD COLUMN     "company_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "connections_company_id_key" ON "connections"("company_id");

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
