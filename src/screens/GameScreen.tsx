//src/screens/GameScreen.tsx
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageBackground
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { API_BASE_URL } from "../config";
import { MaterialIcons } from '@expo/vector-icons'; 
import { useBLE } from '../context/BLEContext';
import { ResizeMode, Video } from 'expo-av';

export default function GameScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const [typePractice, setTypePractice] = useState<any>();
  const { studentId, typeOrder } = route.params;
  const [availableIds, setAvailableIds] = useState<number[]>([]);
  const [usedIds, setUsedIds] = useState<number[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [started, setStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const isPracticeLoaded = !!typePractice;
  const { device } = useBLE();

  const sendToESP32 = async (text: string) => {
    if (!device) return;

    try {
      const services = await device.services();
      for (const service of services) {
        if (service.uuid === "12345678-1234-1234-1234-1234567890ab") {
          const characteristics = await service.characteristics();
          for (const c of characteristics) {
            if (c.uuid === "abcd1234-5678-90ab-cdef-1234567890ab") {
              // React Native no tiene Buffer, usamos btoa
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

  useEffect(() => {
    if (typePractice) {
      const texto = typePractice.caracter || typePractice.texto;
      sendToESP32(texto);
    }
  }, [typePractice]);

  useEffect(() => {
    const loadIdsAndFirstPractice = async () => {
      try {
        const endpoint =
          typeOrder.includes("word")
            ? "/practica/palabras/ids"
            : "/practica/letras/ids";

        const res = await fetch(`${API_BASE_URL}${endpoint}`);
        const ids: number[] = await res.json();

        setAvailableIds(ids);

        let firstId: number;

        if (typeOrder === "Random vowels") {
          firstId = ids[Math.floor(Math.random() * ids.length)];
        } else {
          firstId = ids[0]; // Ordered
        }

        setCurrentId(firstId);
        setUsedIds([firstId]);
      } catch (error) {
        console.error("Error loading ids:", error);
      }
    };

    loadIdsAndFirstPractice();
  }, []);

  useEffect(() => {
    if (currentId !== null) {
      fetchPractice(currentId);
    }
  }, [currentId]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (started) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [started]);

  const fetchPractice = async (id: number) => {
    try {
      const endpoint =
        typeOrder === "Ordered words"
          ? `/practica/palabra/${id}`
          : `/practica/letra/${id}`;

      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      const data = await response.json();
      setTypePractice(data);
      console.log(id, data)
    } catch (error) {
      console.error('Error fetching practice:', error);
    }
  };

  const handleStartNext = async () => {
    // ▶️ INICIAR
    if (!started) {
      setStarted(true);
      return;
    }

    // IDs restantes
    const remainingIds = availableIds.filter(
      id => !usedIds.includes(id)
    );

    // 🏁 TERMINAR
    if (remainingIds.length === 0) {
      await upPointPractice();
      navigation.goBack();
      return;
    }

    // 🔁 SIGUIENTE ID
    let nextId: number;

    if (typeOrder === "Random vowels") {
      nextId = remainingIds[
        Math.floor(Math.random() * remainingIds.length)
      ];
    } else {
      nextId = remainingIds[0]; // ordered
    }

    setUsedIds(prev => [...prev, nextId]);
    setCurrentId(nextId);
  };

  const upPointPractice = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/estudiantes/${studentId}/sumar-practica`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al sumar práctica');
      }

      const data = await response.json();
      console.log('Práctica sumada:', data);
    } catch (error) {
      console.error('Error al sumar puntos al student', error);
    }
  };

  const getButtonText = () => {
    if (!started) return "Iniciar Nivel";
    return usedIds.length === availableIds.length
      ? "Terminar Práctica"
      : "Siguiente";
  };

  return (
    <ImageBackground
      source={require('../../assets/login.png')}
      style={styles.background}
    >
    <View style={styles.blueOverlay} />
      {/* Botón Home */}
      <TouchableOpacity
        style={styles.home}
        onPress={() => navigation.goBack()}
      >
        <Text style={{ fontSize: 24 }}>⬅️</Text>
      </TouchableOpacity>

      {/* ⚙️ Ajustes */}
      <TouchableOpacity style={styles.settings}>
        <Text style={styles.icon}>⚙️</Text>
      </TouchableOpacity>

      <View style={styles.levelContainer}>
        <Text style={styles.levelText}>
          {typePractice?.tipoPractica?.nombre ?? "Cargando"}
        </Text>
      </View>

      <View style={styles.centerIcon}>
        {typePractice?.imageUrl ? (
          <Image
            source={{ uri: API_BASE_URL + typePractice.imageUrl }}
            style={styles.practiceImage}
            resizeMode="contain"
          />
        ) : (
          <MaterialIcons name="image" size={150} color="#ccc" />
        )}
      </View>

      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>
          {typePractice?.caracter || typePractice?.texto || "Cargando"}
        </Text>
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

      {/* Botón iniciar */}
      <TouchableOpacity
        style={[
          styles.startButton,
          !isPracticeLoaded && styles.startButtonDisabled
        ]}
        onPress={handleStartNext}
        disabled={!isPracticeLoaded}
      >
        <Text style={styles.startText}>
          {isPracticeLoaded ? getButtonText() : "Cargando..."}
        </Text>
      </TouchableOpacity>

      {started && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: '#fff', fontSize: 16 }}>
            ⏱ Tiempo: {seconds}s
          </Text>
        </View>
      )}
    </ImageBackground>
  );
}
const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: 'center',
  },
  blueOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 80, 180, 0.25)",
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
  },
  icon: {
    fontSize: 26,
  },
  levelContainer: {
    marginTop: 80,
    backgroundColor: '#2ECC71',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 30,
  },
  levelText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  centerIcon: {
    marginTop: 40,
  },
  sun: {
    fontSize: 90,
  },

  typeBadge: {
    marginTop: 10,
    backgroundColor: '#6C7BFF',
    paddingHorizontal: 30,
    paddingVertical: 8,
    borderRadius: 20,
  },
  typeText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  playButton: {
    marginTop: 40,
    backgroundColor: '#FF3B3B',
    width: 160,
    height: 110,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#fff',
    fontSize: 50,
    fontWeight: 'bold',
  },

  startButton: {
    marginTop: 30,
    backgroundColor: '#6C7BFF',
    paddingHorizontal: 50,
    paddingVertical: 12,
    borderRadius: 30,
  },
  startText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  practiceImage: {
    width: 200,
    height: 200,
    borderRadius: 20,
  },
  startButtonDisabled: {
    backgroundColor: '#999',
    opacity: 0.6,
  },
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
});
