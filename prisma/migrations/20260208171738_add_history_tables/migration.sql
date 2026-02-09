-- CreateTable
CREATE TABLE "MeterTelemetryHistory" (
    "id" BIGSERIAL NOT NULL,
    "meterId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "kwhConsumedAc" DECIMAL(65,30) NOT NULL,
    "voltage" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MeterTelemetryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VehicleTelemetryHistory" (
    "id" BIGSERIAL NOT NULL,
    "vehicleId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "soc" DECIMAL(65,30) NOT NULL,
    "kwhDeliveredDc" DECIMAL(65,30) NOT NULL,
    "batteryTemp" DECIMAL(65,30) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VehicleTelemetryHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MeterTelemetryHistory_meterId_timestamp_idx" ON "MeterTelemetryHistory"("meterId", "timestamp" DESC);

-- CreateIndex
CREATE INDEX "VehicleTelemetryHistory_vehicleId_timestamp_idx" ON "VehicleTelemetryHistory"("vehicleId", "timestamp" DESC);
