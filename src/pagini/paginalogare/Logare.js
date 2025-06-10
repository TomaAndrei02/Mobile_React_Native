import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Modal, Alert } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FIREBASE_AUTH } from '../../../FireBaseConfig';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';



function Logare() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth,email,password);
      console.log(response);
    } catch (error){
      console.log(error);
      if (error.message === "Firebase: Error (auth/invalid-email)."){
        alert('Emailul este invalid');
      }
      else if (error.message === "Firebase: Error (auth/invalid-login-credentials)."){
        alert('Parola a fost introdusă greșit');
      }
    } finally {
      setLoading(false);
    }
  }

  const resetareParola = async () => {
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Alert.alert("Succes","Un email a fost trimis, pentru a reseta parola!");
      setIsModalVisible(false);
    } catch (error) {
      alert(error.message);
    }
  };


  return (
    <View style={styles.container}>
      <Image source={require('./ImagineLog/Logo.png')} style={{width:300,height:70, marginBottom:50}}></Image>
      <TextInput value={email} style={styles.input} placeholder="Email" autoCapitalize='none' onChangeText={(text) => setEmail(text)}></TextInput>
      <TextInput secureTextEntry={true} value={password} style={styles.input} placeholder="Parolă" autoCapitalize='none' onChangeText={(text) => setPassword(text)}></TextInput>

            <View style={styles.butoane}>
            <TouchableOpacity style={styles.button} onPress={signIn}>
              <Text style={styles.buttonText}>Logare</Text>
            </TouchableOpacity>

            <View style={{ marginVertical: 5 }}/>

              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreazaCont')}>
                <Text style={styles.buttonText}>Creează-ți un cont</Text>
              </TouchableOpacity>
            </View>  
            <View style={{ flexDirection: 'row', marginTop: 5 }}>
              <Text style={{ fontSize: 16, fontWeight: '500' }}>Dacă ai uitat parola, o poți reseta </Text>
              <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                <Text style={{ color: "#2ca243", fontWeight: '900', fontSize: 16 }}>aici!</Text>
              </TouchableOpacity>
            </View>
          
            <Modal
              animationType="slide"
              transparent={true}
              visible={isModalVisible}
              onRequestClose={() => {
              setIsModalVisible(!isModalVisible);
            }}
            >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Resetare Parolă</Text>
            <Text style={styles.modalDescription}>
              Introdu adresa ta de email pentru a reseta parola.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Email"
              value={resetEmail}
              onChangeText={(text) => setResetEmail(text)}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => setIsModalVisible(!isModalVisible)}
              >
                <Text style={styles.buttonText}>Anulează</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonSubmit]}
                onPress={resetareParola}
              >
                <Text style={styles.buttonText}>Trimite</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
  
    
export default Logare;

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
    fontWeight:'500',
  },

  input: {
    marginVertical: 4,
    height: 50,
    width:350,
    borderWidth:1,
    borderRadius: 50,
    padding: 10,
    backgroundColor: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalDescription: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '500',
  },
  modalInput: {
    width: 250,
        height: 50,
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        fontSize: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop:5,
  },
  buttonClose: {
    backgroundColor: '#071330',
    marginRight: 10,
    paddingVertical: 15,
  },
  buttonSubmit: {
    backgroundColor: '#2ca243',
    paddingVertical: 15,
  }
});
