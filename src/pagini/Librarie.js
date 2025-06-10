import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, doc, setDoc, deleteDoc, query, where } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';
import { FIRESTORE_DB } from '../../FireBaseConfig';
import { Ionicons } from '@expo/vector-icons';

const Librarie = () => {
  const [jocuriLista, setJocuriLista] = useState([]);
  const [filteredJocuriLista, setFilteredJocuriLista] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteGames, setFavoriteGames] = useState([]);
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      fetchData();
      fetchFavorites();
    }, [])
  );


  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'jocuri'));
      const jocuriData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        numejoc: doc.data().numejoc,
        pret: doc.data().pret,
        idul: doc.data().idul,
        url: doc.data().url,
        descriere: doc.data().descriere,
        ...doc.data(),
      }));
      setJocuriLista(jocuriData);
      setFilteredJocuriLista(jocuriData);
    } catch (error) {
      console.error("Eroare preluare date:", error);
    } 
  }

  async function fetchFavorites() {
    if (!currentUser) {
      console.error("Utilizator invalid");
      return;
    }

    const userQuery = query(collection(FIRESTORE_DB, `jocurifav/${currentUser.uid}/favorite`));
    try {
      const querySnapshot = await getDocs(userQuery);
      const favoritesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFavoriteGames(favoritesData);
    } catch (error) {
      console.error("Eroare la adaugare jocuri:", error);
    }
  }

  function handleSearch(text) {
    const filteredList = jocuriLista.filter(item =>
      item.numejoc.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredJocuriLista(filteredList);
    setSearchQuery(text);
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
          <Image source={{ uri: item.url }} style={{ width: 350, height: 300, borderRadius: 10 }} />
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={styles.titlu}>{item.numejoc}</Text>
          <TouchableOpacity onPress={() => toggleFavorite(item)}>
            <Ionicons
              style={styles.iconita}
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={30}
              color={isFavorite ? 'red' : 'black'}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Caută jocuri"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <FlatList
        data={filteredJocuriLista}
        renderItem={renderJocuri}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default Librarie;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBD1EA',
    paddingTop: 60,
  },
  searchInput: {
    height: 50,
    borderColor: 'black',
    borderWidth: 2,
    margin: 10,
    padding: 10,
    borderRadius: 30,
    backgroundColor: 'white',
    fontSize: 17,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  lista: {
    flexDirection: "column",
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
    fontSize: 30,
    fontWeight: "500",
    textAlign: 'center',
    flex:1,
    marginLeft:40,
  },
  iconita: {
    flex:1,
    marginTop: 7,
    marginRight:5,
  }
});
