//src/screens/GameLevelScreen.tsx
import React from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import ScreenWrapper from '../components/ScreenWrapper';

export default function GameLevelScreen() {
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const { docenteDetail } = route.params;

    return (
        <ScreenWrapper>
            {/* Botón Home */}
            <TouchableOpacity
                style={styles.home}
                onPress={() => navigation.goBack()}
            >
                <Text style={{ fontSize: 24 }}>🏠</Text>
            </TouchableOpacity>

            {/* Icono ajustes */}
            <TouchableOpacity style={styles.settings}>
                <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>

            <View style={styles.container}>
                {/* Título */}
                <Text style={styles.title}>Selecciona tu nivel</Text>

                {/* Botones de niveles */}
                <TouchableOpacity style={[styles.button, styles.level1]} onPress={() => navigation.navigate('ChooseStudentLevelGame', { docenteDetail: docenteDetail, levelId: 1})}>
                    <Text style={styles.buttonText}>Nivel 1 🟢</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.level2]} onPress={() => navigation.navigate('ChooseStudentLevelGame', { docenteDetail: docenteDetail, levelId: 2 })}>
                    <Text style={styles.buttonText}>Nivel 2 🟡</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.level3]} onPress={() => navigation.navigate('ChooseStudentLevelGame', { docenteDetail: docenteDetail, levelId: 3 })}>
                    <Text style={styles.buttonText}>Nivel 3 🔴</Text>
                </TouchableOpacity>
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
    settings: {
        position: 'absolute',
        top: 40,
        right: 20,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 30,
        gap: 15,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 25,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    },
    button: {
        paddingVertical: 14,
        borderRadius: 25,
        alignItems: 'center',
        width: '70%',
        alignSelf: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
    },
    buttonText: {
        fontWeight: 'bold',
        color: 'white',
        fontSize: 18,
    },
    level1: { backgroundColor: '#2ECC71' },
    level2: { backgroundColor: '#F1C40F' },
    level3: { backgroundColor: '#E74C3C' },
    level4: { backgroundColor: '#9B59B6' },
    level5: { backgroundColor: '#3498DB' },
});
