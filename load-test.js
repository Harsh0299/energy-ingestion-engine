import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    telemetry_ingestion: {
      executor: 'constant-arrival-rate',
      rate: 333,            // requests per second
      timeUnit: '1s',
      duration: '24h',      // simulate 24 hours
      preAllocatedVUs: 500,
      maxVUs: 2000,
    },
  },
};

const BASE_URL = 'http://localhost:3000/v1/ingest';

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function () {
  const isMeter = Math.random() < 0.5;
  const now = new Date().toISOString();

  let payload;

  if (isMeter) {
    payload = {
      meterId: `M-${randomInt(1, 10000)}`,
      kwhConsumedAc: Math.random() * 2 + 0.5,
      voltage: randomInt(210, 240),
      timestamp: now,
    };
  } else {
    payload = {
      vehicleId: `V-${randomInt(1, 10000)}`,
      soc: randomInt(20, 90),
      kwhDeliveredDc: Math.random() * 2,
      batteryTemp: randomInt(25, 40),
      timestamp: now,
    };
  }

  http.post(BASE_URL, JSON.stringify(payload), {
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // small jitter to avoid perfect sync
  sleep(Math.random() * 0.1);
}
