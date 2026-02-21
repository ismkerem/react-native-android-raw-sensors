# react-native-android-raw-sensors 🤖📱

A high-performance, **Android-only** React Native library that provides real-time access to raw device sensors using the New Architecture (Turbo Modules).

Built with performance in mind, this library uses Android's native `SensorManager` and exposes clean, easy-to-use React Hooks for your application. No background drain—sensors automatically unregister when components unmount!

> ⚠️ **Note:** This library is strictly designed for Android. It does not contain iOS implementations.

## Features ✨
- 🚀 **Turbo Module Ready:** Built with React Native's New Architecture (JSI).
- 🪝 **Modern React Hooks:** Clean usage with zero boilerplate.
- 🔋 **Battery Efficient:** Sensors automatically start and stop with component lifecycles.
- 🛡️ **Crash Safe:** Safely handles devices missing specific hardware sensors.
- 🎯 **Calibration Tracking:** Built-in listener for sensor accuracy/calibration changes.

## Installation

```sh
npm install react-native-android-raw-sensors
# or
yarn add react-native-android-raw-sensors