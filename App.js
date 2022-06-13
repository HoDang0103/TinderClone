import React, { Profiler, useState, useEffect } from "react";
import 'react-native-gesture-handler';
import {View, StyleSheet, SafeAreaView ,Text, Pressable, ActivityIndicator} from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Fontisto from 'react-native-vector-icons/Fontisto'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

import Amplify, {DataStore, Hub} from 'aws-amplify';
import { withAuthenticator } from 'aws-amplify-react-native';
import config from './src/aws-exports'

import MatchSrceen from "./src/Srceens/MatchSrceen";
import HomeScreen from './src/Srceens/HomeSrceen'
import ProfileScreen from "./src/Srceens/ProfileScreen";


// const jeff={
//   name: 'Jeff',
//   bio: 'Im Jeff',
//   image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg'
// }

Amplify.configure(
  {
    ...config,
    Analyties: {
      disabled: true,
    },
  }
);


const App = () => {
  const [activeScreen, setActiveScreen] = useState('HOME');
  const [isUserLoading, setUserLoading] = useState(true);

  const color = '#b5b5b5';
  const activeColor= '#F76C6B';

  useEffect(() => {

    const listener = Hub.listen("DataStore", async hubData => {
      const  { event, data } = hubData.payload;
      if (event === 'modelSynced' && data?.model?.name === 'User') {
        console.log('User Model has finish syncing');
        setUserLoading(false);
      }
    });

    // const listener = Hub.listen('datastore', async hubData => {
    //   const {event, data} = hubData.payload;
    //   if (event === 'modelSyned'  && data?.model?.name === 'User') {
    //     console.log('User Model has finish syncing');
    //   };
    // });
    
    return () => listener();

  }, []);

  const renderPage = () => {
    // console.log(isUserLoading)
    // if(isUserLoading) {
    //   return <ActivityIndicator style={{flex: 1}} />;
    // }

    if(activeScreen === 'HOME'){
      return <HomeScreen isUserLoading={isUserLoading}/>;
    }
    
    if(activeScreen === 'PROFILE'){
      return <ProfileScreen/>;
    }

    if(activeScreen === 'CHAT'){
      return <MatchSrceen/>;
    }

  }

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
          <Pressable onPress={() => setActiveScreen('PROFILE')}>
            <FontAwesome
              name="user"
              size={24}
              color={activeScreen === 'PROFILE' ? activeColor : color}/>
          </Pressable>
        </View>

        {renderPage()}
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

export default withAuthenticator(App);
