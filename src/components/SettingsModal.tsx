import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Switch,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { useAudio } from '../context/AudioContext';

export default function SettingsModal() {
  const [visible, setVisible] = useState(false);

  // ✅ El hook va DENTRO del componente
  const {
    musicEnabled,
    setMusicEnabled,
    musicVolume,
    setMusicVolume,
  } = useAudio();

  return (
    <>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setVisible(true)}
      >
        <Text style={styles.settingsIcon}>⚙️</Text>
      </TouchableOpacity>

      <Modal transparent animationType="slide" visible={visible}>
        <View style={styles.overlay}>
          <View style={styles.container}>
            <Text style={styles.title}>Ajustes</Text>

            <Text style={styles.label}>Música</Text>
            <Switch
              value={musicEnabled}
              onValueChange={setMusicEnabled}
            />
            <Slider
              minimumValue={0}
              maximumValue={1}
              value={musicVolume}
              onValueChange={setMusicVolume}
              minimumTrackTintColor="#4CAF50"
            />

            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.closeText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  settingsButton: {
    padding: 6,
  },

  settingsIcon: {
    fontSize: 20,
    color: '#FFFFFF',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    marginTop: 10,
    fontWeight: 'bold',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#EF4444',
    padding: 12,
    borderRadius: 15,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
