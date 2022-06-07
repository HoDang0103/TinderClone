import React from "react";
import {Text, Image, ImageBackground, View, StyleSheet} from 'react-native';
import Card from './src/component/TinderCard'
import users from './assets/data/users'

// const jeff={
//   name: 'Jeff',
//   bio: 'Im Jeff',
//   image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg'
// }

const App = () => {
  return (
    <View style={styles.pageContainer}>
      <Card user={users[3]}/>
    </View>
    );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  }
})

export default App;
