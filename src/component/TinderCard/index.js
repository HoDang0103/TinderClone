import React, {useState, useEffect} from 'react';
import {View, Text, ImageBackground, StyleSheet} from 'react-native';
import { Storage } from 'aws-amplify';
const Card = (props) => {
    const {name, image, bio, gender} = props.user
    const [imageUrl, setImageUrl] = useState(image);

    useEffect(() =>{
      if(!image?.startsWith('http')){
        Storage.get(image).then(setImageUrl);
      }
    },[image]); 

    return(
        <View style={styles.card}>
            <ImageBackground source={{uri: imageUrl}}
            style={styles.image}
            >
                <View style={styles.cardInner}>
                <Text style={styles.name}>
                {name}
                </Text>
                <Text style={styles.bio}>{bio}</Text>
                <Text style={styles.bio}>{gender}</Text>
                </View>
            </ImageBackground>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
    },
    card: {
      width: '100%',
      height: '100%',
      borderRadius: 10,
      backgroundColor: '#fefefe',
  
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
      paddingVertical:5,
      lineHeight: 24,
      // marginVertical:5
    },
    cardInner: {
      padding: 10,
    },
})

export default Card;
//test github
