import React from "react";
import {View, StyleSheet} from 'react-native';
import Card from '../component/TinderCard'
import users from '../../assets/data/users.js'
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'


import AnimatedStack from "../component/AnimatedStack";


// const jeff={
//   name: 'Jeff',
//   bio: 'Im Jeff',
//   image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg'
// }

const HomeSrceen = () => {

const onSwipeLeft = (user) => {
  console.warn("swipeleft: ", user.name)
};

const onSwipeRight = (user) => {
  console.warn("swiperight: ", user.name)
};
  return (
    <GestureHandlerRootView style={styles.pageContainer}>
     <AnimatedStack
     data={users}
     renderItem={(({item}) => <Card user={item} />)}
     onSwipeLeft={onSwipeLeft}
     onSwipeRight={onSwipeRight}
     />
     <View style={styles.icons}>
        <View style={styles.button}>
          <FontAwesome name="undo" size={24} color="#FBD88B"/>
        </View>
        <View style={styles.button}>
          <Entypo name="cross" size={24} color="#F76C6B"/>
        </View>
        <View style={styles.button}>
          <FontAwesome name="star" size={24} color="#3AB4CC"/>
        </View>
        <View style={styles.button}>
          <FontAwesome name="heart" size={24} color="#4FCC94"/>
        </View>
        <View style={styles.button}>
          <Ionicons name="flash" size={24} color="#A65CD2"/>
        </View>
     </View>
    </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor:'#ededed'
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50
  }
});

export default HomeSrceen;
