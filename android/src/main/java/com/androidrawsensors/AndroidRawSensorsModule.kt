package com.androidrawsensors

import com.facebook.react.bridge.ReactApplicationContext

class AndroidRawSensorsModule(reactContext: ReactApplicationContext) :
  NativeAndroidRawSensorsSpec(reactContext) {

  override fun multiply(a: Double, b: Double): Double {
    return a * b
  }

  companion object {
    const val NAME = NativeAndroidRawSensorsSpec.NAME
  }
}
