import React, {useState, useEffect} from "react";
import {Text, ImageBackground, View, StyleSheet} from 'react-native';
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
import LIKE from '../../../assets/images/LIKE.png';
import NOPE from '../../../assets/images/nope.png';


// const jeff={
//   name: 'Jeff',
//   bio: 'Im Jeff',
//   image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg'
// }

const ROTSTION = 60; 
const SWIPE_VELOCITY = 800;

const AnimatedStack = (props) => {

    const { data, renderItem, onSwipeRight, onSwipeLeft } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(currentIndex + 1);

  const currentProfile = data[currentIndex];
  const nextProfile = data[nextIndex];

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
const likeStyle = useAnimatedStyle(() => ({
  opacity: interpolate(
    translateX.value,
    [0, hiddenTranslateX/5],
    [0,1],
  ),
}));
const nopeStyle = useAnimatedStyle(() => ({
  opacity: interpolate(
    translateX.value,
    [-hiddenTranslateX/5 ,0],
    [1,0],
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
        ()=> runOnJS(setCurrentIndex)(currentIndex+1),
      );

    const onSwipe = event.velocityX > 0 ? onSwipeRight : onSwipeLeft;
    onSwipe && runOnJS(onSwipe)(currentProfile);
    },
  });

  useEffect(() => {
    translateX.value = 0;
    setNextIndex(currentIndex+1);
  },[currentIndex, translateX])
  return (
    <GestureHandlerRootView style={styles.root}>
      {nextProfile && (
      <View style={styles.nextCardContainer}>
        <Animated.View style={[styles.animatedCard, nextCardStyle]}>
          {renderItem({item: nextProfile})}
        </Animated.View>
      </View>
      )}

      {currentProfile && (
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.animatedCard, cardStyle]}>
          <Animated.Image source={LIKE} style={[styles.like, {left: 10}, likeStyle]} resizeMode='contain'></Animated.Image>
          <Animated.Image source={NOPE} style={[styles.like, {right: 10}, nopeStyle]} resizeMode='contain'></Animated.Image>
          {renderItem({item: currentProfile})}
        </Animated.View>
      </PanGestureHandler>
      )}
    </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
  root: {
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
    alignItems:'center',
  },
  like:{
    width: 150,
    height: 150,
    position: 'absolute',
    top: 10,
    zIndex: 1,
    elevation: 1,
  }

})

export default AnimatedStack;

