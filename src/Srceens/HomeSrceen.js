import React from "react";
import {View, StyleSheet} from 'react-native';
import Card from '../component/TinderCard'
import users from '../../assets/data/users.js'
import { GestureHandlerRootView } from "react-native-gesture-handler";


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
    </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%'
  },
});

export default HomeSrceen;
