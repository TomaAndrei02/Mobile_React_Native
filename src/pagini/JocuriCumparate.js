import React, { useState, useCallback } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList, Image, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { getAuth } from 'firebase/auth';
import { FIRESTORE_DB } from '../../FireBaseConfig';

const JocuriCuparate = () => {
  const [cumparateJocuri, setCumparateJocuri] = useState([]);
  const navigation = useNavigation();
  const auth = getAuth();
  const currentUser = auth.currentUser;

  useFocusEffect(
    useCallback(() => {
      fetchCumparate();
    }, [])
  );

  async function fetchCumparate() {
    const cumparateQuery = query(
      collection(FIRESTORE_DB, `jocuriachizitionate`), where('userId', '==', currentUser.uid)
    );
    try {
      const querySnapshot = await getDocs(cumparateQuery);
      const cumparateData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCumparateJocuri(cumparateData);
    } catch (error) {
      console.error("Eroare preluare datele jocurilor cumparate:", error);
    }
  }


  const renderJocuri = ({ item }) => {

    return (
      <View style={styles.lista}>
        <View style={{flexDirection:'column', alignItems: 'center', justifyContent: 'space-between', width: 150}}>
        <TouchableOpacity onPress={() => navigation.navigate('PaginaJocuri', { joc: item })}>
          <Image source={{ uri: item.url }} style={{ width: 150, height: 150, borderRadius: 10 }} />
        </TouchableOpacity>
        <Text style={styles.titlu}>{item.numejoc}</Text>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
    {cumparateJocuri.length === 0 ? (
      <View style={{flex:1, alignContent: 'center', alignItems:'center'}}>
        <Text style={styles.text}>Nu există niciun joc în librăria ta</Text>
        <Image source={require('./Imagini/mascotaconfuza.png')} style={{width:100, height:75, marginTop:10}}/>
        </View>
      ) : (
      <FlatList
        numColumns={2}
        data={cumparateJocuri}
        renderItem={renderJocuri}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
      )}
    </SafeAreaView>
  );
}

export default JocuriCuparate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBD1EA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    alignItems: 'center',
  },
  lista: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "center",
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 5,
    alignItems: "center",
    width: 170,
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal:10,
  },
  titlu: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  text: {
    fontSize: 16,
    marginTop:10,
    fontWeight: '500',
    textAlign:'center',
    color: '#071330'
  },
});
