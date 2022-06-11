import { View, Text, StyleSheet, SafeAreaView, Image, Pressable, TextInput} from 'react-native'
import React, { useState } from 'react';
import {Auth} from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';

const ProfileScreen = () => {
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState();
    const [lookingFor, setLookingFor] = useState();

    const save = () => {}

    return (
        <SafeAreaView style={styles.root}>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Name..."
                    value={name}
                    onChangeText={setName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Bio..."
                    value={bio}
                    onChangeText={setBio}
                />
                
                <Text>Gender</Text>
                <Picker
                    label="Gender"
                    selectedValue={gender}
                    onValueChange={(itemValue) =>
                        setGender(itemValue)
                    }>
                    <Picker.Item label="Male" value="MALE" />
                    <Picker.Item label="Female" value="FEMALE" />
                    <Picker.Item label="Other" value="OTHER" />
                </Picker>

                <Text>Looking For</Text>
                <Picker
                    label="Looking For"
                    selectedValue={lookingFor}
                    onValueChange={(itemValue) =>
                        setLookingFor(itemValue)
                    }>
                    <Picker.Item label="Male" value="MALE" />
                    <Picker.Item label="Female" value="FEMALE" />
                    <Picker.Item label="Other" value="OTHER" />
                </Picker>

                <Pressable onPress={save} style={styles.button}>
                    <Text>Save</Text>
                </Pressable>

                <Pressable onPress={() => Auth.signOut()} style={styles.button}>
                    <Text>Sign Out</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        padding: 10,
        flex: 1,
    },
    container: {
        padding: 10,
    },
    button:{
        backgroundColor:'#F63A6E',
        height: 25,
        justifyContent:'center',
        alignItems:'center',
        borderRadius: 20,
        margin: 10
    },
    input:{
        margin:10,
        borderBottomColor:'lightgray',
        borderBottomWidth: 1
    }
});

export default ProfileScreen;