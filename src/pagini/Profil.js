import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, Modal, TextInput, Alert } from 'react-native';
import React, { useState, useCallback } from 'react';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../FireBaseConfig';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';

const Profil = () => {
    const navigation = useNavigation();
    const [displayName, setDisplayName] = useState('');
    const [profileImageUrl, setProfileImageUrl] = useState(null);
    const [jocPreferat, setJocPreferat]= useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const currentUser = FIREBASE_AUTH.currentUser;

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

    const fetchDisplayName = async () => {
        const user = FIREBASE_AUTH.currentUser;
        if (user) {
            setDisplayName(user.displayName);
        }
    };

    const fetchJocPreferat = async () => {
        try {
            const userQuery = query(collection(FIRESTORE_DB, "jocpref"), where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(userQuery);
            if (!querySnapshot.empty) {
                const jocData = querySnapshot.docs[0].data();
                setJocPreferat(jocData.favoriteGame);
            }
        } catch (error) {
            console.error("Jocul nu a mers:", error);
        }
    };

    const stergereCont = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Eroare", "Parolele nu se potrivesc!");
            return;
        }
        try {
            const credential = EmailAuthProvider.credential(currentUser.email, password);
            await reauthenticateWithCredential(currentUser, credential);
            await deleteUser(currentUser);
            alert("Contul a fost șters.");
        } catch (error) {
            console.log("Contul nu a putut fi șters:", error);
            if (error.message === "Firebase: Error (auth/missing-password)."){
                alert('Parola nu a fost introdusă!');
              }
            else if (error.message === "Firebase: Error (auth/invalid-login-credentials)."){
                alert('Parola introdusă este greșită!');
              }
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchProfileImage();
            fetchDisplayName();
            fetchJocPreferat();
        }, [])
    );

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.imgtext}>
                    <Image source={profileImageUrl ? { uri: profileImageUrl } : require('./Imagini/DefaultUser.jpg')} style={{ width: 150, height: 150, borderRadius: 10 }} />
                    <Text style={styles.displayName}>{displayName}</Text>
                    {jocPreferat ? (
                        <Text style={styles.textjoc}>Jocul preferat este: {'\n'} {jocPreferat}</Text>
                    ) : null}
                </View>
                
                <View style={styles.butoane}>
                    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditProfil')}>
                        <Text style={styles.buttonText}>Editare profil</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonlib} onPress={() => navigation.navigate('JocuriCumparate')}>
                        <Text style={styles.buttonText}>Librăria ta</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => FIREBASE_AUTH.signOut()}>
                        <Text style={styles.buttonText}>Deconectare</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttondel} onPress={() => setModalVisible(true)}>
                        <Text style={styles.buttonText}>Șterge contul</Text>
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
                            <Text style={styles.modalText}>Introdu parola pentru a șterge contul</Text>
                            <TextInput
                                placeholder="Parolă"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                                style={styles.input}
                            />
                            <TextInput
                                placeholder="Confirmă parola"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry
                                style={styles.input}
                            />
                            <View style={styles.modalButtons}>
                                <TouchableOpacity
                                    style={styles.buttonsterg}
                                    onPress={stergereCont}
                                >
                                    <Text style={styles.buttonText}>Șterge</Text>
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
        </SafeAreaView>
    )
}

export default Profil

const styles = StyleSheet.create({
    container: {
        flex: 1,
        maringHorizontal: 50,
        backgroundColor: '#BBD1EA',
        justifyContent: 'center',
        alignItems: 'center',
    },

    butoane: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },

    button: {
        backgroundColor: '#071330',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    buttonlib: {
        margin: 5,
        backgroundColor: '#071330',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 38,
    },
    buttondel: {
        margin: 5,
        backgroundColor: '#2ca243',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 28,
    },
    buttonsterg: {
        backgroundColor: '#2ca243',
        borderRadius: 20,
        paddingVertical: 15,
        paddingHorizontal: 35,
    },

    displayName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        marginTop: 10,
    },

    textjoc: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },

    buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
    },

    imgtext:{
        alignItems:'center',
        backgroundColor:'white',
        paddingVertical:20,
        paddingHorizontal:40,
        marginBottom:20,
        borderRadius:30,
        marginHorizontal:30,
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

    input: {
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
