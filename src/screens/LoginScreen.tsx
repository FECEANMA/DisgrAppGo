//src/screens/LoginScreen.tsx
import React, { useState } from "react";
import { useNavigation } from '@react-navigation/native';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground
} from "react-native";
import { saveDocente } from '../utils/session';
import { API_BASE_URL } from "../config";
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import LinearGradient from 'react-native-linear-gradient';


const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation: any = useNavigation();

  useFocusEffect(
    useCallback(() => {
      setEmail('');
      setPassword('');
    }, [])
  );

  const handleLogin = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/docentes/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Error: ' + errorData.message);
        return;
      }

      const docente = await response.json();

      await saveDocente(docente);

      navigation.navigate('Home');
    } catch (error) {
      console.error(error);
      alert('Error al iniciar sesión');
    }
  };

  const handleForgotPassword = () => {
    console.log("Olvidaste tu contraseña");
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
      <LinearGradient
        colors={['#2563EB', '#38BDF8', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        {/* LOGO */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.jpg')}
            style={styles.logo}
          />
          <Text style={styles.logoText}>DigrAppGo!</Text>
        </View>

        {/* TARJETA LOGIN */}
        <View style={styles.card}>
          <TextInput
            style={styles.input}
            placeholder="Correo institucional"
            placeholderTextColor="#94A3B8"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginText}>Iniciar sesión</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerText}>¿No tienes cuenta? Regístrate</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#fff',
  },
  logoText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#1E293B',
    marginBottom: 15,
  },
  loginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  loginText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  registerButton: {
    marginTop: 12,
    alignItems: 'center',
  },
  registerText: {
    color: '#2563EB',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});