import React, { useEffect, useState } from "react";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import RegisterTeacherScreen from "./src/screens/RegisterTeacherScreen";
import StudentsListScreen from "./src/screens/StudentsListScreen";
import AddStudentScreen from "./src/screens/AddStudentScreen";
import TypeGameScreen from "./src/screens/TypeGameScreen";
import OrderGameScreen from "./src/screens/OrderGameScreen";
import GameLevelScreen from "./src/screens/GameLevelScreen";
import ProfileStudentScreen from "./src/screens/ProfileStudentScreen";
import GameScreen from "./src/screens/GameScreen";
import { getDocente } from "./src/utils/session";
import EditStudentScreen from "./src/screens/EditStudentScreen";
import ChooseStudentGameScreen from "./src/screens/ChooseStudentGameScreen";
import { BLEProvider } from './src/context/BLEContext';
import StudentLevelGameScreen from "./src/screens/StudentLevelGameScreen";
import GameLevelScreen1 from "./src/screens/GameLevelScreen1";

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<'Login' | 'Home'>('Login');

  useEffect(() => {
    const checkLogin = async () => {
      const docente = await getDocente();
      if (docente) setInitialRoute('Home');
    };
    checkLogin();
  }, []);

  return (
    <BLEProvider>
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Register" component={RegisterTeacherScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Students" component={StudentsListScreen} />
        <Stack.Screen name="AddStudents" component={AddStudentScreen} />
        <Stack.Screen name="TypeGame" component={TypeGameScreen} />
        <Stack.Screen name="OrderGame" component={OrderGameScreen} />
        <Stack.Screen name="GameLevel" component={GameLevelScreen} />
        <Stack.Screen name="GameLevel1" component={GameLevelScreen1} />
        <Stack.Screen name="ProfileStudent" component={ProfileStudentScreen} />
        <Stack.Screen name="Game" component={GameScreen} />
        <Stack.Screen name="EditStudentScreen" component={EditStudentScreen} />
        <Stack.Screen name="ChooseStudentGame" component={ChooseStudentGameScreen} />
        <Stack.Screen name="ChooseStudentLevelGame" component={StudentLevelGameScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    </BLEProvider>
  );
}
