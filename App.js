import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Logare from './src/pagini/paginalogare/Logare';
import Home from './src/pagini/Home';
import Navigare from './src/pagini/Navigare';
import CreazaCont from './src/pagini/paginalogare/CreazaCont';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './FireBaseConfig';
import { useState } from 'react';


const Stack = createNativeStackNavigator();

export default function App() {
  const [user , setUser] = useState (User);

  useEffect(()=>{
    onAuthStateChanged(FIREBASE_AUTH,(user) => {
      setUser(user);
    });
  }, []);



  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Logare'>
      {user ? (<Stack.Screen name= 'Navigare' component={Navigare} options={{headerShown: false}}/>
      ): 
      (
        <Stack.Screen name= 'Logare' component={Logare} options={{headerShown: false}}/>
      )}
      {user ? (<Stack.Screen name= 'Home' component={Home} />
      ):
      (
        <Stack.Screen name='CreazaCont' component={CreazaCont} options={{headerShown: false}}/>
      )}

      </Stack.Navigator>
    </NavigationContainer>
  );
}


