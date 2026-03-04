// src/screens/StudentsListScreen.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  TextInput
} from 'react-native';
import { API_BASE_URL } from "../config";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 
import LinearGradient from 'react-native-linear-gradient';
import SettingsModal from '../components/SettingsModal';

export default function StudentsListScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { docenteDetail } = route.params;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const deleteStudent = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/estudiantes/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setStudents(prev => prev.filter(s => s.id !== id));
      } else {
        console.error('Error al eliminar estudiante');
      }
    } catch (error) {
      console.error('Error al eliminar estudiante:', error);
    }
  };

  const confirmDelete = (student: any) => {
    Alert.alert(
      "Eliminar estudiante",
      `¿Estás seguro que deseas eliminar a ${student.nombre}?`,
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Eliminar", 
          style: "destructive",
          onPress: () => deleteStudent(student.id)
        }
      ]
    );
  };

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

  useEffect(() => {
    fetchStudents();
  }, [docenteDetail.id]);

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
          <Text style={styles.title}>Alumnos</Text>
          <SettingsModal/>
        </View>

        {/* NUEVO ALUMNO */}
        <TouchableOpacity
          onPress={() => navigation.navigate('AddStudents', { docenteDetail })}
          style={styles.newButton}
        >
          <Text style={styles.newText}>+ Nuevo Alumno</Text>
        </TouchableOpacity>

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
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No se encontraron estudiantes.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('ProfileStudent', { student: item })}
                style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
              >
                <Image 
                  source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/Niño1.png')} 
                  style={styles.avatar} 
                />
                <View>
                  <Text style={styles.name}>{item.nombre} {item.apellido}</Text>
                  <Text style={styles.text}>{item.edad} años • {item.aula.nombre}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => confirmDelete(item)}
              >
                <Ionicons name="trash" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          )}
        />
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  newText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
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
    marginHorizontal: 20,
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
  deleteIcon: {
    backgroundColor: '#EF4444',
    padding: 8,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#64748B',
  },
});