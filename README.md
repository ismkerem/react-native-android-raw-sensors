# react-native-android-raw-sensors

High-performance Android raw sensor access for React Native using the **New Architecture (Turbo Modules + JSI)**.

> ⚡ Zero legacy bridge
> ⚡ Real-time streaming
> ⚡ Kotlin native implementation
> ⚡ Modern React Hooks API
> ⚡ Android only

---

## 📦 Installation

```bash
npm install react-native-android-raw-sensors
```

or

```bash
yarn add react-native-android-raw-sensors
```

> **Requires React Native New Architecture (Turbo Modules)**. Make sure `newArchEnabled=true` is set in your `android/gradle.properties`.

---

## ⚙️ Platform Support

| Platform | Supported |
|----------|-----------|
| Android  | ✅ Yes    |
| iOS      | ❌ No     |

iOS is explicitly disabled via `react-native.config.js`.

---

## 🏗 Architecture

- **React Native New Architecture** — Turbo Modules + JSI + Codegen
- **Native Language**: Kotlin (Android)
- **No legacy bridge** — zero serialization overhead

### Communication Strategy

| Method | Use Case |
|--------|----------|
| `NativeEventEmitter` | Continuous sensor streams |
| Synchronous call | One-shot data retrieval (e.g. sensor list) |

---

## 🚀 Quick Start

```tsx
import { useAccelerometer, useGyroscope } from 'react-native-android-raw-sensors';

function SensorDemo() {
  const acc = useAccelerometer(100); // 100ms update interval
  const gyro = useGyroscope(100);

  return (
    <>
      <Text>Acc X: {acc.x.toFixed(2)}</Text>
      <Text>Gyro Z: {gyro.z.toFixed(2)}</Text>
    </>
  );
}
```

---

# ⚛️ React Hooks API

All hooks automatically start the sensor on mount, stop it on unmount, and re-subscribe when the `updateInterval` changes.

---

## 🔹 Motion Sensors

### `useAccelerometer(updateInterval?: number)`

Default interval: `100` ms.

```ts
const { x, y, z } = useAccelerometer(100);
// x, y, z → m/s²
```

---

### `useGravity(updateInterval?: number)`

```ts
const { x, y, z } = useGravity(100);
// x, y, z → m/s²
```

---

### `useGyroscope(updateInterval?: number)`

```ts
const { x, y, z } = useGyroscope(100);
// x, y, z → rad/s
```

---

### `useLinearAcceleration(updateInterval?: number)`

Acceleration without gravity component.

```ts
const { x, y, z } = useLinearAcceleration(100);
// x, y, z → m/s²
```

---

### `useMagneticField(updateInterval?: number)`

```ts
const { x, y, z } = useMagneticField(100);
// x, y, z → µT (microtesla)
```

---

## 🔹 Orientation & Rotation

### `useOrientation(updateInterval?: number)`

> ⚠️ Uses the deprecated `TYPE_ORIENTATION` Android sensor type. Prefer `useRotationVector` for new projects.

```ts
const { azimuth, pitch, roll } = useOrientation(100);
// azimuth → degrees (0–360), pitch → degrees (−180–180), roll → degrees (−90–90)
```

---

### `useRotationVector(updateInterval?: number)`

```ts
const { x, y, z, w } = useRotationVector(100);
// Quaternion components (unit quaternion)
// w may be 0.0 if not provided by the hardware
```

---

## 🔹 Environmental Sensors

### `useLight(updateInterval?: number)`

```ts
const { lux } = useLight(100);
// lux → ambient light in lux
```

---

### `usePressure(updateInterval?: number)`

```ts
const { pressure } = usePressure(100);
// pressure → hPa (hectopascal / millibar)
```

---

### `useProximity(updateInterval?: number)`

```ts
const { distance } = useProximity(100);
// distance → cm (or binary 0/1 on some devices)
```

---

## 🔹 Motion Detection

### `useSignificantMotion(onTrigger?: (event: SignificantMotionData) => void)`

Uses Android's hardware-level `TriggerEventListener`. Fires once per detected significant motion event, then automatically re-arms.

```ts
const motion = useSignificantMotion((event) => {
  console.log('Motion at:', event.timestamp);
});
// motion → { triggered: boolean, timestamp: number } | null
```

> **Note**: Pass a stable callback reference (e.g. `useCallback`) to avoid unnecessary re-subscriptions.

---

## 🔹 Sensor Accuracy

### `useSensorAccuracy()`

Listens for `AccuracyChanged` events from all active sensors. Does **not** start any sensor by itself.

```ts
const accuracy = useSensorAccuracy();
// accuracy → { sensorName: string, accuracy: number } | null
// accuracy levels: 0 = Unreliable, 1 = Low, 2 = Medium, 3 = High
```

---

# 📡 Native Module API

Direct access to the native module is available via the `AndroidRawSensors` export.

```ts
import { AndroidRawSensors } from 'react-native-android-raw-sensors';
```

---

## `getAvailableSensorsList()`

Returns a **synchronous** list of all hardware sensors on the device.

```ts
const sensors = AndroidRawSensors.getAvailableSensorsList();
```

Returns an array of sensor descriptor objects:

```ts
type SensorInfo = {
  name: string;
  type: string;        // Android sensor type as string
  vendor: string;
  power: string;       // mA consumption as string
  minDelay: string;    // minimum update interval in µs as string
  isDynamicSensor: string;
  isWakeUpSensor: string;
}
```

---

## Streaming Sensors (Low-level)

If you need manual control over the sensor lifecycle:

```ts
AndroidRawSensors.startAccelerometer(100); // updateInterval in ms
AndroidRawSensors.stopAccelerometer();
```

All sensors follow this `start[SensorName](updateInterval)` / `stop[SensorName]()` pattern.

### Available sensors:

| Sensor | start/stop method | Event name |
|--------|------------------|------------|
| Accelerometer | `startAccelerometer` / `stopAccelerometer` | `Accelerometer` |
| Gravity | `startGravity` / `stopGravity` | `Gravity` |
| Gyroscope | `startGyroscope` / `stopGyroscope` | `Gyroscope` |
| Light | `startLight` / `stopLight` | `Light` |
| Linear Acceleration | `startLinearAcceleration` / `stopLinearAcceleration` | `LinearAcceleration` |
| Magnetic Field | `startMagneticField` / `stopMagneticField` | `MagneticField` |
| Orientation ⚠️ | `startOrientation` / `stopOrientation` | `Orientation` |
| Pressure | `startPressure` / `stopPressure` | `Pressure` |
| Proximity | `startProximity` / `stopProximity` | `Proximity` |
| Rotation Vector | `startRotationVector` / `stopRotationVector` | `RotationVector` |
| Significant Motion | `startSignificantMotion` / `stopSignificantMotion` | `SignificantMotion` |

---

## Listening to Events Manually

```ts
import { NativeEventEmitter } from 'react-native';
import { AndroidRawSensors } from 'react-native-android-raw-sensors';

const emitter = new NativeEventEmitter(AndroidRawSensors as any);

AndroidRawSensors.startAccelerometer(100);
const sub = emitter.addListener('Accelerometer', (data) => {
  console.log(data.x, data.y, data.z);
});

// Cleanup
sub.remove();
AndroidRawSensors.stopAccelerometer();
```

---

# 📦 Exported Types

```ts
export type Vector3D = { x: number; y: number; z: number };
export type OrientationData = { azimuth: number; pitch: number; roll: number };
export type RotationVectorData = { x: number; y: number; z: number; w: number };
export type LightData = { lux: number };
export type PressureData = { pressure: number };
export type ProximityData = { distance: number };
export type AccuracyData = { sensorName: string; accuracy: number };
export type SignificantMotionData = { triggered: boolean; timestamp: number };
```

---

# 🔋 Performance & Battery

- **JSI** — no legacy bridge serialization overhead
- **Hardware trigger** for significant motion (no polling)
- `updateInterval` controls the minimum sensor sampling period; actual rate depends on hardware and OS scheduling
- Lower intervals (e.g. 16ms) increase CPU usage — use the slowest interval that meets your needs

---

## 📄 License

MIT © [ismkerem](https://github.com/ismkerem)
