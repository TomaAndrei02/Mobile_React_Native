import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Modal, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as ImagePicker from "expo-image-picker"
import { ref, uploadBytesResumable, getDownloadURL} from 'firebase/storage'
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { FIRESTORE_DB, storage, FIREBASE_AUTH } from '../../FireBaseConfig'
import { updateProfile, reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth'
import { launchCameraAsync } from 'expo-image-picker'
import { Ionicons } from '@expo/vector-icons'
import DropdownComponent from './DropList'
import { useNavigation } from '@react-navigation/native'

export default function EditProfil() {
    const [nume, setNume] = useState(nume);
    const [image, setImage] = useState("");
    const [progress, setProgress] = useState(0);
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const currentUser = FIREBASE_AUTH.currentUser;
    const navigation = useNavigation();

    useEffect(() => {
        async function fetchProfileImage() {
            try {
                const userQuery = query(collection(FIRESTORE_DB, "useri"), where("userId", "==", currentUser.uid));
                const querySnapshot = await getDocs(userQuery);
                if (!querySnapshot.empty) {
                    const userData = querySnapshot.docs[0].data();
                    setProfileImageUrl(userData.url);
                }
            } catch (error) {
                console.error("Eroare la încarcarea imaginii:", error);
            }
        }
        fetchProfileImage();
    }, [])

    async function pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4]
        })

        if (!result.canceled) {
            setImage(result.assets[0].uri);
            await uploadImage(result.assets[0].uri, "image");
        }
    }

    async function takeImage() {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [3, 4],
        });
    
        if (!result.canceled) {
            setImage(result.assets[0].uri);
            await uploadImage(result.assets[0].uri, "image");
        }
    }
    

    async function uploadImage(uri, fileType) {
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(storage, "PozaProf/" + new Date().getTime())
        const uploadTask = uploadBytesResumable(storageRef, blob)

        uploadTask.on("state_changed",
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                console.log("Progres:" + progress + "%");
                setProgress(progress.toFixed())
            },
            (error) => {

            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                    console.log("Fisierul este in:", downloadURL)
                    await saveRecord(fileType, downloadURL, new Date().toISOString());
                    setImage("");
                    setProfileImageUrl(downloadURL);
                })
            }
        )
    }

    async function saveRecord(fileType, url, createdAt) {
        try {
            const docRef = await addDoc(collection(FIRESTORE_DB, "useri"), {
                fileType,
                url,
                createdAt,
                userId: currentUser.uid
            })
        } catch (e) {
            console.log(e)
        }
    }

    const actualizareCont = async () => {
        setLoading(true);
    try {
      const actualizareNume = await updateProfile(currentUser,{
        displayName: nume
      });
    }finally{
        setLoading(false);
        navigation.navigate('ProfilPrincipal')
    }

    }

    const handlePasswordReset = async () => {
        if (!newPassword) {
            Alert.alert("Eroare", "Introdu parola nouă!");
            return;
        }
        if (newPassword !== confirmNewPassword) {
            Alert.alert("Eroare", "Parolele nu se potrivesc!");
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, oldPassword);
            await reauthenticateWithCredential(currentUser, credential);
            await updatePassword(currentUser, newPassword);
            Alert.alert("Succes", "Parola a fost resetată!");
            setModalVisible(false);
        } catch (error) {
            console.log("Parola nu a putut fi resetată:", error);
            if (error.message === "Firebase: Error (auth/missing-password)."){
                alert('Parola nu a fost introdusă!');
              }
            else if (error.message === "Firebase: Error (auth/invalid-login-credentials)."){
                alert('Parola introdusă este greșită!');
              }
        }
    };

    return (
        <View style={styles.container}>
            <Image source={profileImageUrl ? { uri: profileImageUrl } : require('./Imagini/DefaultUser.jpg')} style={{ width: 150, height: 150, borderRadius: 10 }} />
            <View style={{flexDirection:'row', marginVertical:10,}}>
                <TouchableOpacity onPress={pickImage} style={{ alignItems: "center", justifyContent: "center" }}>
                    <Ionicons name='image' size={40} color='#071330' />
                </TouchableOpacity>
                <TouchableOpacity onPress={takeImage} style={{ alignItems: "center", justifyContent: "center", marginLeft:20,}}>
                    <Ionicons name='camera' size={40} color='#071330'/>
                </TouchableOpacity>
            </View>
            
            <TextInput value={nume} style={styles.input} placeholder={currentUser.displayName} autoCapitalize='none' onChangeText={(text) => setNume(text)}></TextInput>
            <DropdownComponent/>
            <View style={styles.butoane}>
                <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>Resetare Parolă</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={actualizareCont}>
                    <Text style={styles.buttonText}>Actualizare Cont</Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Resetare Parolă</Text>
                        <TextInput
                            placeholder="Parola veche"
                            value={oldPassword}
                            onChangeText={setOldPassword}
                            secureTextEntry
                            style={styles.inputModal}
                        />
                        <TextInput
                            placeholder="Parola nouă"
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                            style={styles.inputModal}
                        />
                        <TextInput
                            placeholder="Confirmare parolă nouă"
                            value={confirmNewPassword}
                            onChangeText={setConfirmNewPassword}
                            secureTextEntry
                            style={styles.inputModal}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.buttonconf}
                                onPress={handlePasswordReset}
                            >
                                <Text style={styles.buttonText}>Confirmare</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => setModalVisible(!modalVisible)}
                            >
                                <Text style={styles.buttonText}>Anulare</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>

    )
}

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
        marginBottom:10,
      },
      buttonconf: {
        backgroundColor: '#2ca243',
        borderRadius: 20,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom:10,
      },
    
      buttonText: {
        color: '#fff',
        fontSize: 14,
        textAlign: 'center',
        fontWeight:'bold',
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
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    modalText: {
        fontSize: 17,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
    },

    inputModal: {
        width: 200,
        height: 50,
        borderRadius: 20,
        borderColor: 'black',
        borderWidth: 1,
        marginBottom: 10,
        paddingLeft: 8,
        fontSize: 15,
    },

    modalButtons: {
        marginTop:10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    });    
