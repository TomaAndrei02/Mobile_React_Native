import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, doc, setDoc, deleteDoc, query } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../FireBaseConfig';
import { Ionicons } from '@expo/vector-icons';

const Favorite = () => {
  const [favoriteGames, setFavoriteGames] = useState([]);
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      fetchFavorites();
    }, [])
  );

  async function fetchFavorites() {
    const favoritesQuery = query(
      collection(FIRESTORE_DB, `jocurifav/${currentUser.uid}/favorite`)
    );
    try {
      const querySnapshot = await getDocs(favoritesQuery);
      const favoritesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavoriteGames(favoritesData);
    } catch (error) {
      console.error("Eroare preluare date favorite:", error);
    }
  }

  const toggleFavorite = async (game) => {
    if (!currentUser) {
      console.error("Utilizator invalid");
      return;
    }

    const isFavorite = favoriteGames.some(favGame => favGame.id === game.id);
    const updatedFavorites = isFavorite
      ? favoriteGames.filter(favGame => favGame.id !== game.id)
      : [...favoriteGames, { ...game, uid: currentUser.uid }];

    setFavoriteGames(updatedFavorites);

    try {
      if (isFavorite) {
        await deleteDoc(doc(FIRESTORE_DB, `jocurifav/${currentUser.uid}/favorite`, game.id));
      } else {
        await setDoc(doc(FIRESTORE_DB, `jocurifav/${currentUser.uid}/favorite`, game.id), { ...game, uid: currentUser.uid });
      }
    } catch (error) {
      console.error("Eroare la adaugare favorite:", error);
    }
  };

  const renderJocuri = ({ item }) => {
    const isFavorite = favoriteGames.some(favGame => favGame.id === item.id);

    return (
      <View style={styles.lista}>
        <TouchableOpacity onPress={() => navigation.navigate('PaginaJocuri', { joc: item })}>
          <Image source={{ uri: item.url }} style={{ width: 150, height: 100, borderRadius: 10 }} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: 200 }}>
        <View style={{flexDirection:'column', alignItems: 'center', justifyContent: 'space-between', width: 150}}>
          <Text style={styles.numejoc}>{item.numejoc}</Text>
          <Text style={styles.pret}>Pret: {item.pret} $</Text>
        </View>
          
          <TouchableOpacity onPress={() => toggleFavorite(item)}>
            <Ionicons
              style={styles.iconita}
              name={'heart'}
              size={30}
              color={'red'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    <Text style={styles.titlu}>Favorite</Text>
      {favoriteGames.length === 0 ? (
        <View style={{flex:1, alignContent: 'center', alignItems:'center'}}>
        <Text style={styles.text}>Nu există niciun joc în favorite</Text>
        <Image source={require('./Imagini/mascotaconfuza.png')} style={{width:100, height:75, marginTop:10}}/>
        </View>
      ) : (
        <FlatList
        data={favoriteGames}
        renderItem={renderJocuri}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      )}
    </SafeAreaView>
  );
}

export default Favorite;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBD1EA',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop:60,
  },
  listContainer: {
    alignItems: 'center',
  },
  lista: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 10,
    alignItems: "center",
    width: 380,
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  titlu: {
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor:'#071330',
    color:'white',
    paddingHorizontal: 150.5,
    paddingVertical:10,
    borderRadius:10,
  },
  text: {
    fontSize: 16,
    marginTop:10,
    fontWeight: '500',
    textAlign:'center',
    color: '#071330'
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
  }
});
