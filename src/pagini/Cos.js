import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, query, deleteDoc, doc } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../FireBaseConfig';
import { Ionicons } from '@expo/vector-icons';

const Cos = () => {
  const [cosJocuri, setCosJocuri] = useState([]);
  const [pretTotal, setPretTotal] = useState(0);
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  const fetchCos = async () => {
    if (!currentUser) {
      console.error("Utilizator invalid");
      return;
    }

    const cosQuery = query(collection(FIRESTORE_DB, `jocuricos/${currentUser.uid}/cos`));
    try {
      const querySnapshot = await getDocs(cosQuery);
      const cosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      const total = cosData.reduce((sum, joc) => sum + joc.pret, 0);
      setPretTotal(total);
      setCosJocuri(cosData);
    } catch (error) {
      console.error("Eroare preluare date cos:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCos();
    }, [])
  );

  const handleRemoveFromCos = async (game) => {
    if (!currentUser) {
      console.error("Utilizator invalid");
      return;
    }

    const updatedCos = cosJocuri.filter(cosJoc => cosJoc.id !== game.id);
    setCosJocuri(updatedCos);

    try {
      await deleteDoc(doc(FIRESTORE_DB, `jocuricos/${currentUser.uid}/cos`, game.id));
    } catch (error) {
      console.error("Eroare la ștergere din cos:", error);
    }
    fetchCos();
  };

  const butonPlata = () => {
    if (cosJocuri.length === 0) {
      Alert.alert('Atenție', 'Coșul este gol.');
    } else {
      navigation.navigate('Plata');
    }
  };


  const renderJocuri = ({ item }) => {
    return (
      <View style={styles.lista}>
        <TouchableOpacity onPress={() => navigation.navigate('PaginaJocuri', { joc: item })}>
          <Image source={{ uri: item.url }} style={{ width: 150, height: 100, borderRadius: 10 }} />
        </TouchableOpacity>
        <View style={styles.infoContainer}>
          <View style={styles.gameInfo}>
            <Text style={styles.numejoc}>{item.numejoc}</Text>
            <Text style={styles.pret}>Pret: {item.pret} $</Text>
          </View>
          <TouchableOpacity onPress={() => handleRemoveFromCos(item)}>
            <Ionicons style={styles.iconita} name={'trash-outline'} size={30} color={'black'} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.titlu}>Coș</Text>
      {cosJocuri.length === 0 ? (
        <View style={{flex:1, alignContent: 'center', alignItems:'center'}}>
        <Text style={styles.text}>Nu există niciun joc în coș</Text>
        <Image source={require('./Imagini/mascotaconfuza.png')} style={{width:100, height:75, marginTop:10}}/>
        </View>
      ) : (
      <FlatList
        data={cosJocuri}
        renderItem={renderJocuri}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      )}
      <View style={styles.plata}>
        <Text style={styles.totalplata}>Totalul de plată este: {pretTotal} $</Text>
        <TouchableOpacity style={styles.button} onPress={butonPlata}>
          <Text style={styles.buttonText}>Plată</Text>
        </TouchableOpacity>
      </View>
      
    </SafeAreaView>
  );
};

export default Cos;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBD1EA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal:10,
  },
  listContainer: {
    alignItems: 'center',
  },
  lista: {
    flexDirection: 'row',
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 10,
    alignItems: 'center',
    width: 380,
    alignSelf: 'center',
    borderRadius: 10,
    marginVertical: 10,
  },
  plata:{
    backgroundColor:'#071330',
    paddingVertical:10,
    borderRadius:10,
    marginBottom:5,
    marginHorizontal:10,
    width:'100%'
  },
  titlu: {
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor:'#071330',
    color:'white',
    paddingVertical:10,
    borderRadius:10,
    width:'100%'
  },
  text: {
    fontSize: 16,
    marginTop:10,
    fontWeight: '500',
    textAlign:'center',
    color: '#071330'
  },
  totalplata: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color:'white',
    paddingBottom:5,
  },
  numejoc:{
    fontSize: 20,
    fontWeight: '500',
    textAlign: 'center',
    marginLeft: 20,
  },
  pret: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 5,
    marginLeft: 20,
    backgroundColor: 'lightgrey',
    borderRadius: 5,
    padding:5,
  },
  iconita: {
    marginTop: 7,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 200,
  },
  gameInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 150,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginVertical:5,
    marginHorizontal:100,
},
buttonText: {
  color: '#071330',
  fontSize: 18,
  textAlign: 'center',
  fontWeight: '500',
},
});
