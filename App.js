import React from "react";
import {Text, Image, ImageBackground, View, StyleSheet} from 'react-native';

const App = () => {
  return (
    <View style={styles.pageContainer}>
      <View style={styles.card}>
        <ImageBackground source={{uri: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/vadim1.JPG'}}
        style={styles.image}
      >
        <View style={styles.cardInner}>
        <Text style={styles.name}>
          Elon Musk
        </Text>
        <Text style={styles.bio}>duihfsdhgfsidohfgdsi hgsodig osoidhgidh d di dihgdi</Text>
        </View>
      </ImageBackground>
    </View>
    </View>
    );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  card: {
    width: '95%',
    height: '70%',
    borderRadius: 10,

    shadowColor: "#000",
    //use for ios
    // shadowOffset: {
    //   width: 0,
    //   height: 5,
    // },
    // shadowOpacity: 0.36,
    // shadowRadius: 6.68,

    elevation: 11,
  },
  image:
  {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    overflow: 'hidden',

    justifyContent: 'flex-end',
  },
  name: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
  },
  bio: {
    fontSize: 24,
    color: 'white',
    lineHeight: 24,
  },
  cardInner: {
    padding: 10,
  },
  
})

export default App;
