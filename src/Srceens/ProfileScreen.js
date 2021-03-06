import { View, Text, StyleSheet, SafeAreaView, Image, Pressable, TextInput, Alert, ScrollView} from 'react-native'
import React, { useState, useEffect } from 'react';
import {Auth, DataStore, Storage} from 'aws-amplify';
import { S3Image } from 'aws-amplify-react-native';
import {Picker} from '@react-native-picker/picker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import { User } from '../models';

const ProfileScreen = () => {
    const [user, setUser] = useState(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [gender, setGender] = useState();
    const [lookingFor, setLookingFor] = useState();
    const [newImageLocalUri, setNewImageLocalUri] = useState(null);

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
    
    const uploadImage = async () => {
        try {
            const response = await fetch(newImageLocalUri);

            const blob = await response.blob();

            const urlParts = newImageLocalUri.split('.');
            const extension = urlParts[urlParts.length - 1];

            const key = `${user.id}.${extension}`;

            await Storage.put(key, blob);

            return key;
        } catch(e) {
            console.log(e);
        }
        return '';
    }

    const save = async () => {
        if(!isValid()){
            console.warn(isValid.value);
            return;
        }

        let newImage;
        if(newImageLocalUri){
            newImage = await uploadImage();
        }

        if(user){
            const updateUser = User.copyOf(user, updated => {
                updated.name = name;
                updated.bio = bio;
                updated.gender = gender;
                updated.lookingFor = lookingFor;
                if(newImage){
                    updated.image = newImage;
                }
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
            setNewImageLocalUri(null);
        }

        Alert.alert('User save successfully');
    }

    const pickImage = () => {
        launchImageLibrary(
            {mediaType: 'photo'},
            ({didCancel,errorCode,errorMessage,assets}) => {
                if(didCancel || errorCode){
                    console.warn('Cancel or Error');
                    console.log(errorMessage);
                    return;
                }
                setNewImageLocalUri(assets[0].uri);
            }
        )
    };

    const signOut = async () => {
        await DataStore.clear();
        Auth.signOut();
    }

    const renderImage = () => {
        if(newImageLocalUri) {
            return <Image source={{uri: newImageLocalUri}} style={styles.image}/>;
        }
        if(user?.image?.startsWith('http')) {
            return <Image source={{uri: user?.image}} style={styles.image}/>;
        }
        return <S3Image imgKey={user?.image} style={styles.image}/>;
    }

    return (
        <SafeAreaView style={styles.root}>
            <ScrollView style={styles.container}>
                {renderImage()}
                <Pressable onPress={pickImage}>
                    <Text>Change Image</Text>
                </Pressable>

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
            </ScrollView>
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
    },
    image:{
        width: 100,
        height: 100,
        borderRadius: 50
    }
});

export default ProfileScreen;