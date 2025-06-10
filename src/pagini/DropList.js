import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FireBaseConfig';
import { addDoc, collection, updateDoc, query, where, getDocs } from 'firebase/firestore';

const data = [
  { label: 'Elden Ring', value: 'Elden Ring' },
  { label: 'Sekiro: Shadows Die Twice', value: 'Sekiro: Shadows Die Twice' },
  { label: 'Diablo IV', value: 'Diablo IV' },
  { label: 'Fallout 4', value: 'Fallout 4' },
  { label: 'Stardew Valley', value: 'Stardew Valley' },
  { label: 'Ace Combat 7', value: 'Ace Combat 7' },
  { label: 'Batman: Arkham Knight', value: 'Batman: Arkham Knight' },
  { label: 'Stellaris', value: 'Stellaris' },
  { label: 'Ghost of Tsushima', value: 'Ghost of Tsushima' },
  { label: 'Geometry Dash', value: 'Geometry Dash' },
  { label: 'Hades', value: 'Hades' },
  { label: 'God of War', value: 'God of War' },
  { label: 'Call of Duty: Modern Warfare', value: 'Call of Duty: Modern Warfare' },
  { label: 'It Takes Two', value: 'It Takes Two' },
  { label: 'Dark Souls III', value: 'Dark Souls III' },
  { label: 'Hunt: Showdown', value: 'Hunt: Showdown' },
  { label: 'The Elder Scrolls V: Skyrim', value: 'The Elder Scrolls V: Skyrim' },
  { label: 'Terraria', value: 'Terraria' },
  { label: 'A Way Out', value: 'A Way Out' },
  { label: 'Cuphead', value: 'Cuphead' },
];

const DropdownComponent = () => {
  const [value, setValue] = useState('');

  const renderItem = item => {
    return (
      <View style={styles.item}>
        <Text style={styles.textItem}>{item.label}</Text>
      </View>
    );
  };

  const handleSaveToFirebase = async (selectedValue) => {
    try {
      const userId = FIREBASE_AUTH.currentUser.uid;
      const collectionRef = collection(FIRESTORE_DB, "jocpref");
      const q = query(collectionRef, where("userId", "==", userId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        querySnapshot.forEach(async (doc) => {
          const docRef = doc.ref;
          await updateDoc(docRef, { favoriteGame: selectedValue });
        });
      } else {
        await addDoc(collectionRef, {
          favoriteGame: selectedValue,
          userId: userId
        });
      }
    } catch (error) {
      console.error("Eroare la salvare:", error);
    }
  };

  return (
    <Dropdown
      style={styles.dropdown}
      placeholderStyle={styles.placeholderStyle}
      selectedTextStyle={styles.selectedTextStyle}
      inputSearchStyle={styles.inputSearchStyle}
      data={data}
      search
      maxHeight={300}
      labelField="label"
      valueField="value"
      placeholder="Selectează jocul tău preferat"
      searchPlaceholder="Caută jocul"
      value={value}
      onChange={item => {
        setValue(item.value);
        handleSaveToFirebase(item.value);
      }}
      renderItem={renderItem}
    />
  );
};

export default DropdownComponent;

const styles = StyleSheet.create({
  dropdown: {
    margin: 10,
    height: 50,
    width: 300,
    backgroundColor: '#071330',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  item: {
    padding: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textItem: {
    flex: 1,
    fontSize: 16,
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
});
