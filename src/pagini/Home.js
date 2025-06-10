import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, SafeAreaView, TouchableOpacity, Image, Dimensions, Text, FlatList, ScrollView, LogBox } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, query, where } from "firebase/firestore"; 
import { FIRESTORE_DB, FIREBASE_AUTH } from '../../FireBaseConfig';
import { useFocusEffect } from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
const { width: viewportWidth } = Dimensions.get('window');

export default function Home() {
  
  const [jocuriLista, setJocuriLista] = useState([]);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const currentUser = FIREBASE_AUTH.currentUser;
  const [popActiune, setPopActiune] = useState(false);
  const [actiuneJocuri, setActiuneJocuri] = useState([]);
  const [popRpg, setPopRpg] = useState(false);
  const [rpgJocuri, setRpgJocuri] = useState([]);
  const [popCoop, setPopCoop] = useState(false);
  const [coopJocuri, setCoopJocuri] = useState([]);
  const [popFps, setPopFps] = useState(false);
  const [fpsJocuri, setFpsJocuri] = useState([]);
  const [popPixelate, setPopPixelate] = useState(false);
  const [pixelateJocuri, setPixelateJocuri] = useState([]);

  const fetchProfileImage = async () => {
    try {
        const userQuery = query(collection(FIRESTORE_DB, "useri"), where("userId", "==", currentUser.uid));
        const querySnapshot = await getDocs(userQuery);
        if (!querySnapshot.empty) {
            const userData = querySnapshot.docs[0].data();
            setProfileImageUrl(userData.url);
        }
    } catch (error) {
        console.error("Imaginea nu a mers:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
        fetchProfileImage();
    }, [])
  );

  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(FIRESTORE_DB, 'jocuri'));
      const jocuriData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        numejoc: doc.data().numejoc,
        pret: doc.data().pret,
        idul:doc.data().idul,
        url:doc.data().url,
        descriere:doc.data().descriere,
        genre: doc.data().genre,
        ...doc.data(),
      }));
      setJocuriLista(jocuriData);
    } catch (error) {
      console.error("Eroare preluare date:", error);
    } 
  }

  useEffect(() => {
    fetchData();
  }, []);

  const handleActiunePress = () => {
    const filteredGames = jocuriLista.filter(joc => joc.genre === 'Actiune');
    setActiuneJocuri(filteredGames);
    setPopActiune(!popActiune);
  };
  const handleRpgPress = () => {
    const filteredGames = jocuriLista.filter(joc => joc.genre === 'RPG');
    setRpgJocuri(filteredGames);
    setPopRpg(!popRpg);
  };
  const handleCoopPress = () => {
    const filteredGames = jocuriLista.filter(joc => joc.genre === 'Co-op');
    setCoopJocuri(filteredGames);
    setPopCoop(!popCoop);
  };
  const handleFpsPress = () => {
    const filteredGames = jocuriLista.filter(joc => joc.genre === 'Shooter');
    setFpsJocuri(filteredGames);
    setPopFps(!popFps);
  };
  const handlePixelatePress = () => {
    const filteredGames = jocuriLista.filter(joc => joc.genre === '2D');
    setPixelateJocuri(filteredGames);
    setPopPixelate(!popPixelate);
  };

  const navigation = useNavigation();

  const carouselItems = [
    {
      title: "1",
      image: require('./Imagini/stardewvalleywallpaper.png'),
    },
    {
      title: "2",
      image: require('./Imagini/EldenRingWallpaper.jpg'),
    },
    {
      title: "3",
      image: require('./Imagini/sekirowallpaper.jpg'),
    },
    {
      title: "4",
      image: require('./Imagini/godofwarwallpaper.jpg'),
    },
    {
      title: "5",
      image: require('./Imagini/ittakestwowallpaper.jpg'),
    },
  ];

  const renderItem = ({ item }) => {
    return (
      <View style={styles.carouselItem}>
        <Image source={item.image} style={styles.carouselImage} />
      </View>
    );
  };

  const renderJocuri = ({item}) => {
    return (
      <View style={styles.lista}>
      <TouchableOpacity onPress={() => navigation.navigate('PaginaJocuri', { joc: item })}>
        <Image source={{uri:item.url}} style={{width: 300, height: 200, borderRadius:10,}}/>
      </TouchableOpacity>
      <Text style={styles.titlu}>  {item.numejoc}</Text>
    </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.buton} onPress={() => navigation.navigate('LibrariePrincipala')}>
          <Ionicons name='search' size={35} color='black' />
        </TouchableOpacity>    
        
        <Image source={require('./Imagini/Logo.png')} style={{width:200,height:45}}/>

        <TouchableOpacity style={styles.imgprofil} onPress={() => navigation.navigate('Profil')}>
        <Image source={profileImageUrl ? { uri: profileImageUrl } : require('./Imagini/DefaultUser.jpg')} style={{width: 50, height: 50, borderRadius:30,}}/>
        </TouchableOpacity>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.carouselContainer}>
        <Carousel
          layout={'default'}
          data={carouselItems}
          renderItem={renderItem}
          sliderWidth={viewportWidth}
          itemWidth={viewportWidth - 60}
        />
      </View>

      <Text style={styles.titludesc}>Bine ai venit pe GameNight!</Text>
      <Text style={styles.descriere}> GameNight este o aplicație creată special pentru gamer-ul din tine. Aici poți achiziționa cele mai noi jocuri, dar și pe cele clasice, toate la o apăsare de ecran distanță. Descoperă o selecție vastă de titluri pentru toate gusturile și platformele, fie că ești fan al jocurilor de acțiune, aventură, RPG sau multiplayer.
              {'\n'}  Haide, ce mai aștepți? Explorează platforma noastră și pregătește-te pentru o noapte plină de gaming!
      </Text>

        <View>
          <TouchableOpacity
            style={styles.popup}
            onPress={handleActiunePress}
          >
            <Text style={styles.butonText}>Actiune</Text>
          </TouchableOpacity>
          {popActiune && <FlatList
            data={actiuneJocuri}
            renderItem={renderJocuri}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />}
        </View>

        <View>
          <TouchableOpacity
            style={styles.popup}
            onPress={handleRpgPress}
          >
            <Text style={styles.butonText}>RPG</Text>
          </TouchableOpacity>
          {popRpg && <FlatList
            data={rpgJocuri}
            renderItem={renderJocuri}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />}
        </View>

        <View>
          <TouchableOpacity
            style={styles.popup}
            onPress={handleCoopPress}
          >
            <Text style={styles.butonText}>Co-op</Text>
          </TouchableOpacity>
          {popCoop && <FlatList
            data={coopJocuri}
            renderItem={renderJocuri}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />}
        </View>

        <View>
          <TouchableOpacity
            style={styles.popup}
            onPress={handleFpsPress}
          >
            <Text style={styles.butonText}>Shooter</Text>
          </TouchableOpacity>
          {popFps && <FlatList
            data={fpsJocuri}
            renderItem={renderJocuri}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />}
        </View>

        <View>
          <TouchableOpacity
            style={styles.popup}
            onPress={handlePixelatePress}
          >
            <Text style={styles.butonText}>2D</Text>
          </TouchableOpacity>
          {popPixelate && <FlatList
            data={pixelateJocuri}
            renderItem={renderJocuri}
            keyExtractor={item => item.id}
            showsVerticalScrollIndicator={false}
          />}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBD1EA',
    paddingTop:60,
  },
  buton: {
    alignItems: 'center',
    width:55,
    marginTop:5,
  },
  imgprofil:{
    marginRight:15,
  },
  header: {
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal: 10,
    marginBottom:5,
  },
  carouselContainer: {
    marginTop: 10,
  },
  carouselItem: {
    backgroundColor: '#fff',
    borderRadius: 10,
    height: 225,
    padding: 10,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  popup: {
    backgroundColor: '#071330',
    padding: 10,
    alignItems: 'center',
    borderBottomColor:'#2ca243',
    borderBottomWidth:5,
  },
  butonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  lista: {
    flexDirection: "column",
    backgroundColor: "white",
    justifyContent: "center",
    padding: 10,
    alignItems: "center",
    width: "80%",
    alignSelf: "center",
    borderRadius: 10,
    marginVertical: 10,
  },
  titlu: {
    fontSize: 30,
    fontWeight: "500",
    textAlign: 'center',
    marginRight:13,
  },
  titludesc: {
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
    backgroundColor:'#071330',
    color:'white',
    paddingVertical:10,
    borderRadius:10,
    marginHorizontal:20,
  },
  descriere: {
    marginHorizontal: 20,
    fontSize: 16,
    marginVertical: 20,
    fontWeight: '500',
    backgroundColor: 'white',
    padding:20,
    borderRadius:10,
    borderColor:'#2ca243',
    borderWidth:5,
    textAlign: 'center'
  },
});
