// src/screens/EditStudentScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { API_BASE_URL } from "../config";
import ScreenWrapper from '../components/ScreenWrapper';

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
    <ScreenWrapper>
      <TouchableOpacity style={styles.home} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 24 }}>⬅️</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Editar Estudiante</Text>

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
            value={edad}
            onChangeText={setEdad}
            keyboardType="numeric"
          />

          <Text style={styles.label}>Dificultades Detectadas</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={observacion}
            onChangeText={setObservacion}
            multiline
          />

          <TouchableOpacity style={styles.saveButton} onPress={handlerEditStudent}>
            <Text style={styles.saveText}>Guardar Cambios</Text>
          </TouchableOpacity>
        </View>
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
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 120,
  },
  card: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    padding: 15,
    marginTop: 20,
    alignItems: 'center',
  },
  saveText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
