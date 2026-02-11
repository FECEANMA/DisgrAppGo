// src/screens/StudentLevelGameScreen.tsx
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
import ScreenWrapper from '../components/ScreenWrapper';

export default function StudentLevelGameScreen() {
  const navigation: any = useNavigation();
  const route: any = useRoute();
  const { docenteDetail, levelId } = route.params;

  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = async () => {
    try {
      setLoading(true);
        const response = await fetch(`${API_BASE_URL}/estudiantes/docente/${docenteDetail.id}/level/${levelId}`);
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
    }, [docenteDetail.id, levelId])
  );

  const selectStudent = (student: any) => {
    navigation.navigate('GameLevel1', { studentId: student.id, levelId: levelId });
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
    <ScreenWrapper>
      
      <TouchableOpacity style={styles.home} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 24 }}>🏠</Text>
      </TouchableOpacity>

      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar estudiante..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {filteredStudents.length === 0 ? (
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay estudiantes en este nivel</Text>
        ) : (
        <FlatList
            data={filteredStudents}
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
        )}
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
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
