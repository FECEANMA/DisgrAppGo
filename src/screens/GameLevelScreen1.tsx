// src/screens/GameLevelScreen1.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground,
  Animated,
  ActivityIndicator
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from "../config";
import { MaterialIcons } from '@expo/vector-icons'; 
import { useBLE } from '../context/BLEContext';
import { ResizeMode, Video } from 'expo-av';
import SettingsModal from '../components/SettingsModal';

export default function GameLevelScreen1() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { studentId, levelId } = route.params;

  const [typePractice, setTypePractice] = useState<any>();
  const [availableIds, setAvailableIds] = useState<number[]>([]);
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [loading, setLoading] = useState(true); // <-- Nueva bandera de carga
  const fadeAnim = useRef(new Animated.Value(0)).current; // Para animación fade-in
  const [wordIds, setWordIds] = useState<number[]>([]);
  const [consonantIds, setConsonantIds] = useState<number[]>([]);
  const [phase, setPhase] = useState<"words" | "consonants" | "vowels">("words");
  const [vowelIds, setVowelIds] = useState<number[]>([]);

  const isPracticeLoaded = !!typePractice;
  const { device } = useBLE();

  useEffect(() => {
    if (!loading) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
  }, [loading]);

  // Enviar texto al ESP32
  const sendToESP32 = async (text: string) => {
    if (!device) return;

    try {
      const services = await device.services();
      for (const service of services) {
        if (service.uuid === "12345678-1234-1234-1234-1234567890ab") {
          const characteristics = await service.characteristics();
          for (const c of characteristics) {
            if (c.uuid === "abcd1234-5678-90ab-cdef-1234567890ab") {
              const base64Text = btoa(unescape(encodeURIComponent(text)));
              await c.writeWithResponse(base64Text);
              console.log('Texto enviado:', text);
            }
          }
        }
      }
    } catch (e) {
      console.log('Error enviando a ESP32:', e);
    }
  };

  // Enviar texto al ESP32 cada vez que cambia la práctica
  useEffect(() => {
    if (typePractice) {
      const texto = typePractice.caracter || typePractice.texto;
      sendToESP32(texto);
    }
  }, [typePractice]);

// Cargar IDs disponibles según levelId
useEffect(() => {
  const loadIdsAndFirstPractice = async () => {
    setLoading(true);
    try {
      let ids: number[] = [];

      if (levelId === 1) {
        // Nivel 1: solo letras (vocales)
        const res = await fetch(`${API_BASE_URL}/practica/letras/ids`);
        ids = await res.json();
        setAvailableIds(ids);
        setPhase("words"); // por compatibilidad
      } 
      else if (levelId === 2) {
        // Nivel 2: palabras + consonantes separadas
        const resWords = await fetch(`${API_BASE_URL}/practica/palabras/ids`);
        const words: number[] = await resWords.json();

        const resConsonants = await fetch(`${API_BASE_URL}/practica/consonantes/ids`);
        const consonants: number[] = await resConsonants.json();

        setWordIds(words);
        setConsonantIds(consonants);

        ids = words; // empezamos con palabras
        setPhase("words");
        setAvailableIds(ids);
      }
      else if (levelId === 3) {
        // Nivel 3: palabras → consonantes → vocales
        const resWords = await fetch(`${API_BASE_URL}/practica/palabras/ids`);
        const words: number[] = await resWords.json();

        const resConsonants = await fetch(`${API_BASE_URL}/practica/consonantes/ids`);
        const consonants: number[] = await resConsonants.json();

        const resVowels = await fetch(`${API_BASE_URL}/practica/letras/ids`);
        const vowels: number[] = await resVowels.json();

        setWordIds(words);
        setConsonantIds(consonants);
        setVowelIds(vowels);

        ids = words; // empezamos con palabras
        setPhase("words");
        setAvailableIds(ids);
      }

      // Primer ID
      const firstId = ids[0];
      setCurrentId(firstId);
      setUsedIds([firstId]);
    } catch (error) {
      console.error("Error loading ids:", error);
    }
  };

  loadIdsAndFirstPractice();
}, [levelId]);

  // Cargar práctica actual
  useEffect(() => {
    if (currentId !== null) {
      fetchPractice(currentId);
    }
  }, [currentId]);

  // Cronómetro
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (started) {
      interval = setInterval(() => setSeconds(prev => prev + 1), 1000);
    }

    return () => clearInterval(interval);
  }, [started]);

  // Fetch de práctica según levelId y si es letra o palabra
  const fetchPractice = async (id: number) => {
    try {
      let endpoint = "";

      if (levelId === 1) {
        endpoint = `/practica/letra/${id}`;
      } 
      else if (levelId === 2) {
        if (phase === "words") {
          endpoint = `/practica/palabra/${id}`;
        } else {
          endpoint = `/practica/letra/${id}`; // 👈 consonantes
        }
      }
      else if (levelId === 3) {
        if (phase === "words") endpoint = `/practica/palabra/${id}`;
        else endpoint = `/practica/letra/${id}`; // consonantes o vocales
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();
      setTypePractice(data);
      console.log(id, data);
    } catch (error) {
      console.error('Error fetching practice:', error);
    } finally {
      setLoading(false); // <-- Termina la animación de carga
    }
  };

// Sumar progreso y nivel al terminar el nivel
const upLevelProgress = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/estudiantes/${studentId}/sumar-progreso/${levelId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) throw new Error('Error al sumar progreso');
    const data = await response.json();
    console.log('Progreso sumado:', data);
  } catch (error) {
    console.error('Error al sumar progreso y nivel:', error);
  }
};

// Modificar handleStartNext para llamar ambos endpoints al terminar
const handleStartNext = async () => {
  if (!started) {
    setStarted(true);
    return;
  }

  const remainingIds = availableIds.filter(id => !usedIds.includes(id));

  if (remainingIds.length === 0) {
    if (levelId === 2) {
      if (phase === "words") {
        setPhase("consonants");
        setAvailableIds(consonantIds);
        setUsedIds([]);
        setCurrentId(consonantIds[0]);
        return;
      }
    } else if (levelId === 3) {
      // Pasar a la siguiente fase
      if (phase === "words") {
        setPhase("consonants");
        setAvailableIds(consonantIds);
        setUsedIds([]);
        setCurrentId(consonantIds[0]);
        return;
      } else if (phase === "consonants") {
        setPhase("vowels");
        setAvailableIds(vowelIds);
        setUsedIds([]);
        setCurrentId(vowelIds[0]);
        return;
      }
    }

    // Si ya terminó la última fase → terminar nivel
    await upPointPractice();
    await upLevelProgress();
    navigation.goBack();
    return;
  }

  const nextId = remainingIds[Math.floor(Math.random() * remainingIds.length)];
  setUsedIds(prev => [...prev, nextId]);
  setCurrentId(nextId);
};


  // Sumar práctica al estudiante
  const upPointPractice = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/estudiantes/${studentId}/sumar-practica`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('Error al sumar práctica');
      const data = await response.json();
      console.log('Práctica sumada:', data);
    } catch (error) {
      console.error('Error al sumar puntos al student', error);
    }
  };

  const getButtonText = () => {
    if (!started) return "Iniciar Nivel";
    return usedIds.length === availableIds.length ? "Terminar Práctica" : "Siguiente";
  };

  if (loading) {
    // Pantalla de carga animada
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={{ marginTop: 10, color: '#2563EB', fontWeight: 'bold' }}>Cargando práctica...</Text>
      </View>
    );
  }

  return (
    <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
    <ImageBackground source={require('../../assets/login.png')} style={styles.background}>
      <View style={styles.blueOverlay} />

      <TouchableOpacity style={styles.home} onPress={() => navigation.goBack()}>
        <Text style={{ fontSize: 24 }}>⬅️</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.settings}>
        <SettingsModal/>
      </TouchableOpacity>

      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>{typePractice?.tipoPractica?.nombre ?? "Cargando"}</Text>
      </View>

      <View style={styles.centerIcon}>
        {typePractice?.imageUrl ? (
          <Image source={{ uri: API_BASE_URL + typePractice.imageUrl }} style={styles.practiceImage} resizeMode="contain" />
        ) : (
          <MaterialIcons name="image" size={150} color="#ccc" />
        )}
      </View>

      {/* Video */}
      <View style={styles.videoContainer}>
        {typePractice?.videoUrl ? (
          <Video
            source={{ uri: API_BASE_URL + typePractice.videoUrl }}
            style={styles.video}
            useNativeControls
            resizeMode={ResizeMode.CONTAIN}
            isLooping
          />
        ) : (
          <View style={styles.playButton}>
            <Text style={styles.playIcon}>▶</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.startButton, !isPracticeLoaded && styles.startButtonDisabled]}
        onPress={handleStartNext}
        disabled={!isPracticeLoaded}
      >
        <Text style={styles.startText}>{isPracticeLoaded ? getButtonText() : "Cargando..."}</Text>
      </TouchableOpacity>

      {started && (
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>⏱ {seconds}s</Text>
        </View>
      )}
    </ImageBackground>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F0F9FF' },
  background: { flex: 1, alignItems: 'center' },
  blueOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: "rgba(0, 80, 180, 0.25)" },
  home: { position: 'absolute', top: 40, left: 20, zIndex: 1 },
  settings: { position: 'absolute', top: 40, right: 20 },
  icon: { fontSize: 26 },
  levelContainer: { marginTop: 80, backgroundColor: '#2ECC71', paddingHorizontal: 40, paddingVertical: 10, borderRadius: 30 },
  levelText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  centerIcon: { marginTop: 40 },
  typeBadge: { marginTop: 10, backgroundColor: '#6C7BFF', paddingHorizontal: 30, paddingVertical: 8, borderRadius: 20 },
  typeText: { color: '#fff', fontWeight: 'bold' },
  playButton: { marginTop: 40, backgroundColor: '#FF3B3B', width: 160, height: 110, borderRadius: 30, alignItems: 'center', justifyContent: 'center' },
  playIcon: { color: '#fff', fontSize: 50, fontWeight: 'bold' },
  startButton: { marginTop: 30, backgroundColor: '#6C7BFF', paddingHorizontal: 50, paddingVertical: 12, borderRadius: 30 },
  startText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  practiceImage: { width: 200, height: 200, borderRadius: 20 },
  startButtonDisabled: { backgroundColor: '#999', opacity: 0.6 },
  videoContainer: {
    marginTop: 40,
    width: 260,
    height: 160,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  timerContainer: {
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)', // fondo semitransparente
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 50, // circular
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5, // para Android
  },
  timerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
