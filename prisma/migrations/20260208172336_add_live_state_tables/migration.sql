-- CreateTable
CREATE TABLE "LiveMeterState" (
    "meterId" TEXT NOT NULL,
    "totalKwhConsumedAc" DECIMAL(65,30) NOT NULL,
    "lastVoltage" DECIMAL(65,30) NOT NULL,
    "lastReportedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveMeterState_pkey" PRIMARY KEY ("meterId")
);

-- CreateTable
CREATE TABLE "LiveVehicleState" (
    "vehicleId" TEXT NOT NULL,
    "soc" DECIMAL(65,30) NOT NULL,
    "totalKwhDeliveredDc" DECIMAL(65,30) NOT NULL,
    "avgBatteryTemp" DECIMAL(65,30) NOT NULL,
    "lastReportedAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LiveVehicleState_pkey" PRIMARY KEY ("vehicleId")
);
