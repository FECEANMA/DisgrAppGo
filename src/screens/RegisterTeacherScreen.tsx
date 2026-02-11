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
import ScreenWrapper from "../components/ScreenWrapper";

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
    <ScreenWrapper>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.logoContainer}>
          <Image
            source={require("../../assets/logo.jpg")}
            style={styles.logo}
          />
          <Text style={styles.logoText}>DigrAppGo!</Text>
          <Text style={styles.subtitle}>Registro de Profesor</Text>
        </View>

        <TextInput
          style={styles.input}
          placeholder="Nombres"
          placeholderTextColor="#fff"
          value={nombre}
          onChangeText={setNombre}
        />
        <TextInput
          style={styles.input}
          placeholder="Apellidos"
          placeholderTextColor="#fff"
          value={apellido}
          onChangeText={setApellido}
        />
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

        {/* Selección de aulas horizontal */}
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
      </ScrollView>
    </ScreenWrapper>
  );
};

export default RegisterTeacherScreen;

const styles = StyleSheet.create({
  blueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 80, 180, 0.25)",
  },
  background: {
    flex: 1,
  },
  container: {
    padding: 30,
    alignItems: "center",
    paddingTop: 120,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#fff",
  },
  logoText: {
    marginTop: 10,
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    marginTop: 5,
    fontSize: 16,
    color: "#000",
  },
  input: {
    backgroundColor: "rgba(120,120,120,0.9)",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    color: "#fff",
    marginBottom: 15,
    width: "90%",
  },
  label: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "flex-start",
    marginLeft: "5%",
  },
  aulasContainer: {
    paddingHorizontal: 5,
    marginBottom: 15,
  },
  aulaButton: {
    backgroundColor: "rgba(100,100,100,0.8)",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  aulaButtonSelected: {
    backgroundColor: "#f3dc0d",
  },
  aulaText: {
    color: "#fff",
    fontWeight: "bold",
  },
  aulaTextSelected: {
    color: "#000",
  },
  registerButton: {
    backgroundColor: "#6EEB83",
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 10,
    width: "60%",
  },
  registerText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
  },
  backText: {
    marginTop: 20,
    color: "#fff",
    fontWeight: "bold",
  },
});
