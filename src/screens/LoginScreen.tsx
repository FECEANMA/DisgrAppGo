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
    <ImageBackground
      source={require('../../assets/login.png')}
      style={styles.background}
      resizeMode="cover"
    >
  <View style={styles.blueOverlay} />

    <View style={styles.container}>
      {/* LOGO */}
      <View style={styles.logoContainer}>
        <Image
        source={require('../../assets/logo.jpg')}
        style={styles.logo}
        />
        <Text style={styles.logoText}>DigrAppGo!</Text>
      </View>

      {/* INPUTS */}
      <TextInput
        style={styles.input}
        placeholder="Correo institucional"
        placeholderTextColor="#fff"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#fff"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* BOTÓN */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Iniciar sesión</Text>
      </TouchableOpacity>

      {/* OLVIDASTE CONTRASEÑA */}
      <TouchableOpacity onPress={handleForgotPassword} style={styles.forgotButton}>
        <Text style={styles.forgotText}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>
      {/* REGISTRARSE */}
      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.registerText}>
          ¿No tienes cuenta? Regístrate
        </Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  blueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 80, 180, 0.25)',
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#fff',
  },
  logoText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    backgroundColor: 'rgba(120,120,120,0.9)',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    color: '#fff',
    marginBottom: 15,
    width: '90%',
    alignSelf:'center'
  },
  loginButton: {
    backgroundColor: '#6EEB83',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 10,
    width: '60%',
    alignSelf: 'center'
  },
  loginText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 15,
    width: '60%',
    alignSelf: 'center'
  },
  forgotText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});
