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


export default function HomeScreen() {
  const navigation: any = useNavigation();
  const [connected, setConnected] = useState(false);
  const [docente, setDocente] = useState<any>(null);

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
    await removeDocente();

    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
  };

  if (!docente) return null;

  return (
    <ImageBackground
      source={require('../../assets/login.png')}
      style={styles.background}
    >
      <View style={styles.blueOverlay} />

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
          onPress={() => navigation.navigate('GameLevel')}
        >
          <Text style={styles.buttonText}>Niveles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.disconnect,
            { backgroundColor: connected ? '#4CAF50' : '#FF6B6B' },
          ]}
          onPress={() => setConnected(!connected)}
        >
          <Text style={styles.disconnectText}>
            {connected ? 'Dispositivo Conectado' : 'Conectar con Dispositivo'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.logoutButton]}
          onPress={handleLogout}
        >
          <Text style={styles.disconnectText}>Cerrar sesión</Text>
        </TouchableOpacity>

      </View>
    </ImageBackground>
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
