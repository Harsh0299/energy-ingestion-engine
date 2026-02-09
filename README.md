# ⚡ High-Scale Energy Ingestion Engine

## Overview

This service is the **core ingestion and analytics layer** for a large-scale EV Fleet platform.  
It ingests high-frequency telemetry from **Smart Meters (grid side)** and **EVs (vehicle side)**, persists the data efficiently, and exposes analytical insights around **energy efficiency and vehicle performance**.

The system is designed to handle **10,000+ devices**, each sending telemetry every minute, resulting in **~14.4 million records per stream per day**, while still providing fast real-time dashboards and efficient analytical queries.

---

## Problem Context

In an EV charging ecosystem:

- **Smart Meters** measure **AC energy consumed from the grid**
- **EVs / Chargers** report **DC energy delivered to the battery** and **State of Charge (SoC)**
- Due to AC → DC conversion losses, **AC consumed is always greater than DC delivered**

By correlating these two streams, the system can compute:
- Energy efficiency (DC / AC)
- Detect abnormal losses
- Track battery and charger health over time

---

## High-Level Architecture

POST /v1/ingest  
→ Ingestion Layer (polymorphic)  
→ History Store (append-only)  
→ Live State Store (upsert)  
→ Analytics Queries (GET)

---

## Data Model

| Table | Purpose | Data Type |
|-----|-------|---------|
| meter_telemetry_history | Raw meter events | Cold (append-only) |
| vehicle_telemetry_history | Raw vehicle events | Cold (append-only) |
| live_meter_state | Current meter status | Hot (upsert) |
| live_vehicle_state | Current vehicle status | Hot (upsert) |

---

## Ingestion

### Endpoint
POST /v1/ingest

### Meter Telemetry
```json
{
  "meterId": "M-101",
  "kwhConsumedAc": 12.4,
  "voltage": 230,
  "timestamp": "2026-02-08T10:01:00Z"
}
```

### Vehicle Telemetry
```json
{
  "vehicleId": "V-202",
  "soc": 67,
  "kwhDeliveredDc": 10.8,
  "batteryTemp": 34.2,
  "timestamp": "2026-02-08T10:01:00Z"
}
```

Each telemetry event:
1. Is validated using DTOs
2. Is inserted into immutable history tables
3. Updates live state using UPSERT

---

## Analytics

### Endpoint
GET /v1/analytics/performance/:vehicleId

### Metrics (last 24 hours)
- Total AC energy consumed
- Total DC energy delivered
- Efficiency ratio (DC / AC)
- Average battery temperature

### Example Response
```json
{
  "vehicleId": "V-202",
  "totalEnergy": {
    "acConsumedKwh": 52.4,
    "dcDeliveredKwh": 46.1
  },
  "efficiencyRatio": 0.88,
  "avgBatteryTemp": 33.6
}
```

Analytics queries are index-bounded and do not scan full tables.

---

## Scalability

- Append-only writes for telemetry
- Constant-size live state tables
- Time-windowed analytics queries
- Designed for tens of millions of rows per day

---

## Tech Stack

- Node.js, NestJS (TypeScript)
- PostgreSQL
- Prisma ORM
- Docker / docker-compose

---

## Running Locally

```bash
docker compose up -d postgres
npm install
npx prisma migrate dev
npm run start:dev
```

---

## Design Summary

This system cleanly separates **event history**, **real-time state**, and **analytics**, enabling reliable ingestion, fast dashboards, and scalable energy intelligence.
