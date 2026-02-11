import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  TouchableOpacity,
} from 'react-native';
import { getDocente, removeDocente } from '../utils/session';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import { useBLE } from '../context/BLEContext';
import ScreenWrapper from '../components/ScreenWrapper';

export async function requestBluetoothPermissions() {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 28) {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
    } else {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
    }
  }
}

export default function HomeScreen() {
  const navigation: any = useNavigation();
  const [connected, setConnected] = useState(false);
  const [docente, setDocente] = useState<any>(null);
  const manager = new BleManager();
  const [isScanning, setIsScanning] = useState(false);
  const { device, setDevice } = useBLE(); // usamos device del context

  const handleDeviceToggle = async () => {
    if (device && connected) {
      // 🔹 Si ya está conectado, desconectamos
      try {
        await device.cancelConnection();
        console.log('Desconectado!');
        setConnected(false);
        setDevice(null); // limpiamos el device del context
      } catch (err) {
        console.log('ERROR al desconectar:', err);
      }
    } else {
      // 🔹 Si no está conectado, conectamos
      connectESP32();
    }
  };

  const connectESP32 = async () => {
    if (isScanning) return; // ⛔ evita duplicados

    setIsScanning(true);

    try {
      await requestBluetoothPermissions();

      const state = await manager.state();
      if (state !== 'PoweredOn') {
        console.log('Bluetooth apagado');
        setIsScanning(false);
        return;
      }

      manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log('SCAN ERROR:', error);
          setIsScanning(false);
          return;
        }

        if (device?.name === 'ESP32_AULA') {
          console.log('ESP32 encontrado');

          manager.stopDeviceScan();
          setIsScanning(false);

          device.connect()
            .then(d => d.discoverAllServicesAndCharacteristics())
            .then(() => {
              console.log('Conectado!');
              setConnected(true);
              setDevice(device); // ✅ Guardamos el BLE device en el context
            })
            .catch(err => {
              console.log('CONNECT ERROR:', err);
              setIsScanning(false);
            });
        }
      });

      // ⏱️ seguridad: detener scan a los 10s
      setTimeout(() => {
        manager.stopDeviceScan();
        setIsScanning(false);
      }, 10000);

    } catch (e) {
      console.log(e);
      setIsScanning(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          BackHandler.exitApp();
          return true;
        }
      );

      return () => subscription.remove();
    }, [])
  );

  useEffect(() => {
    const fetchDocente = async () => {
      const d = await getDocente();
      if (!d) {
        navigation.navigate('Login');
        return;
      }
      setDocente(d);
    };
    fetchDocente();
  }, []);

  const handleLogout = async () => {
    try {
      // 🔹 Si hay dispositivo conectado, lo desconectamos
      if (device) {
        await device.cancelConnection();
        console.log('Dispositivo desconectado al cerrar sesión');
        setConnected(false);
        setDevice(null);
      }

      await removeDocente();

      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });

    } catch (error) {
      console.log('Error al cerrar sesión:', error);
    }
  };

  if (!docente) return null;

  return (
    <ScreenWrapper>
      {/* Icono ajustes */}
      <TouchableOpacity style={styles.settings}>
        <Text style={{ fontSize: 20 }}>⚙️</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Tarjeta profesor */}
        <View style={styles.card}>
          <Image
            source={require('../../assets/Profe.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>{docente.nombre} {docente.apellido}</Text>
          <Text style={styles.name}>{docente.aula.nombre}</Text>
        </View>

        {/* Botones */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Students', { docenteId: docente.id, docenteDetail: docente })}
        >
          <Text style={styles.buttonText}>Alumnos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !connected && styles.buttonDisabled]}
          disabled={!connected}
          onPress={() => navigation.navigate('ChooseStudentGame', { docenteDetail: docente })}
        >
          <Text style={styles.buttonText}>Práctica Rápida</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, !connected && styles.buttonDisabled]}
          disabled={!connected}
          onPress={() => navigation.navigate('GameLevel', { docenteDetail: docente })}
        >
          <Text style={styles.buttonText}>Niveles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.disconnect,
            { backgroundColor: connected ? '#4CAF50' : '#FF6B6B' },
            isScanning && { opacity: 0.6 }
          ]}
          disabled={isScanning}
          onPress={handleDeviceToggle} // 🔹 usamos toggle
        >
          <Text style={styles.disconnectText}>
            {isScanning
              ? 'Buscando dispositivo...'
              : connected
              ? 'Dispositivo Conectado'
              : 'Conectar con Dispositivo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.disconnectText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  blueOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 80, 180, 0.25)' },
  background: { flex: 1 },
  home: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
  settings: { position: 'absolute', top: 40, right: 20 },
  container: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  card: { backgroundColor: '#E0E0E0', borderRadius: 20, alignItems: 'center', padding: 20, marginBottom: 30 },
  avatar: { width: 80, height: 80, marginBottom: 10 },
  name: { fontWeight: 'bold' },
  button: { backgroundColor: '#66E0E0', paddingVertical: 12, borderRadius: 20, alignItems: 'center', marginBottom: 15, width: '75%', alignSelf: 'center' },
  buttonText: { fontWeight: 'bold' },
  disconnect: { backgroundColor: '#FF6B6B', paddingVertical: 12, borderRadius: 20, alignItems: 'center', width: '60%', alignSelf: 'center' },
  disconnectText: { color: '#fff', fontWeight: 'bold' },
  buttonDisabled: { backgroundColor: '#B0B0B0', opacity: 0.6 },
  logoutButton: { position: 'absolute', bottom: 30, alignSelf: 'center', backgroundColor: '#FF6B6B', paddingVertical: 12, borderRadius: 20, width: '60%', alignItems: 'center' },
});
