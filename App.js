import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { Button, FlatList, Image, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';

export default function App() {

    const [modalOpen, setModalOpen] = useState(false);
    const [list, setList] = useState([]);
    const [items, setItems] = useState([]);
    const [title, setTitle] = useState('');

    const storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('list', jsonValue)
        } catch (e) {
            console.log(e);
        }
    }
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('list')
            if (value !== null) {
                // value previously stored
                return value;
            }
        } catch (e) {
            // error reading value
            return [];
        }
    }
    const removeData = async (id) => {
        try {
            await AsyncStorage.setItem('list', JSON.stringify([...list.filter(l => l.id !== id)]))
            getData()
                .then((data) => {
                    setList(JSON.parse(data));
                })
                .catch((e) => {
                    console.log(e);
                });

        } catch (e) {
            // remove error
        }
        console.log('Done.')
    }


    const createList = () => {
        if (!title) return Alert.alert('OOPS!', 'Please enter a title');
        storeData([...list, { id: Date.now(), title }]);
        getData()
            .then((data) => {
                setList(JSON.parse(data));
            })
            .catch((e) => {
                console.log(e);
            });
        setTitle('');
    }

    console.log('list', list);

    useEffect(() => {
        getData()
            .then((data) => {
                setList(JSON.parse(data));
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logo} >
                    <Image style={{ width: 25, height: 25 }} source={require('./assets/favicon.png')} /> {' '}
                    Awesome Todo
                </Text>
                <Image style={{ width: 25, height: 25 }} source={require('./assets/user.png')} />
            </View>
            <View style={{ padding: 20 }}>
                <TextInput style={{ marginBottom: 10, borderBottomWidth: 1, paddingVertical: 5, borderBottomColor: '#bbb' }} placeholder='Title' onChangeText={(val) => setTitle(val)} value={title} />
                <Button color={'green'} style={{ width: 100 }} title="Add Todo" onPress={() => createList()} />
            </View>

            <View style={{ padding: 20 }}>

                <FlatList data={list}
                    renderItem={({ item }) => (
                        <TouchableOpacity key={item.id} onPress={() => removeData(item.id)}>
                            <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', padding: 10, borderWidth: 1, borderStyle: "dashed", borderColor: '#bbb', borderRadius: 10, marginBottom: 10, }}>
                                <MaterialIcons name="delete" size={16} color="#333" />
                                <Text style={{ color: "#333", marginLeft: 5 }} > {item.title}</Text>
                            </View>
                        </TouchableOpacity>
                    )}>
                </FlatList>

            </View>

            <StatusBar style="auto" />
            <Modal visible={modalOpen} animationType="slide">
                <View style={styles.container}>

                    <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold', margin: 50 }} >Create a list </Text>

                    <View style={{ padding: 40 }}>
                        <Button color={'red'} style={{ width: 100 }} title="Close" onPress={() => setModalOpen(false)} />
                    </View>
                </View>
            </Modal>
        </View>
    );
}

// react native styles
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        textAlign: 'center',
    },
    logo: {
        fontWeight: 'bold',
        fontSize: 20,
        color: '#555',
    },
    boldText: {
        fontWeight: 'bold',
    },
    header: {
        width: '100%',
        height: 80,
        marginTop: 20,
        padding: 20,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
