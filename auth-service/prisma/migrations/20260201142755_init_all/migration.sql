-- CreateTable
CREATE TABLE "Log" (
    "id" TEXT NOT NULL,
    "serviceName" TEXT NOT NULL,
    "environment" TEXT NOT NULL,
    "logLevel" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Log_serviceName_idx" ON "Log"("serviceName");

-- CreateIndex
CREATE INDEX "Log_logLevel_idx" ON "Log"("logLevel");

-- CreateIndex
CREATE INDEX "Log_timestamp_idx" ON "Log"("timestamp");
