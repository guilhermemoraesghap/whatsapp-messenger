/*
  Warnings:

  - You are about to drop the column `re_send` on the `whatsapp_message_log` table. All the data in the column will be lost.
  - Added the required column `is_sent` to the `whatsapp_message_log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "whatsapp_message_log" DROP COLUMN "re_send",
ADD COLUMN     "is_sent" BOOLEAN NOT NULL;
