// src/screens/ChooseStudentGameScreen.tsx
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput
} from 'react-native';
import { API_BASE_URL } from '../config';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import SettingsModal from '../components/SettingsModal';

export default function ChooseStudentGameScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { docenteDetail } = route.params;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/estudiantes/docente/${docenteDetail.id}`);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchStudents();
    }, [docenteDetail.id])
  );

  const selectStudent = (student: any) => {
    navigation.navigate('TypeGame', { studentId: student.id });
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  const filteredStudents = students.filter(student =>
    `${student.nombre} ${student.apellido}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <LinearGradient
      colors={['#2563EB', '#38BDF8', '#F8FAFC']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24 }}>🏠</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Seleccionar Alumno</Text>
        <SettingsModal/>
      </View>

      {/* BUSCADOR */}
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar estudiante..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* LISTA DE ESTUDIANTES */}
      <FlatList
        data={filteredStudents}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No se encontraron estudiantes.</Text>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => selectStudent(item)}
          >
            <Image
              source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/Niño1.png')}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{item.nombre} {item.apellido}</Text>
              <Text style={styles.text}>{item.edad} años • {item.aula.nombre}</Text>
            </View>
            <Ionicons name="play-circle" size={36} color="#4CAF50" />
          </TouchableOpacity>
        )}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 50,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginHorizontal: 20,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
    color: '#1E293B',
  },
  text: {
    fontSize: 14,
    color: '#64748B',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#64748B',
  },
});