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
import LinearGradient from 'react-native-linear-gradient';
import SettingsModal from '../components/SettingsModal';

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
      <LinearGradient
        colors={['#2563EB', '#38BDF8', '#F8FAFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Home & Settings */}
        <TouchableOpacity style={styles.home} onPress={() => navigation.goBack()}>
          <Text style={{ fontSize: 24 }}>🏠</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settings}>
          <SettingsModal/>
        </TouchableOpacity>

        <View style={styles.container}>
          {/* Search Input */}
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar estudiante..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {filteredStudents.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20, color: '#334155' }}>
              No hay estudiantes en este nivel
            </Text>
          ) : (
            <FlatList
              data={filteredStudents}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => selectStudent(item)}>
                  <Image
                    source={item.imageUrl ? { uri: item.imageUrl } : require('../../assets/Niño1.png')}
                    style={styles.avatar}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>{item.nombre} {item.apellido}</Text>
                    <Text style={styles.text}>{item.edad} años</Text>
                    <Text style={styles.text}>{item.aula.nombre}</Text>
                  </View>
                  <Ionicons name="play-circle" size={32} color="#22C55E" />
                </TouchableOpacity>
              )}
              contentContainerStyle={{ paddingBottom: 30 }}
            />
          )}
        </View>
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  home: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 2,
  },
  settings: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 2,
  },
  container: {
    flex: 1,
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  searchInput: {
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 15,
    color: '#1E293B',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 15,
    marginBottom: 15,
    alignItems: 'center',
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
    fontWeight: '700',
    fontSize: 16,
    color: '#1E293B',
  },
  text: {
    fontSize: 14,
    color: '#64748B',
  },
});