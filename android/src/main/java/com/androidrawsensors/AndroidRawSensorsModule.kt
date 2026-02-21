package com.androidrawsensors

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.hardware.TriggerEvent
import android.hardware.TriggerEventListener
import android.util.Log
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableArray
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.WritableNativeMap
import com.facebook.react.modules.core.DeviceEventManagerModule

class AndroidRawSensorsModule(reactContext: ReactApplicationContext) :
    NativeAndroidRawSensorsSpec(reactContext), SensorEventListener {
  private val sensorManager: SensorManager =
      reactContext.getSystemService(Context.SENSOR_SERVICE) as SensorManager

  private fun startSensor(sensorType: Int, updateInterval: Double) {
    val sensor = sensorManager.getDefaultSensor(sensorType)
    if (sensor != null) {
      val intervalMicroseconds = (updateInterval * 1000).toInt()
      sensorManager.registerListener(this, sensor, intervalMicroseconds)
    } else {
      Log.w("sensor","Sensor type $sensorType not found on this device!")
    }
  }

  private fun stopSensor(sensorType: Int) {
    val sensor = sensorManager.getDefaultSensor(sensorType)
    if (sensor != null) {
      sensorManager.unregisterListener(this, sensor)
    }
  }

  private fun sendEvent(eventName: String, params: WritableMap) {
    reactApplicationContext
        .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
        .emit(eventName, params)
  }

  override fun getAvailableSensorsList(): WritableArray {
    val sensorList = Arguments.createArray()
    val sensors = sensorManager.getSensorList(Sensor.TYPE_ALL)

    for (sensor in sensors) {
      if (sensor != null) {
        val map = Arguments.createMap()
        map.putString("name", sensor.name)
        map.putString("type", sensor.type.toString())
        map.putString("vendor", sensor.vendor)
        map.putString("isDynamicSensor", sensor.isDynamicSensor.toString())
        map.putString("isWakeUpSensor", sensor.isWakeUpSensor.toString())
        map.putString("power", sensor.power.toString())
        map.putString("minDelay", sensor.minDelay.toString())
        sensorList.pushMap(map)
      }
    }
    return sensorList
  }


  val triggerEventListener =
      object : TriggerEventListener() {
        override fun onTrigger(p0: TriggerEvent?) {
          if (p0 == null) return

          val map = WritableNativeMap()
          map.putBoolean("triggered", true)
          map.putDouble("timestamp", p0.timestamp.toDouble())

          sendEvent("SignificantMotion", map)
        }
      }

  private fun startTriggerSensor() {
    val sensor = sensorManager.getDefaultSensor(Sensor.TYPE_SIGNIFICANT_MOTION)
    if (sensor != null) {
      sensorManager.requestTriggerSensor(triggerEventListener, sensor)
    } else {
      Log.w("RawSensors", "Trigger sensor ${Sensor.TYPE_SIGNIFICANT_MOTION} not supported!")
    }
  }

  private fun stopTriggerSensor() {
    val sensor = sensorManager.getDefaultSensor(Sensor.TYPE_SIGNIFICANT_MOTION)
    if (sensor != null) {
      sensorManager.cancelTriggerSensor(triggerEventListener, sensor)
    }
  }



  override fun onAccuracyChanged(sensor: Sensor, accuracy: Int) {

    val map = WritableNativeMap()
    val sensorName =
        when (sensor.type) {
          Sensor.TYPE_ACCELEROMETER -> "Accelerometer"
          Sensor.TYPE_GRAVITY -> "Gravity"
          Sensor.TYPE_GYROSCOPE -> "Gyroscope"
          Sensor.TYPE_LIGHT -> "Light"
          Sensor.TYPE_LINEAR_ACCELERATION -> "LinearAcceleration"
          Sensor.TYPE_MAGNETIC_FIELD -> "MagneticField"
          @Suppress("DEPRECATION") Sensor.TYPE_ORIENTATION -> "Orientation"
          Sensor.TYPE_PRESSURE -> "Pressure"
          Sensor.TYPE_PROXIMITY -> "Proximity"
          Sensor.TYPE_ROTATION_VECTOR -> "RotationVector"
          else -> "Unknown"
        }
    map.putString("sensorName", sensorName)
    map.putInt("accuracy", accuracy)
    sendEvent("AccuracyChanged", map)
  }

  override fun onSensorChanged(p0: SensorEvent?) {
    if (p0 == null) return
    val map = Arguments.createMap()

    when (p0.sensor.type) {
      Sensor.TYPE_ACCELEROMETER,
      Sensor.TYPE_GRAVITY,
      Sensor.TYPE_LINEAR_ACCELERATION,
      Sensor.TYPE_MAGNETIC_FIELD,
      Sensor.TYPE_GYROSCOPE -> {
        map.putDouble("x", p0.values[0].toDouble())
        map.putDouble("y", p0.values[1].toDouble())
        map.putDouble("z", p0.values[2].toDouble())

        val eventName =
            when (p0.sensor.type) {
              Sensor.TYPE_ACCELEROMETER -> "Accelerometer"
              Sensor.TYPE_GRAVITY -> "Gravity"
              Sensor.TYPE_LINEAR_ACCELERATION -> "LinearAcceleration"
              Sensor.TYPE_MAGNETIC_FIELD -> "MagneticField"
              Sensor.TYPE_GYROSCOPE -> "Gyroscope"
              else -> "Unknown"
            }
        sendEvent(eventName, map)
      }

      @Suppress("DEPRECATION") Sensor.TYPE_ORIENTATION -> {
        map.putDouble("azimuth", p0.values[0].toDouble())
        map.putDouble("pitch", p0.values[1].toDouble())
        map.putDouble("roll", p0.values[2].toDouble())
        sendEvent("Orientation", map)
      }

      Sensor.TYPE_ROTATION_VECTOR -> {
        map.putDouble("x", p0.values[0].toDouble())
        map.putDouble("y", p0.values[1].toDouble())
        map.putDouble("z", p0.values[2].toDouble())
        map.putDouble("w", if (p0.values.size > 3) p0.values[3].toDouble() else 0.0)
        sendEvent("RotationVector", map)
      }

      Sensor.TYPE_LIGHT -> {
        map.putDouble("lux", p0.values[0].toDouble())
        sendEvent("Light", map)
      }

      Sensor.TYPE_PRESSURE -> {
        map.putDouble("pressure", p0.values[0].toDouble())
        sendEvent("Pressure", map)
      }

      Sensor.TYPE_PROXIMITY -> {
        map.putDouble("distance", p0.values[0].toDouble())
        sendEvent("Proximity", map)
      }
    }
  }


  override fun startAccelerometer(updateInterval: Double) =
      startSensor(Sensor.TYPE_ACCELEROMETER, updateInterval)

  override fun stopAccelerometer() = stopSensor(Sensor.TYPE_ACCELEROMETER)

  override fun startGravity(updateInterval: Double) =
      startSensor(Sensor.TYPE_GRAVITY, updateInterval)

  override fun stopGravity() = stopSensor(Sensor.TYPE_GRAVITY)

  override fun startGyroscope(updateInterval: Double) =
      startSensor(Sensor.TYPE_GYROSCOPE, updateInterval)

  override fun stopGyroscope() = stopSensor(Sensor.TYPE_GYROSCOPE)

  override fun startLight(updateInterval: Double) = startSensor(Sensor.TYPE_LIGHT, updateInterval)

  override fun stopLight() = stopSensor(Sensor.TYPE_LIGHT)

  override fun startLinearAcceleration(updateInterval: Double) =
      startSensor(Sensor.TYPE_LINEAR_ACCELERATION, updateInterval)

  override fun stopLinearAcceleration() = stopSensor(Sensor.TYPE_LINEAR_ACCELERATION)

  override fun startMagneticField(updateInterval: Double) =
      startSensor(Sensor.TYPE_MAGNETIC_FIELD, updateInterval)

  override fun stopMagneticField() = stopSensor(Sensor.TYPE_MAGNETIC_FIELD)

  @Suppress("DEPRECATION")
  override fun startOrientation(updateInterval: Double) =
      startSensor(Sensor.TYPE_ORIENTATION, updateInterval)

  @Suppress("DEPRECATION") override fun stopOrientation() = stopSensor(Sensor.TYPE_ORIENTATION)

  override fun startPressure(updateInterval: Double) =
      startSensor(Sensor.TYPE_PRESSURE, updateInterval)

  override fun stopPressure() = stopSensor(Sensor.TYPE_PRESSURE)

  override fun startProximity(updateInterval: Double) =
      startSensor(Sensor.TYPE_PROXIMITY, updateInterval)

  override fun stopProximity() = stopSensor(Sensor.TYPE_PROXIMITY)

  override fun startRotationVector(updateInterval: Double) =
      startSensor(Sensor.TYPE_ROTATION_VECTOR, updateInterval)

  override fun stopRotationVector() = stopSensor(Sensor.TYPE_ROTATION_VECTOR)
  override fun startSignificantMotion() = startTriggerSensor()
  override fun stopSignificantMotion() = stopTriggerSensor()


  companion object {
    const val NAME = NativeAndroidRawSensorsSpec.NAME
  }
}
