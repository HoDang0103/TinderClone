import React, { useState } from "react";
import 'react-native-gesture-handler';
import {View, StyleSheet, SafeAreaView ,Text, Pressable} from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import MatchSrceen from "./src/Srceens/MatchSrceen";
import HomeScreen from './src/Srceens/HomeSrceen'



// const jeff={
//   name: 'Jeff',
//   bio: 'Im Jeff',
//   image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg'
// }

const App = () => {
  const [activeScreen, setActiveScreen] = useState('HOME');

  const color = '#b5b5b5';
  const activeColor= '#F76C6B'

  return (
    <SafeAreaView style={styles.root}>
      <GestureHandlerRootView style={styles.pageContainer}>
        <View style={styles.topNavigation}>
          <Pressable onPress={() => setActiveScreen('HOME')}>
            <Fontisto
              name="tinder"
              size={24}
              color={activeScreen === 'HOME' ? activeColor : color}/>
          </Pressable>
          <Pressable onPress={() => setActiveScreen('STAR')}>
            <MaterialCommunityIcons
              name="star-four-points"
              size={24}
              color={activeScreen === 'STAR' ? activeColor : color}/>
          </Pressable>
          <Pressable onPress={() => setActiveScreen('CHAT')}>
            <Ionicons
              name="ios-chatbubbles"
              size={24}
              color={activeScreen === 'CHAT' ? activeColor : color}/> 
          </Pressable>
          <Pressable onPress={() => setActiveScreen('USER')}>
            <FontAwesome
              name="user"
              size={24}
              color={activeScreen === 'USER' ? activeColor : color}/>
          </Pressable>
        </View>
          {activeScreen === 'HOME' && <HomeScreen/>}
          {activeScreen === 'CHAT' && <MatchSrceen/>}
      </GestureHandlerRootView>
    </SafeAreaView>
    );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  topNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10
  }
});

export default App;
