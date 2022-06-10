import React, {useState, useEffect} from "react";
import 'react-native-gesture-handler';
import {Text, Image, ImageBackground, View, StyleSheet, Pressable} from 'react-native';
import Card from './src/component/TinderCard'
import users from './assets/data/users'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  useAnimatedGestureHandler,
  event,
  useDerivedValue,
  interpolate,
  runOnJS,
}  from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView } from "react-native-gesture-handler";
import useWindowDimensions from "react-native/Libraries/Utilities/useWindowDimensions";
import LIKE from './assets/images/LIKE.png';
import NOPE from './assets/images/nope.png';


// const jeff={
//   name: 'Jeff',
//   bio: 'Im Jeff',
//   image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg'
// }

const ROTSTION = 60; 
const SWIPE_VELOCITY = 800;

const App = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currentProfile = users[currentIndex];
  const nextProfile = users[nextIndex];

  const {width: screenWigth} = useWindowDimensions()

  const hiddenTranslateX = 2 * screenWigth;

  const translateX = useSharedValue(1);
  const rotate = useDerivedValue(
    () => interpolate(translateX.value,[0, hiddenTranslateX],[0, ROTSTION]) + 'deg',
  );

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
      {
        rotate: rotate.value
      }
    ]
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: interpolate(
          translateX.value,
          [-hiddenTranslateX, 0, hiddenTranslateX],
          [1,0.8,1],
        ),
      },
    ],
    opacity: interpolate(
      translateX.value,
      [-hiddenTranslateX, 0, hiddenTranslateX],
      [1,0.7,1],
    ),
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, context) => {
      context.startX = translateX.value;
    },
    onActive: (event, context) => {
      translateX.value = context.startX + event.translationX;
    },
    onEnd: (event) => {
      if(Math.abs(event.velocityX) < SWIPE_VELOCITY){
        translateX.value = withSpring(0);
        return;
      }

      translateX.value = withSpring(
        hiddenTranslateX*Math.sign(event.velocityX),
        {},
        ()=> runOnJS(setCurrentIndex)(currentIndex+1)
      )
    }
  })

  useEffect(() => {
    translateX.value = 0;
    setNextIndex(currentIndex+1);
  },[currentIndex, translateX])
  return (
    <GestureHandlerRootView style={styles.pageContainer}>
      {nextProfile && (
      <View style={styles.nextCardContainer}>
        <Animated.View style={[styles.animatedCard, nextCardStyle]}>
          <Card user={nextProfile}></Card>
        </Animated.View>
      </View>
      )}

      {currentProfile && (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.animatedCard, cardStyle]}>
          <Image source={LIKE} style={styles.like} resizeMode='contain'></Image>
          <Image source={NOPE} style={styles.like} resizeMode='contain'></Image>
          <Card user={currentProfile}/>
        </Animated.View>
      </PanGestureHandler>
      )}
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
    width: '90%',
    height: '75%',
    justifyContent: 'center',
    alignItems:'center'
  },
  nextCardContainer: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    justifyContent:'center',
    alignItems:'center'
  },
  like:{
    width: 100,
    height: 100,
    position: 'absolute',
    top: 10,
    zIndex: 1,
    elevation: 1,
  }

})

export default App;
