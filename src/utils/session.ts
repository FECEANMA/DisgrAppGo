import AsyncStorage from '@react-native-async-storage/async-storage';

const DOCENTE_KEY = '@docente';

export const saveDocente = async (docente: any) => {
  try {
    await AsyncStorage.setItem(DOCENTE_KEY, JSON.stringify(docente));
  } catch (e) {
    console.error('Error guardando docente', e);
  }
};

export const getDocente = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(DOCENTE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error obteniendo docente', e);
    return null;
  }
};

export const removeDocente = async () => {
  try {
    await AsyncStorage.removeItem(DOCENTE_KEY);
  } catch (e) {
    console.error('Error eliminando docente', e);
  }
};