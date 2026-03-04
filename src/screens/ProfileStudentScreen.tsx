//src/screens/ProfileStudentScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image,   ImageBackground,   TouchableOpacity } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { API_BASE_URL } from "../config";
import LinearGradient from 'react-native-linear-gradient';
import SettingsModal from '../components/SettingsModal';

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

        <View style={styles.container}>
          {/* TARJETA DEL ESTUDIANTE */}
          <View style={styles.profileCard}>
            <Image
              source={student.imageUrl ? { uri: student.imageUrl } : require('../../assets/Niño1.png')}
              style={styles.avatar}
              resizeMode="cover"
            />
            <Text style={styles.name}>{student.nombre} {student.apellido}</Text>
            <Text style={styles.age}>{student.edad} años</Text>
            <Text style={styles.aula}>{student.aula.nombre}</Text>
          </View>

          {/* BOTÓN EDITAR */}
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation.navigate('EditStudentScreen', { student })}
          >
            <Text style={styles.editText}>✏️ Editar Estudiante</Text>
          </TouchableOpacity>

          {/* PROGRESO */}
          <View style={styles.progressCard}>
            <Text style={styles.sectionTitle}>Progreso General</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${student.progresoGeneral}%` }]} />
            </View>
            <Text style={styles.percent}>{student.progresoGeneral}%</Text>

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>Prácticas</Text>
                <Text style={styles.statValue}>{student.totalPracticas}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={styles.statTitle}>Nivel</Text>
                <Text style={styles.statValue}>{student.nivelActual.nombre}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Dificultades Detectadas</Text>
            <View style={styles.difficultyBox}>
              <Text style={styles.difficultyText}>
                {student.observacion || 'Sin dificultades detectadas'}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>
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
    zIndex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 120,
  },
  profileCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    alignItems: 'center',
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  age: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  aula: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  editButton: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  editText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  progressCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginTop: 10,
    marginBottom: 5,
    color: '#1E293B',
  },
  progressBar: {
    height: 12,
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    marginVertical: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#2563EB',
    borderRadius: 10,
  },
  percent: {
    textAlign: 'center',
    marginBottom: 12,
    color: '#334155',
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statTitle: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2563EB',
  },
  difficultyBox: {
    backgroundColor: '#F25C5C',
    borderRadius: 12,
    padding: 12,
    marginTop: 6,
  },
  difficultyText: {
    color: '#FFFFFF',
    fontWeight: '700',
    textAlign: 'center',
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