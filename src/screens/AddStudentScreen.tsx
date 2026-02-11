//src/screens/AddStudentScreen.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { API_BASE_URL } from "../config";
import ScreenWrapper from '../components/ScreenWrapper';

export default function AddStudentScreen() {
  const navigation: any = useNavigation();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [edad, setEdad] = useState("");
  const route: any = useRoute();
  const { docenteDetail } = route.params;

  const handlerAddStudent = async () => {
    if (!nombre || !apellido || !edad) {
      alert("Completa todos los campos");
      return;
    }

    if (isNaN(Number(edad)) || Number(edad) <= 0) {
      alert("La edad debe ser un número válido");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/estudiantes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre,
          apellido,
          edad: Number(edad),
          docenteId: docenteDetail.id,
          aulaId: docenteDetail.aula.id,
          nivelActualId: 1
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert("Error: " + errorData.message);
        return;
      }

      const data = await response.json();
      navigation.goBack();
    } catch (error) {
      console.error(error);
      alert("Error al registrar Estudiante");
    }
  }

  return (
    <ScreenWrapper>
      {/* Botón Home */}
      <TouchableOpacity
        style={styles.home}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: 24 }}>⬅️</Text>
      </TouchableOpacity>

      {/* Icono ajustes */}
      <TouchableOpacity style={styles.settings}>
        <Text style={{ fontSize: 20 }}>⚙️</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👤➕</Text>
          </View>
        </View>

        {/* Inputs */}
        <Text style={styles.label}>Nombre</Text>
        <TextInput style={styles.input}
          value={nombre}
          onChangeText={setNombre} 
        />

        <Text style={styles.label}>Apellido</Text>
          <TextInput style={styles.input} 
          value={apellido}
          onChangeText={setApellido}
        />

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={edad}
          onChangeText={(text) => {
            const onlyNumbers = text.replace(/[^0-9]/g, "");
            setEdad(onlyNumbers);
          }}
        />

        {/* Botón */}
        <TouchableOpacity onPress={handlerAddStudent} style={styles.saveButton} >
          <Text style={styles.saveText}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  home: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  settings: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D6C68E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    fontSize: 30,
  },
  label: {
    color: '#060000',
    fontWeight: '600',
    marginBottom: 6,
    width: '75%',
    alignSelf: 'center',
    fontSize: 14,
  },
  input: {
    backgroundColor: 'rgba(120,120,120,0.9)',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    color: '#fff',
    marginBottom: 15,
    width: '75%',
    alignSelf: 'center'
  },
  saveButton: {
    backgroundColor: '#7CFF6B',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 20,
    width: '60%',
    alignSelf: 'center'
  },
  saveText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
