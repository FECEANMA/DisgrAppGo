// src/screens/RegisterTeacherScreen.tsx
import React, { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
  ScrollView,
  FlatList,
} from "react-native";
import { API_BASE_URL } from "../config";
import LinearGradient from 'react-native-linear-gradient';

interface Aula {
  id: number;
  nombre: string;
}

const RegisterTeacherScreen: React.FC = () => {
  const navigation: any = useNavigation();

  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [aulaId, setAulaId] = useState<number | null>(null);
  const [aulas, setAulas] = useState<Aula[]>([]);

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/aulas`);
        const data = await response.json();
        setAulas(data);
      } catch (error) {
        console.error("Error al obtener aulas:", error);
      }
    };
    fetchAulas();
  }, []);

  const handleRegister = async () => {
    if (!nombre || !apellido || !email || !password) {
      alert("Completa todos los campos");
      return;
    }
    
    if (aulaId === null) {
      alert("Por favor selecciona un aula");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/docentes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          email,
          password,
          aulaId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
        return;
      }

      const data = await response.json();
      navigation.navigate("Login");
    } catch (error) {
      console.error(error);
      alert("Error al registrar docente");
    }
  };

  return (
      <LinearGradient
        colors={['#2563EB', '#38BDF8', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* LOGO */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../assets/logo.jpg")}
              style={styles.logo}
            />
            <Text style={styles.logoText}>DigrAppGo!</Text>
            <Text style={styles.subtitle}>Registro de Profesor</Text>
          </View>

          {/* TARJETA FORM */}
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Nombres"
              placeholderTextColor="#94A3B8"
              value={nombre}
              onChangeText={setNombre}
            />
            <TextInput
              style={styles.input}
              placeholder="Apellidos"
              placeholderTextColor="#94A3B8"
              value={apellido}
              onChangeText={setApellido}
            />
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

            <Text style={styles.label}>Selecciona un aula:</Text>
            <FlatList
              horizontal
              data={aulas}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.aulasContainer}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.aulaButton,
                    aulaId === item.id && styles.aulaButtonSelected,
                  ]}
                  onPress={() => setAulaId(item.id)}
                >
                  <Text
                    style={[
                      styles.aulaText,
                      aulaId === item.id && styles.aulaTextSelected,
                    ]}
                  >
                    {item.nombre}
                  </Text>
                </TouchableOpacity>
              )}
            />

            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerText}>Registrarse</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>¿Ya tienes cuenta? Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
  );
};

export default RegisterTeacherScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingHorizontal: 24, paddingTop: 60, alignItems: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 30 },
  logo: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#fff' },
  logoText: { marginTop: 10, fontSize: 24, fontWeight: '700', color: '#FFFFFF' },
  subtitle: { marginTop: 5, fontSize: 16, color: '#FFFFFF' },
  card: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    color: '#1E293B',
    marginBottom: 15,
  },
  label: {
    color: '#1E293B',
    fontWeight: '600',
    marginBottom: 10,
  },
  aulasContainer: { paddingHorizontal: 5, marginBottom: 15 },
  aulaButton: {
    backgroundColor: '#E2E8F0',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  aulaButtonSelected: {
    backgroundColor: '#2563EB',
  },
  aulaText: { color: '#1E293B', fontWeight: '600' },
  aulaTextSelected: { color: '#fff', fontWeight: '700' },
  registerButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  registerText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
  backText: { marginTop: 20, color: '#2563EB', fontWeight: '600', textAlign: 'center' },
});