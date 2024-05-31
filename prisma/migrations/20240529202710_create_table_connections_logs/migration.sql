-- CreateTable
CREATE TABLE "connections_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "connections_logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "connections_logs" ADD CONSTRAINT "connections_logs_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
