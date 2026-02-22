# react-native-android-raw-sensors

High-performance Android raw sensor access for React Native using the **New Architecture (Turbo Modules + JSI)**.

> ⚡ Zero legacy bridge  
> ⚡ Real-time streaming  
> ⚡ Kotlin native implementation  
> ⚡ Modern React Hooks API  
> ⚡ Android only  

---


## ⚙️ Platform Support

| Platform | Supported |
|----------|------------|
| Android  | ✅ Yes |
| iOS      | ❌ No (Autolinking disabled via react-native.config.js) |

iOS is explicitly disabled via `react-native.config.js`.

---

## 🏗 Core Architecture

- React Native New Architecture
- Turbo Modules
- JSI (JavaScript Interface)
- Codegen
- Native Language: Kotlin (Android)

### Communication Strategy

- Continuous sensor streams → `NativeEventEmitter`
- One-shot data retrieval → `Promise`

---

# 📡 Native Module API (Turbo Module Spec)

The module follows a strict TypeScript `Spec` and is implemented in Kotlin.

---

## 🔄 Continuous Sensors (Streaming)

All continuous sensors follow this pattern:

```ts
start[SensorName](updateInterval: number)
stop[SensorName]()
```

### Parameter

- `updateInterval` (number, ms) → Defines how frequently sensor data is emitted.

### Supported Sensors

- Accelerometer
- Gravity
- Gyroscope
- Light
- Linear Acceleration
- Magnetic Field
- Orientation (Deprecated Android type)
- Pressure
- Proximity
- Rotation Vector
- Step Counter

---

## 🧠 Specialized Sensors & Utility Functions

### startSignificantMotion()

### stopSignificantMotion()

- Uses Android `TriggerEventListener`
- Hardware-based motion detection
- One-shot trigger
- Activates when the device detects significant movement (walking, biking, etc.)

---

### getAvailableSensorsList(): Promise<SensorInfo[]>

Returns:

```ts
type SensorInfo = {
  name: string
  vendor: string
  type: number
  power: number
  isWakeUpSensor: boolean
  minDelay: number
}
```

---

### getCurrentStepCount(): Promise<number>

- One-shot read
- Returns total steps since last reboot
- Optimized for background tasks
- Battery efficient

---

# ⚛️ React Hooks API

The library abstracts native calls into modern React Hooks for optimal Developer Experience (DX).

All hooks automatically:

- Start sensor on mount
- Stop sensor on unmount
- Re-subscribe if interval changes

---

## 🔹 Motion Sensors

### useAccelerometer(interval?: number)

Returns:

```ts
{ x: number, y: number, z: number }
```

---

### useGravity(interval?: number)

Returns:

```ts
{ x: number, y: number, z: number }
```

---

### useGyroscope(interval?: number)

Returns:

```ts
{ x: number, y: number, z: number }
```

---

### useLinearAcceleration(interval?: number)

Returns:

```ts
{ x: number, y: number, z: number }
```

---

### useMagneticField(interval?: number)

Returns:

```ts
{ x: number, y: number, z: number }
```

---

## 🔹 Orientation & Rotation

### useOrientation(interval?: number)

Returns:

```ts
{ azimuth: number, pitch: number, roll: number }
```

---

### useRotationVector(interval?: number)

Returns:

```ts
{ x: number, y: number, z: number, w: number }
```

---

## 🔹 Environmental Sensors

### useLight(interval?: number)

Returns:

```ts
{ lux: number }
```

---

### usePressure(interval?: number)

Returns:

```ts
{ pressure: number }
```

---

### useProximity(interval?: number)

Returns:

```ts
{ distance: number }
```

---

## 🔹 Step & Motion Detection

### useStepCounter(interval?: number)

Returns:

```ts
{ steps: number }
```

---

### useSignificantMotion(onTrigger?: (event) => void)

Returns:

```ts
{
  triggered: boolean,
  timestamp: number
}
```

Parameter:

- `onTrigger` (optional) → Callback that fires immediately when hardware trigger activates.

---

# 🔋 Performance & Battery Considerations

- Uses JSI (no legacy bridge overhead)
- Native hardware trigger support for motion detection
- Optimized for background-safe operations
- Efficient event emission strategy

---

