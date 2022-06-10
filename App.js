import React from "react";
import 'react-native-gesture-handler';
import {View, StyleSheet} from 'react-native';
import { GestureHandlerRootView } from "react-native-gesture-handler";

import MatchSrceen from "./src/Srceens/MatchSrceen";


// const jeff={
//   name: 'Jeff',
//   bio: 'Im Jeff',
//   image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg'
// }

const App = () => {

  return (
    <GestureHandlerRootView style={styles.pageContainer}>
     <MatchSrceen />
    </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
});

export default App;
