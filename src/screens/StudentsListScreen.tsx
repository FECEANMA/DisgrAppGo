// src/screens/StudentsListScreen.tsx
import { useNavigation, useRoute } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { API_BASE_URL } from "../config";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; 

export default function StudentsListScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { docenteDetail } = route.params;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <ImageBackground
      source={require('../../assets/login.png')}
      style={styles.background}
    >
      <View style={styles.blueOverlay} />
      <TouchableOpacity style={styles.home} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 24 }}>🏠</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.settings}>
        <Text style={{ fontSize: 20 }}>⚙️</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddStudents', {docenteDetail: docenteDetail})}
          style={styles.newButton}
        >
          <Text style={styles.newText}>+ Nuevo Alumno</Text>
        </TouchableOpacity>

        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('ProfileStudent', { student: item })}
                style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}
              >
                <Image 
                  source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/Niño1.png')} 
                  style={styles.avatar} 
                />
                <View>
                  <Text style={styles.name}>{item.nombre} {item.apellido}</Text>
                  <Text style={styles.text}>{item.edad} años</Text>
                  <Text style={styles.text}>{item.aula.nombre}</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => confirmDelete(item)}
              >
                <Ionicons name="trash" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}
        />
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
    paddingTop: 130,
    paddingHorizontal: 20,
  },
  newButton: {
    backgroundColor: '#7CFF6B',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    width: '60%',
    alignSelf: 'center'
  },
  newText: {
    fontWeight: 'bold',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 14,
  },
  deleteIcon: {
    backgroundColor: '#FF4C4C',
    padding: 8,
    borderRadius: 50,
  },
});