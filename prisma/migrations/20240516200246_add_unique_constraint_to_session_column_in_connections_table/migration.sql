/*
  Warnings:

  - A unique constraint covering the columns `[session_id]` on the table `connections` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "connections_session_id_key" ON "connections"("session_id");
