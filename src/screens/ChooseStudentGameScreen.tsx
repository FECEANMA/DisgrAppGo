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
} from 'react-native';
import { API_BASE_URL } from '../config';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

export default function ChooseStudentGameScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { docenteDetail } = route.params;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <ImageBackground
      source={require('../../assets/login.png')}
      style={styles.background}
    >
      <View style={styles.blueOverlay} />
      
      <TouchableOpacity style={styles.home} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 24 }}>🏠</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <FlatList
          data={students}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => selectStudent(item)}
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
              <Ionicons name="play-circle" size={32} color="#4CAF50" />
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  blueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 80, 180, 0.25)',
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
  container: {
    flex: 1,
    paddingTop: 130,
    paddingHorizontal: 20,
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
    borderRadius: 30,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  text: {
    fontSize: 14,
  },
});
