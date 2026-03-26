// @resultsafe/core-fp-task/src/methods/__examples__/andThen-iot.example.ts
import { andThen, type Task } from '@resultsafe/core-fp-task';

type TemperatureReading = { sensorId: string; temp: number };
type AdjustedTemperature = { sensorId: string; newTemp: number };
type LogEntry = { sensorId: string; message: string };

// -----------------------------
// 1️⃣ Исходные задачи
// -----------------------------
const readTemperature: Task<TemperatureReading> = () =>
  new Promise((res) =>
    setTimeout(() => res({ sensorId: 'sensor_01', temp: 22 }), 10),
  );

const adjustThermostat =
  (reading: TemperatureReading): Task<AdjustedTemperature> =>
  () =>
    new Promise((res) =>
      setTimeout(
        () => res({ sensorId: reading.sensorId, newTemp: reading.temp + 2 }),
        15,
      ),
    );

const logAdjustment =
  (adjustment: AdjustedTemperature): Task<LogEntry> =>
  () =>
    new Promise((res) =>
      setTimeout(
        () =>
          res({
            sensorId: adjustment.sensorId,
            message: `Thermostat set to ${adjustment.newTemp}°C`,
          }),
        5,
      ),
    );

// -----------------------------
// 2️⃣ Цепочка задач через andThen
// -----------------------------
const thermostatFlow: Task<LogEntry> = andThen(readTemperature, (reading) =>
  andThen(adjustThermostat(reading), logAdjustment),
);

// -----------------------------
// 3️⃣ Выполнение
// -----------------------------
async function runExample() {
  const log = await thermostatFlow();
  console.log('Thermostat log:', log);
  // { sensorId: 'sensor_01', message: 'Thermostat set to 24°C' }
}

runExample();


