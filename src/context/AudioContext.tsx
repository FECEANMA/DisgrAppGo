import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Audio } from 'expo-av';

interface AudioContextProps {
  musicEnabled: boolean;
  setMusicEnabled: (value: boolean) => void;
  musicVolume: number;
  setMusicVolume: (value: number) => void;
}

const AudioContext = createContext<AudioContextProps | null>(null);

export const AudioProvider = ({ children }: any) => {
  const soundRef = useRef<Audio.Sound | null>(null);

  const [musicEnabled, setMusicEnabled] = useState(true);
  const [musicVolume, setMusicVolume] = useState(0.1);

  // 🎵 Cargar música
  useEffect(() => {
    const loadMusic = async () => {
      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/musicaFondo.mp3'),
        {
          shouldPlay: musicEnabled,
          isLooping: true,
          volume: musicVolume,
        }
      );

      soundRef.current = sound;
        await Audio.setAudioModeAsync({
            staysActiveInBackground: false,
        });
    };

    loadMusic();

    return () => {
      soundRef.current?.unloadAsync();
    };
  }, []);

  // 🎚 Controlar play / pause
  useEffect(() => {
    if (!soundRef.current) return;

    if (musicEnabled) {
      soundRef.current.playAsync();
    } else {
      soundRef.current.pauseAsync();
    }
  }, [musicEnabled]);

  // 🔊 Controlar volumen
  useEffect(() => {
    if (!soundRef.current) return;
    soundRef.current.setVolumeAsync(musicVolume);
  }, [musicVolume]);

  return (
    <AudioContext.Provider
      value={{
        musicEnabled,
        setMusicEnabled,
        musicVolume,
        setMusicVolume,
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio debe usarse dentro de AudioProvider');
  }
  return context;
};
