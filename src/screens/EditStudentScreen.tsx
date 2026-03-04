// src/screens/EditStudentScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from "../config";
import LinearGradient from 'react-native-linear-gradient';
import SettingsModal from '../components/SettingsModal';

export default function EditStudentScreen() {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const { student } = route.params;

  const [nombre, setNombre] = useState(student.nombre);
  const [apellido, setApellido] = useState(student.apellido);
  const [edad, setEdad] = useState(String(student.edad));
  const [observacion, setObservacion] = useState(student.observacion || '');

const handlerEditStudent = async () => {
    if (!nombre || !apellido || !edad) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }

    if (isNaN(Number(edad)) || Number(edad) <= 0) {
      Alert.alert('Error', 'La edad debe ser un número válido');
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/estudiantes/${student.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre,
            apellido,
            edad: Number(edad),
            observacion,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Error al actualizar');
        return;
      }

      const data = await response.json();

      navigation.goBack();
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo actualizar el estudiante');
    }
  };

  return (
      <LinearGradient
        colors={['#2563EB', '#38BDF8', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Text style={{ fontSize: 20 }}>⬅️</Text>
          </TouchableOpacity>

          <SettingsModal />
        </View>
        
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.card}>
            <Text style={styles.title}>Editar Estudiante</Text>

            <Text style={styles.label}>Nombre</Text>
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Ingresa el nombre"
            />

            <Text style={styles.label}>Apellido</Text>
            <TextInput
              style={styles.input}
              value={apellido}
              onChangeText={setApellido}
              placeholder="Ingresa el apellido"
            />

            <Text style={styles.label}>Edad</Text>
            <TextInput
              style={styles.input}
              value={edad}
              onChangeText={setEdad}
              keyboardType="numeric"
              placeholder="Ej: 10"
            />

            <Text style={styles.label}>Dificultades Detectadas</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={observacion}
              onChangeText={setObservacion}
              multiline
              placeholder="Observaciones sobre el estudiante"
            />

            <TouchableOpacity style={styles.saveButton} onPress={handlerEditStudent}>
              <Text style={styles.saveText}>Guardar Cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  container: {
    padding: 20,
    paddingTop: 120,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E293B',
  },
  label: {
    fontWeight: '600',
    marginTop: 15,
    color: '#334155',
  },
  input: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
    fontSize: 15,
    color: '#1E293B',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: 25,
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 1,
  },
  headerButton: {
    padding: 10,
  },
});