//src/screens/TypeGameScreen.tsx
import React from 'react';
import { useNavigation, useRoute } from "@react-navigation/native";
import { ImageBackground, Text, TouchableOpacity, View, StyleSheet } from "react-native";

export default function TypeGameScreen() {
    const navigation: any = useNavigation();
    const route: any = useRoute();
    const { studentId } = route.params;

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
                <Text style={{ fontSize: 24 }}>🏠</Text>
            </TouchableOpacity>

            {/* Icono ajustes */}
            <TouchableOpacity style={styles.settings}>
                <Text style={{ fontSize: 20 }}>⚙️</Text>
            </TouchableOpacity>

            <View style={styles.container}>
                {/* Título */}
                <Text style={styles.title}>Elige el tipo de juego</Text>

                {/* Botones de tipo de juego */}
                <TouchableOpacity style={[styles.button, styles.vowels]} onPress={() => navigation.navigate('OrderGame', {studentId})}>
                    <Text style={styles.buttonText}>Vocales 🔤</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.button, styles.words]} onPress={() => navigation.navigate('Game', {studentId, typeOrder: "Ordered words"})}>
                    <Text style={styles.buttonText}>Palabras 📝</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
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
    vowels: { backgroundColor: '#FF6F61' },
    words: { backgroundColor: '#6C63FF' },
    sentences: { backgroundColor: '#FFB74D' },
    quiz: { backgroundColor: '#4DB6AC' },
});
