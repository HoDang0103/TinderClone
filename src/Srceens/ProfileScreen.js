import { View, Text, StyleSheet, SafeAreaView, Image, Pressable, TextInput, Alert} from 'react-native'
import React, { useState, useEffect } from 'react';
import {Auth, DataStore} from 'aws-amplify';
import {Picker} from '@react-native-picker/picker';
import { User } from '../models';

const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState();
    const [lookingFor, setLookingFor] = useState();

    useEffect(() => {
        const getCurrentUser = async () => {
            const authUser = await Auth.currentAuthenticatedUser();

            const dbUsers = await DataStore.query(
                User,
                u => u.sub('eq', authUser.attributes.sub),
            );

            if(!dbUsers || dbUsers.lenght === 0){
                console.warn('This is a new user');
                return;
            }
            const dbUser = dbUsers[0];
            setUser(dbUser);

            setName(dbUser.name);
            setBio(dbUser.bio);
            setGender(dbUser.gender);
            setLookingFor(dbUser.lookingFor);
        };
        getCurrentUser();
    },[])

    const isValid = () => {
        return name && bio && gender && lookingFor;
    };
    
    const save = async () => {
        if(!isValid()){
            console.warn(isValid.value);
            return;
        }

        if(user){
            const updateUser = User.copyOf(user, updated => {
                updated.name = name;
                updated.bio = bio;
                updated.gender = gender;
                updated.lookingFor = lookingFor;
            });

            await DataStore.save(updateUser);
        }else{
            const authUser = await Auth.currentAuthenticatedUser();

            const newUser = new User({
                sub: authUser.attributes.sub,
                name,
                bio,
                gender,
                lookingFor,
                image: 
                    'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/zuck.jpeg',
            })
            await DataStore.save(newUser);
        }

        Alert.alert('User save successfully');
    }

    const signOut = async () => {
        await DataStore.clear();
        Auth.signOut();
    }

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
                    <Text style={{color:'white', fontWeight: 'bold'}}>Save</Text>
                </Pressable>

                <Pressable onPress={signOut} style={styles.button}>
                    <Text style={{color:'white', fontWeight: 'bold'}}>Sign Out</Text>
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