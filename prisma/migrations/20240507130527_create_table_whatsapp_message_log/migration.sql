-- CreateTable
CREATE TABLE "whatsapp_message_log" (
    "id" TEXT NOT NULL,
    "patient_id" TEXT NOT NULL,
    "patient_name" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "re_send" BOOLEAN NOT NULL DEFAULT false,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "whatsapp_message_log_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "whatsapp_message_log" ADD CONSTRAINT "whatsapp_message_log_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
