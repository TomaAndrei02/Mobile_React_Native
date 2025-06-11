import React, { useState, useCallback } from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { getAuth } from 'firebase/auth';
import { collection, getDocs, query, deleteDoc, doc, addDoc } from 'firebase/firestore';
import { FIRESTORE_DB } from '../../FireBaseConfig';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

export default function Plata() {
  const [pretTotal, setPretTotal] = useState(0);
  const [numarCard, setNumarCard] = useState('');
  const [numeCard, setNumeCard] = useState('');
  const [dataCard, setDataCard] = useState('');
  const [cvvCard, setCvvCard] = useState('');
  const auth = getAuth();
  const currentUser = auth.currentUser;
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      fetchPretTotal();
    }, [])
  );

  const fetchPretTotal = async () => {
    if (!currentUser) {
      console.error('Utilizator invalid');
      return;
    }

    const cosQuery = query(collection(FIRESTORE_DB, `jocuricos/${currentUser.uid}/cos`));
    try {
      const querySnapshot = await getDocs(cosQuery);
      const cosData = querySnapshot.docs.map(doc => doc.data());
      const total = cosData.reduce((sum, joc) => sum + joc.pret, 0);
      setPretTotal(total);
    } catch (error) {
      console.error('Eroare preluare date cos:', error);
    }
  };

  const formatCardNumber = (number) => {
    return number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  const handleCardNumberChange = (text) => {
    setNumarCard(formatCardNumber(text));
  };

  const handleDateChange = (text) => {
    const cleaned = text.replace(/[^\d]/g, '');
    let formatted = cleaned;
    if (cleaned.length >= 3) {
      formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    setDataCard(formatted);
  };

  const validareNumarCard = (number) => {
    const cleanedNumber = number.replace(/\s/g, '');
    return cleanedNumber.length === 16 && /^\d+$/.test(cleanedNumber);
  };

  const validareData = (date) => {
    const [month, year] = date.split('/').map(Number);
    return month >= 1 && month <= 12 && year >= 25 && year <= 99;
  };

  const validareCvv = (cvv) => {
    return cvv.length === 3 && /^\d+$/.test(cvv);
  };

  const plataFinala = async () => {
    if (!validareNumarCard(numarCard)) {
      alert('Numărul cardului este incorect');
      return;
    }
    if (numeCard.trim().length === 0) {
      alert('Numele trebuie introdus');
      return;
    }
    if (!validareData(dataCard)) {
      alert('Data expirării este incorectă sau cardul a expirat');
      return;
    }
    if (!validareCvv(cvvCard)) {
      alert('Numărul de securitate este incorect');
      return;
    }

    try {
      const cosQuery = query(collection(FIRESTORE_DB, `jocuricos/${currentUser.uid}/cos`));
      const querySnapshot = await getDocs(cosQuery);

      for (const docSnapshot of querySnapshot.docs) {
        const jocData = docSnapshot.data();
        await addDoc(collection(FIRESTORE_DB, 'jocuriachizitionate'), {
          ...jocData,
          userId: currentUser.uid,
        });
        await deleteDoc(doc(FIRESTORE_DB, `jocuricos/${currentUser.uid}/cos`, docSnapshot.id));
      }

      alert('Plata a fost efectuată cu succes!');
      navigation.navigate('CosPrincipal'); 
    } catch (error) {
      console.error('Eroare la procesarea plății:', error);
      alert('A apărut o eroare la procesarea plății.');
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.totalText}>Totalul de plată este: {pretTotal} $</Text>
        <ImageBackground source={require('./Imagini/cardcredit.png')} imageStyle={{ borderRadius: 0 }} style={styles.card}>
          <Text style={styles.cardNumar}>{numarCard || 'XXXX XXXX XXXX XXXX'}</Text>
          <Text style={styles.cardData}>{dataCard || 'LL/AA'}</Text>
          <View style={styles.cardDetalii}>
            <Text style={styles.cardNume}>{numeCard || 'Nume Deținător'}</Text>
            <Text style={styles.cardCVV}>{cvvCard || 'CVV/CVC'}</Text>
          </View>
        </ImageBackground>
        <TextInput 
          style={styles.input} 
          placeholder='Număr card' 
          maxLength={19} 
          keyboardType="numeric" 
          value={numarCard}
          onChangeText={handleCardNumberChange}
        />
        <TextInput 
          style={styles.input} 
          placeholder='Nume Deținător'
          maxLength={20} 
          value={numeCard}
          onChangeText={(text) => setNumeCard(text)}
        />
        <View style={{flexDirection:'row' }}>
        <TextInput 
          style={styles.input2} 
          placeholder='LL/AA' 
          maxLength={5} 
          keyboardType="numeric" 
          value={dataCard}
          onChangeText={handleDateChange}
        />
        <TextInput 
          style={styles.input2} 
          placeholder='CVV/CVC' 
          maxLength={3} 
          keyboardType="numeric" 
          value={cvvCard}
          onChangeText={(text) => setCvvCard(text)}
        />
        </View>
        <TouchableOpacity style={styles.button} onPress={plataFinala}>
          <Text style={styles.buttonText}>Plată finală</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BBD1EA',
    paddingTop: 100,
    paddingBottom: 100,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 25,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 10,
  },
  card: {
    width: 375,
    height: 250,
    padding: 20,
    marginBottom: 5,
    justifyContent: 'center',
  },
  cardNumar: {
    fontSize: 24,
    color: '#fff',
    letterSpacing: 2,
    marginTop: 85,
    marginLeft: 10,
  },
  cardDetalii: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom:10,
    marginLeft:10,
    marginRight:10
  },
  cardNume: {
    fontSize: 18,
    color: '#fff',
    textTransform: 'uppercase', 
  },
  cardData: {
    fontSize: 18,
    color: '#fff',
    marginBottom:10,
    marginTop:10,
    marginLeft: 10,
  },
  cardCVV: {
    borderRadius:10,
    padding:5,
    backgroundColor:'lightgrey',
    fontSize: 18,
    color: '#000',
  },
  input: {
    marginVertical: 4,
    height: 50,
    width: '90%',
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    backgroundColor: '#fff',
  },
  input2: {
    marginVertical: 4,
    height: 50,
    width: '43%',
    borderWidth: 1,
    borderRadius: 50,
    padding: 10,
    backgroundColor: '#fff',
    marginLeft:8,
    marginRight:8
  },
  button: {
    backgroundColor: '#071330',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    marginTop:10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight:'bold',
  },
});
