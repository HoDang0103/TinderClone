import React from "react";
import 'react-native-gesture-handler';
import {Text, Image, ImageBackground, View, StyleSheet, Pressable} from 'react-native';
import Card from './src/component/TinderCard'
import users from './assets/data/users'
import Animated, { useSharedValue, useAnimatedStyle, withSpring, useAnimatedGestureHandler, event}  from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";

// const jeff={
//   name: 'Jeff',
//   bio: 'Im Jeff',
//   image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg'
// }

const App = () => {
  const translateX = useSharedValue(1);

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ]
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: _ => {
      console.warn('Touch start');
    },
    onActive: event => {
      translateX.value = event.translationX;
    },
    onEnd: () => {
      console.warn('Touch ended');
    }
  })
  return (
    <GestureHandlerRootView style={styles.pageContainer}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.animatedCard, cardStyle]}>
          <Card user={users[2]}/>
        </Animated.View>
      </PanGestureHandler>
    </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  animatedCard: {
    width: '100%',
    justifyContent: 'center',
    alignItems:'center'
  }
})

export default App;
