import { NativeEventEmitter } from 'react-native';
import AndroidRawSensors from './NativeAndroidRawSensors';
import { useEffect, useState } from 'react';

const sensorEmitter = new NativeEventEmitter(AndroidRawSensors as any);

// --- TYPE DEFINITIONS ---
export type Vector3D = { x: number; y: number; z: number };
export type OrientationData = { azimuth: number; pitch: number; roll: number };
export type RotationVectorData = { x: number; y: number; z: number; w: number };
export type LightData = { lux: number };
export type PressureData = { pressure: number };
export type ProximityData = { distance: number };
export type AccuracyData = {
  sensorName: string;
  accuracy: number; // 0: Unreliable, 1: Low, 2: Medium, 3: High
};
export type SignificantMotionData = { triggered: boolean; timestamp: number };

// --- HOOKS ---

export const useAccelerometer = (updateInterval: number = 100) => {
  const [data, setData] = useState<Vector3D>({ x: 0, y: 0, z: 0 });

  useEffect(() => {
    AndroidRawSensors.startAccelerometer(updateInterval);

    const subscription = sensorEmitter.addListener(
      'Accelerometer',
      (event: any) => {
        setData(event as Vector3D);
      }
    );

    return () => {
      subscription.remove();
      AndroidRawSensors.stopAccelerometer();
    };
  }, [updateInterval]);

  return data;
};

export const useGravity = (updateInterval: number = 100) => {
  const [data, setData] = useState<Vector3D>({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    AndroidRawSensors.startGravity(updateInterval);
    const subscription = sensorEmitter.addListener('Gravity', (event: any) => {
      setData(event as Vector3D);
    });
    return () => {
      subscription.remove();
      AndroidRawSensors.stopGravity();
    };
  }, [updateInterval]);
  return data;
};

export function useGyroscope(updateInterval: number = 100) {
  const [data, setData] = useState<Vector3D>({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    AndroidRawSensors.startGyroscope(updateInterval);
    const sub = sensorEmitter.addListener('Gyroscope', (event: any) => {
      setData(event as Vector3D);
    });
    return () => {
      sub.remove();
      AndroidRawSensors.stopGyroscope();
    };
  }, [updateInterval]);
  return data;
}

export function useLight(updateInterval: number = 100) {
  const [data, setData] = useState<LightData>({ lux: 0 });
  useEffect(() => {
    AndroidRawSensors.startLight(updateInterval);
    const sub = sensorEmitter.addListener('Light', (event: any) => {
      setData(event as LightData);
    });
    return () => {
      sub.remove();
      AndroidRawSensors.stopLight();
    };
  }, [updateInterval]);
  return data;
}

export function useLinearAcceleration(updateInterval: number = 100) {
  const [data, setData] = useState<Vector3D>({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    AndroidRawSensors.startLinearAcceleration(updateInterval);
    const sub = sensorEmitter.addListener(
      'LinearAcceleration',
      (event: any) => {
        setData(event as Vector3D);
      }
    );
    return () => {
      sub.remove();
      AndroidRawSensors.stopLinearAcceleration();
    };
  }, [updateInterval]);
  return data;
}

export function useMagneticField(updateInterval: number = 100) {
  const [data, setData] = useState<Vector3D>({ x: 0, y: 0, z: 0 });
  useEffect(() => {
    AndroidRawSensors.startMagneticField(updateInterval);
    const sub = sensorEmitter.addListener('MagneticField', (event: any) => {
      setData(event as Vector3D);
    });
    return () => {
      sub.remove();
      AndroidRawSensors.stopMagneticField();
    };
  }, [updateInterval]);
  return data;
}

export function useOrientation(updateInterval: number = 100) {
  const [data, setData] = useState<OrientationData>({
    azimuth: 0,
    pitch: 0,
    roll: 0,
  });
  useEffect(() => {
    AndroidRawSensors.startOrientation(updateInterval);
    const sub = sensorEmitter.addListener('Orientation', (event: any) => {
      setData(event as OrientationData);
    });
    return () => {
      sub.remove();
      AndroidRawSensors.stopOrientation();
    };
  }, [updateInterval]);
  return data;
}

export function useProximity(updateInterval: number = 100) {
  const [data, setData] = useState<ProximityData>({ distance: 0 });
  useEffect(() => {
    AndroidRawSensors.startProximity(updateInterval);
    const sub = sensorEmitter.addListener('Proximity', (event: any) => {
      setData(event as ProximityData);
    });
    return () => {
      sub.remove();
      AndroidRawSensors.stopProximity();
    };
  }, [updateInterval]);

  return data;
}

export function usePressure(updateInterval: number = 100) {
  const [data, setData] = useState<PressureData>({ pressure: 0 });
  useEffect(() => {
    AndroidRawSensors.startPressure(updateInterval);
    const sub = sensorEmitter.addListener('Pressure', (event: any) => {
      setData(event as PressureData);
    });
    return () => {
      sub.remove();
      AndroidRawSensors.stopPressure();
    };
  }, [updateInterval]);

  return data;
}

export function useRotationVector(updateInterval: number = 100) {
  const [data, setData] = useState<RotationVectorData>({ x: 0, y: 0, z: 0, w: 0 });
  useEffect(() => {
    AndroidRawSensors.startRotationVector(updateInterval);
    const sub = sensorEmitter.addListener('RotationVector', (event: any) => {
      setData(event as RotationVectorData);
    });
    return () => {
      sub.remove();
      AndroidRawSensors.stopRotationVector();
    };
  }, [updateInterval]);
  return data;
}

export function useSensorAccuracy() {
  const [data, setData] = useState<AccuracyData | null>(null);
  useEffect(() => {
    const sub = sensorEmitter.addListener('AccuracyChanged', (event: any) => {
      setData(event);
    });

    return () => {
      sub.remove();
    };
  }, []);

  return data;
}

export function useSignificantMotion(onTrigger?: (event: SignificantMotionData) => void) {
  const [data, setData] = useState<SignificantMotionData | null>(null);

  useEffect(() => {
    AndroidRawSensors.startSignificantMotion();

    const sub = sensorEmitter.addListener('SignificantMotion', (event: any) => {
      setData(event);
      
      if (onTrigger) {
        onTrigger(event);
      }

      AndroidRawSensors.startSignificantMotion(); 
    });

    return () => {
      sub.remove();
      AndroidRawSensors.stopSignificantMotion();
    };
  }, [onTrigger]);

  return data;
}

export { AndroidRawSensors };