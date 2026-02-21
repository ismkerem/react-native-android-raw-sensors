import { TurboModuleRegistry, type TurboModule } from 'react-native';



export interface Spec extends TurboModule {
  startAccelerometer(updateInterval: number): void;
  stopAccelerometer(): void;

  startGravity(updateInterval: number): void;
  stopGravity(): void;

  startGyroscope(updateInterval: number): void;
  stopGyroscope(): void;

  startLight(updateInterval: number): void;
  stopLight(): void;

  startLinearAcceleration(updateInterval: number): void;
  stopLinearAcceleration(): void;

  startMagneticField(updateInterval: number): void;
  stopMagneticField(): void;

  startOrientation(updateInterval: number): void;
  stopOrientation(): void;

  startPressure(updateInterval: number): void;
  stopPressure(): void;

  startProximity(updateInterval: number): void;
  stopProximity(): void;


  startRotationVector(updateInterval: number): void;
  stopRotationVector(): void;

  getAvailableSensorsList():string[];

  startSignificantMotion():void;
  stopSignificantMotion():void;
  
}

export default TurboModuleRegistry.getEnforcing<Spec>('AndroidRawSensors');
