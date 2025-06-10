import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Image} from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../FireBaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';


function CreazaCont() {
  const navigation = useNavigation();
  const [nume, setNume] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = FIREBASE_AUTH;

 
  const signUp = async () => {
    if (password !== confirmPassword) {
      alert('Parolele nu se potrivesc');
      return;
    }
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth,email,password);
      await updateProfile(response.user, {
        displayName: nume
      });
      console.log(response);
      Alert.alert("Succes",'Contul a fost creat!');
    } catch (error){
      console.log(error);
      if (error.message === "Firebase: Error (auth/invalid-email)."){
        alert('Emailul este invalid');
      }
      else if(error.message === "Firebase: Password should be at least 6 characters (auth/weak-password)."){
        alert('Parola trebuie sa aibă minim 6 caractere')
      }
      else if(error.message === "Firebase: Error (auth/email-already-in-use)."){
        alert('Există un cont cu acest email')
      }
      
    } finally {
      setLoading(false);
    }
  }


  return (
    <View style={styles.container}>
      <Image source={require('./ImagineLog/Logo.png')} style={{width:300,height:70, marginBottom:50}}></Image>
      <TextInput value={nume} style={styles.input} placeholder="Nume" autoCapitalize='none' onChangeText={(text) => setNume(text)}></TextInput>
      <TextInput value={email} style={styles.input} placeholder="Email*" autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
      <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Parolă*" autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>
      <TextInput secureTextEntry={true} value={confirmPassword} style={styles.input} placeholder="Confirmă Parola*" autoCapitalize="none" onChangeText={(text) => setConfirmPassword(text)}/>

        <View style={styles.butoane}>
          <TouchableOpacity style={styles.button} onPress={signUp}>
            <Text style={styles.buttonText}>Creează contul</Text>
          </TouchableOpacity>
        </View>
      

        <View style={{flexDirection:'row', marginTop:5}}>
          <Text style={{fontSize:16, fontWeight:'500'}}>Dacă deja ai cont, te poți întoarce la </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Logare')}>
              <Text style={{color:"#2ca243", fontWeight:'900', fontSize:16}}>logare!</Text>
            </TouchableOpacity>
          </View>
    </View>
  );
}
  
    
export default CreazaCont;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maringHorizontal:50,
    backgroundColor: '#BBD1EA',
    justifyContent: 'center',
    alignItems: 'center'
  },

  butoane:{
    flexDirection:'column',
    padding:5,
  },
  
  button: {
    backgroundColor: '#071330',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
  },

  buttonText: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    fontWeight:'500'
  },

  input: {
    marginVertical: 4,
    height: 50,
    width:350,
    borderWidth:1,
    borderRadius: 50,
    padding: 10,
    backgroundColor: '#fff',
  }
});
