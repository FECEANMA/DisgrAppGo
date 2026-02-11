//src/screens/OrderGameScreen.tsx
import React from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import ScreenWrapper from '../components/ScreenWrapper';

export default function OrderGameScreen() {
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const { studentId } = route.params;

    return (
        <ScreenWrapper>

            {/* Botón Home */}
            <TouchableOpacity
                style={styles.home}
                onPress={() => navigation.goBack()}
            >
                <Text style={{ fontSize: 24 }}>⬅️</Text>
            </TouchableOpacity>

            {/* Icono ajustes */}
            <TouchableOpacity style={styles.settings}>
                <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>

            <View style={styles.container}>
                {/* Título */}
                <Text style={styles.title}>¡Elige tu modo de juego!</Text>

                {/* Botones con diseño llamativo */}
                <TouchableOpacity style={[styles.button, styles.buttonOrder]} onPress={() => navigation.navigate('Game', {studentId, typeOrder: "Ordered vowels"})}>
                    <Text style={styles.buttonText}>Ordenado 📋</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.buttonRandom]} onPress={() => navigation.navigate('Game', {studentId, typeOrder: "Random vowels"})}>
                    <Text style={styles.buttonText}>Aleatorio 🎲</Text>
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
        gap: 20,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
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
    buttonOrder: {
        backgroundColor: '#6C63FF',
    },
    buttonRandom: {
        backgroundColor: '#FF6584',
    },
    buttonChallenge: {
        backgroundColor: '#FFA500',
    },
    buttonTime: {
        backgroundColor: '#00C2FF',
    },
});
