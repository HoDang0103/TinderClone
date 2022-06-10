import { View, Text, StyleSheet, SafeAreaView, Image } from 'react-native'
import React from 'react'
import users from '../../assets/data/users';
import { Directions } from 'react-native-gesture-handler';

const MatchSrceen = () => {
  return (
    <SafeAreaView style={styles.root}>
        <View style={styles.container}>
      <Text style={{fontWeight: 'bold', fontSize: 24, color: '#F63A6E'}}>
        New Matches
        </Text>
        <View style={styles.users}>
        {users.map(user => (
            <View style={styles.user} key={user.id}>
                <Image source = {{uri: user.image}} styles={styles.image} />
                </View>
        ))}
        </View>
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
    users: {
        flexDirection: 'row',
        flexWrap: 'wrap',

    },
    user: {
        width:100,
        height: 100,
        margin: 10,
        borderRadius: 50,

        borderWidth: 3,
        padding: 3,
        borderColor: '#F63A6E',
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    }
});

export default MatchSrceen