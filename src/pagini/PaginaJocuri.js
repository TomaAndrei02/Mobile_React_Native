import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { getAuth } from 'firebase/auth';
import { doc, setDoc, collection, getDocs, query, where } from "firebase/firestore"; 
import { FIRESTORE_DB } from '../../FireBaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

const PaginaJocuri = ({ route }) => {
  const [isDescriptionVisible, setIsDescriptionVisible] = useState(false);
  const [cosJocuri, setCosJocuri] = useState([]);
  const joc = route.params?.joc;
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      fetchCos();
    }, [])
  );

  const fetchCos = async () => {
    if (!currentUser) return;
    const cosQuery = query(collection(FIRESTORE_DB, `jocuricos/${currentUser.uid}/cos`));
    try {
      const querySnapshot = await getDocs(cosQuery);
      const cosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCosJocuri(cosData);
    } catch (error) {
      console.error("Eroare preluare date cos:", error);
    }
  };

  const handleAddToCos = async () => {
    if (!currentUser) {
      console.error("Utilizator invalid");
      return;
    }

    const isCos = cosJocuri.some(cosJoc => cosJoc.id === joc.id);
    
    const achizitionateQuery = query(collection(FIRESTORE_DB, 'jocuriachizitionate'), where('userId', '==',  currentUser.uid));
    try {
      const querySnapshot = await getDocs(achizitionateQuery);
      const achizitionateData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const isAchizitionat = achizitionateData.some(achizionat => achizionat.id === joc.id);
      
      if (isCos) {
        Alert.alert("Eroare", `${joc.numejoc} este deja în coș`);
        return;
      } else if (isAchizitionat) {
        Alert.alert("Eroare", `${joc.numejoc} este deja achiziționat`);
        return;
      }

      const updatedCos = [...cosJocuri, { ...joc, uid: currentUser.uid }];
      setCosJocuri(updatedCos);

      await setDoc(doc(FIRESTORE_DB, `jocuricos/${currentUser.uid}/cos`, joc.id), { ...joc, uid: currentUser.uid });
      Alert.alert("Succes", `${joc.numejoc} a fost adăugat în coș`);
    } catch (error) {
      console.error("Eroare la adaugare cos:", error);
      Alert.alert("Eroare", "A apărut o problemă la actualizarea coșului.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.containerjoc}>
          <Image source={{ uri: joc.url }} style={styles.imaginejoc} />
          <Text style={styles.numejoc}>{joc.numejoc}</Text>
          <Text style={styles.pretjoc}>Preț: {joc.pret} $</Text>
        </View>
        <TouchableOpacity
          style={styles.buton}
          onPress={() => setIsDescriptionVisible(!isDescriptionVisible)}
        >
          <Text style={styles.butonText}>
            {isDescriptionVisible ? "Ascunde descrierea" : "Afișează descrierea"}
          </Text>
        </TouchableOpacity>
        {isDescriptionVisible && <Text style={styles.descrierejoc}>{joc.descriere}</Text>}
        <TouchableOpacity style={styles.buton} onPress={handleAddToCos}>
          <View style={{flexDirection:'row'}}>
            <Text style={styles.butonText}>Adaugă în coș</Text>
            <Ionicons style={{marginLeft:5}} name={'cart'} size={25} color={'white'} />
          </View> 
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default PaginaJocuri;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBD1EA',
  },
  containerjoc:{
    flexDirection: "column",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    width: 280,
    height:380,
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  imaginejoc: {
    width: 250,
    height: 250,
    borderRadius:10,
    alignSelf: 'center',
    marginBottom: 10,
    marginTop: 20,
  },
  numejoc: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  pretjoc: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
    backgroundColor:'lightgrey',
    borderRadius:10,
    padding:5,
    fontWeight: '500'
  },
  buton: {
    backgroundColor: '#071330',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
    marginHorizontal: 20,
  },
  butonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  descrierejoc: {
    marginHorizontal: 20,
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
    backgroundColor: 'white',
    padding:20,
    borderRadius:10,
    borderColor:'#2ca243',
    borderWidth:5,
    textAlign: 'center'
  },
});
