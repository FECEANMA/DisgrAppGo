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
import LinearGradient from 'react-native-linear-gradient';
import SettingsModal from '../components/SettingsModal';

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
    <LinearGradient
      colors={['#2563EB', '#38BDF8', '#F8FAFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerIcon}>⬅️</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Estudiante</Text>
          <SettingsModal/>
        </View>

        {/* Card de formulario */}
        <View style={styles.card}>
          {/* Avatar */}
          <View style={styles.avatar}>
            <Text style={styles.avatarIcon}>👤➕</Text>
          </View>

          {/* Inputs */}
          <Text style={styles.label}>Nombre</Text>
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
          />

          <Text style={styles.label}>Apellido</Text>
          <TextInput
            style={styles.input}
            value={apellido}
            onChangeText={setApellido}
          />

          <Text style={styles.label}>Edad</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={edad}
            onChangeText={(text) => setEdad(text.replace(/[^0-9]/g, ""))}
          />

          {/* Botón Guardar */}
          <TouchableOpacity style={styles.saveButton} onPress={handlerAddStudent}>
            <Text style={styles.saveText}>Guardar</Text>
          </TouchableOpacity>
        </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 40,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },

  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
    alignItems: 'center',
    marginTop: 50
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#D6C68E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarIcon: {
    fontSize: 32,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    alignSelf: 'flex-start',
    marginBottom: 6,
    marginLeft: 10,
  },
  input: {
    width: '100%',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1E293B',
    marginBottom: 15,
  },

  saveButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 14,
    width: '60%',
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});
