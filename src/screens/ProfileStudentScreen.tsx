//src/screens/ProfileStudentScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image,   ImageBackground,   TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from "../config";

export default function ProfileStudentScreen() {
  const route: any = useRoute();
  const navigation: any = useNavigation();
  const { student: initialStudent } = route.params;
  const [student, setStudent] = useState(initialStudent);

  useFocusEffect(
    React.useCallback(() => {
      const fetchStudent = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/estudiantes/${initialStudent.id}`);
          const data = await response.json();
          setStudent(data);
        } catch (error) {
          console.error('Error fetching student:', error);
        }
      };

      fetchStudent();
    }, [initialStudent.id])
  );

  return (
    <ImageBackground
      source={require("../../assets/login.png")}
      style={styles.background}
      resizeMode="cover"
    >
    <View style={styles.blueOverlay} />
    {/* Botón Home */}
    <TouchableOpacity
      style={styles.home}
      onPress={() => navigation.goBack()}
    >
      <Text style={{ fontSize: 24 }}>⬅️</Text>
    </TouchableOpacity>

    {/* Config */}
    <TouchableOpacity style={styles.settings}>
      <Text style={{ fontSize: 20 }}>⚙️</Text>
    </TouchableOpacity>

    <View style={styles.container}>
      {/* Información del alumno */}
      <View style={styles.profileCard}>
      
        <Image
          source={ student.imageUrl ? { uri: student.imageUrl } : require('../../assets/Niño1.png')} 
          style={styles.avatar}
          resizeMode="cover"
        />

          <Text style={styles.name}>{student.nombre} {student.apellido}</Text>
          <Text>{student.edad} años</Text>
          <Text>{student.aula.nombre}</Text>
      </View>
      
      {/* Botón Editar */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() =>
          navigation.navigate('EditStudentScreen', { student })
        }
      >
        <Text style={styles.editText}>✏️ Editar Estudiante</Text>
      </TouchableOpacity>

      {/* Progreso */}
      <View style={styles.progressCard}>
        <Text style={styles.sectionTitle}>Progreso General</Text>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              { width: `${student.progresoGeneral}%` }
            ]}
          />
        </View>

        <Text style={styles.percent}>{student.progresoGeneral}%</Text>

        <Text style={styles.sectionTitle}>Total de Prácticas</Text>
        <Text style={styles.value}>{student.totalPracticas}</Text>

        <Text style={styles.sectionTitle}>Nivel Actual</Text>
        <Text style={styles.value}>{student.nivelActual.nombre}</Text>

        <Text style={styles.sectionTitle}>Dificultades Detectadas</Text>
        <View style={styles.difficultyBox}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {student.observacion || 'Sin dificultades detectadas'}
          </Text>
        </View>
      </View>
    </View>
  </ImageBackground>
  );
}
const styles = StyleSheet.create({
    blueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 80, 180, 0.25)",
  },
    background: {
    flex: 1,
  },
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
    zIndex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 120
  },
  profileCard: {
    backgroundColor: '#D8CF9C',
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  progressCard: {
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 20,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginTop: 10,
  },
  value: {
    fontSize: 18,
    color: '#4CAF50',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  percent: {
    textAlign: 'center',
    marginBottom: 10,
  },
  difficultyBox: {
    backgroundColor: '#F25C5C',
    borderRadius: 10,
    marginTop: 8,
    padding: 10,
  },
  editButton: {
    backgroundColor: '#FFD966',
    borderRadius: 15,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  editText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
});
