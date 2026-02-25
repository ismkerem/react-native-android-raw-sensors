import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import {
  useAccelerometer,
  useGravity,
  useGyroscope,
  useLight,
  useLinearAcceleration,
  useMagneticField,
  useOrientation,
  useProximity,
  usePressure,
  useSensorAccuracy,
  useSignificantMotion,
  useRotationVector,
  AndroidRawSensors,
} from 'react-native-android-raw-sensors';

export default function App() {
  const acc = useAccelerometer(200);
  const gravity = useGravity(200);
  const gyro = useGyroscope(200);
  const light = useLight(200);
  const linAcc = useLinearAcceleration(200);
  const mag = useMagneticField(200);
  const orientation = useOrientation(200);
  const proximity = useProximity(200);
  const pressure = usePressure(200);

  // New hooks added from the spec
  const rotVec = useRotationVector(200);
  const sigMotion = useSignificantMotion();
  const accuracyInfo = useSensorAccuracy();

  // State to hold the list of available sensors on the device
  const [availableSensors, setAvailableSensors] = useState<ReadonlyArray<Object>>([]);
  useEffect(() => {
    try {
      const sensors = AndroidRawSensors.getAvailableSensorsList();
      if (sensors) {
        setAvailableSensors(sensors);
      }
    } catch (error) {
      console.warn('Failed to fetch sensors list:', error);
    }
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.header}>Raw Sensors</Text>

      {accuracyInfo && accuracyInfo.accuracy < 2 && (
        <View style={[styles.card, styles.warningCard]}>
          <Text style={[styles.title, styles.warningTitle]}>
            ⚠️ Calibration Warning
          </Text>
          <Text style={styles.text}>Sensor: {accuracyInfo.sensorName}</Text>
          <Text style={styles.text}>
            Accuracy Level: {accuracyInfo.accuracy} / 3
          </Text>
          <Text style={styles.warningText}>
            Please calibrate your device by moving it in a figure 8 motion.
          </Text>
        </View>
      )}

      {/* Available Sensors List Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Available Device Sensors</Text>
        <Text style={styles.text}>
          {availableSensors.length > 0
            ? availableSensors.map((s: any) => s.name).join(', ')
            : 'Scanning device sensors...'}
        </Text>
      </View>

      {/* Significant Motion Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Significant Motion</Text>
        <Text style={styles.text}>
          Status:{' '}
          {sigMotion?.triggered
            ? 'Motion Detected! 🏃'
            : 'Waiting for motion... 🧍'}
        </Text>
        {sigMotion?.timestamp && (
          <Text style={styles.text}>Last Timestamp: {sigMotion.timestamp}</Text>
        )}
      </View>

      {/* Rotation Vector Card */}
      <View style={styles.card}>
        <Text style={styles.title}>Rotation Vector</Text>
        <Text style={styles.text}>X: {rotVec.x.toFixed(2)}</Text>
        <Text style={styles.text}>Y: {rotVec.y.toFixed(2)}</Text>
        <Text style={styles.text}>Z: {rotVec.z.toFixed(2)}</Text>
        <Text style={styles.text}>W: {rotVec.w.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Accelerometer</Text>
        <Text style={styles.text}>X: {acc.x.toFixed(2)}</Text>
        <Text style={styles.text}>Y: {acc.y.toFixed(2)}</Text>
        <Text style={styles.text}>Z: {acc.z.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Gravity</Text>
        <Text style={styles.text}>X: {gravity.x.toFixed(2)}</Text>
        <Text style={styles.text}>Y: {gravity.y.toFixed(2)}</Text>
        <Text style={styles.text}>Z: {gravity.z.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Gyroscope</Text>
        <Text style={styles.text}>X: {gyro.x.toFixed(2)}</Text>
        <Text style={styles.text}>Y: {gyro.y.toFixed(2)}</Text>
        <Text style={styles.text}>Z: {gyro.z.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Light</Text>
        <Text style={styles.text}>Lux: {light.lux.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Linear Acceleration</Text>
        <Text style={styles.text}>X: {linAcc.x.toFixed(2)}</Text>
        <Text style={styles.text}>Y: {linAcc.y.toFixed(2)}</Text>
        <Text style={styles.text}>Z: {linAcc.z.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Magnetic Field</Text>
        <Text style={styles.text}>X: {mag.x.toFixed(2)}</Text>
        <Text style={styles.text}>Y: {mag.y.toFixed(2)}</Text>
        <Text style={styles.text}>Z: {mag.z.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Orientation</Text>
        <Text style={styles.text}>
          Azimuth: {orientation.azimuth.toFixed(2)}
        </Text>
        <Text style={styles.text}>Pitch: {orientation.pitch.toFixed(2)}</Text>
        <Text style={styles.text}>Roll: {orientation.roll.toFixed(2)}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Proximity</Text>
        <Text style={styles.text}>
          Distance: {proximity.distance.toFixed(2)}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Pressure</Text>
        <Text style={styles.text}>
          Pressure: {pressure.pressure.toFixed(2)}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 50 },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#2C3E50',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2980B9',
  },
  text: {
    fontSize: 16,
    color: '#34495E',
    marginVertical: 4,
    fontVariant: ['tabular-nums'],
  },

  warningCard: {
    borderColor: '#E74C3C',
    borderWidth: 2,
    backgroundColor: '#FDEDEC',
  },
  warningTitle: {
    color: '#E74C3C',
  },
  warningText: {
    fontSize: 14,
    color: '#C0392B',
    marginTop: 8,
    fontWeight: '600',
  },
});
