import AndroidRawSensors from './NativeAndroidRawSensors';

export function multiply(a: number, b: number): number {
  return AndroidRawSensors.multiply(a, b);
}
