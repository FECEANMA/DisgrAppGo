import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  ToastAndroid
} from 'react-native';
import { getDocente, removeDocente } from '../utils/session';
import { BackHandler } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { BleManager } from 'react-native-ble-plx';
import { PermissionsAndroid, Platform } from 'react-native';
import { useBLE } from '../context/BLEContext';
import LinearGradient from 'react-native-linear-gradient';
import SettingsModal from '../components/SettingsModal';

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
        setIsScanning(false);

        if (Platform.OS === 'android') {
          ToastAndroid.show(
            'Activa el Bluetooth para conectar el dispositivo',
            ToastAndroid.LONG
          );
        } else {
          Alert.alert(
            'Bluetooth apagado',
            'Activa el Bluetooth para conectar el dispositivo'
          );
        }

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
    <LinearGradient
      colors={['#2563EB', '#38BDF8', '#F8FAFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <View style={styles.safeArea}>

        {/* HEADER */}
        <View style={styles.header}>
          <Text style={styles.title}>Panel del Docente</Text>
          <SettingsModal/>
        </View>

        {/* TARJETA DOCENTE */}
        <View style={styles.card}>
          <Image
            source={require('../../assets/Profe.png')}
            style={styles.avatar}
          />
          <Text style={styles.name}>
            {docente.nombre} {docente.apellido}
          </Text>
          <Text style={styles.aula}>
            {docente.aula.nombre}
          </Text>
        </View>

        {/* SECCIÓN PRINCIPAL */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate('Students', {
                docenteId: docente.id,
                docenteDetail: docente,
              })
            }
          >
            <Text style={styles.buttonTextPrimary}>Gestionar Alumnos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              !connected && styles.disabledButton,
            ]}
            disabled={!connected}
            onPress={() =>
              navigation.navigate('ChooseStudentGame', {
                docenteDetail: docente,
              })
            }
          >
            <Text style={styles.buttonTextSecondary}>
              Práctica Rápida
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.secondaryButton,
              !connected && styles.disabledButton,
            ]}
            disabled={!connected}
            onPress={() =>
              navigation.navigate('GameLevel', {
                docenteDetail: docente,
              })
            }
          >
            <Text style={styles.buttonTextSecondary}>
              Niveles
            </Text>
          </TouchableOpacity>

          {!connected && (
            <Text style={styles.helperText}>
              Conecta el dispositivo para iniciar actividades.
            </Text>
          )}
        </View>

        {/* SECCIÓN DISPOSITIVO */}
        <View style={styles.deviceCard}>
          <Text style={styles.deviceTitle}>Dispositivo del Aula</Text>

          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: connected ? '#22C55E' : '#EF4444' },
              ]}
            />
            <Text style={styles.statusText}>
              {isScanning
                ? 'Buscando dispositivo...'
                : connected
                ? 'Conectado'
                : 'Desconectado'}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.connectButton}
            onPress={handleDeviceToggle}
            disabled={isScanning}
          >
            <Text style={styles.connectText}>
              {connected ? 'Desconectar' : 'Conectar'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  settingsButton: {
    padding: 6,
  },

  settingsIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  /* TARJETA DOCENTE */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },

  avatar: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },

  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#334155',
  },

  aula: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },

  /* SECCIÓN */
  section: {
    marginBottom: 20,
  },

  /* BOTÓN PRINCIPAL */
  primaryButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 15,
  },

  buttonTextPrimary: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  /* BOTONES SECUNDARIOS */
  secondaryButton: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 15,
  },

  buttonTextSecondary: {
    color: '#1E293B',
    fontSize: 15,
    fontWeight: '500',
  },

  disabledButton: {
    opacity: 0.5,
  },

  helperText: {
    fontSize: 13,
    color: '#E2E8F0',
    marginTop: 5,
    textAlign: 'center',
  },

  /* DISPOSITIVO */
  deviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  deviceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 10,
  },

  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  statusText: {
    fontSize: 14,
    color: '#334155',
  },

  connectButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  connectText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },

  /* FOOTER */
  logoutButton: {
    marginTop: 28,
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 30,
    backgroundColor: '#EF4444',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },

  logoutText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
});