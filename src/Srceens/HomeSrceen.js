import React, {useEffect, useState} from "react";
import {View, StyleSheet} from 'react-native';
import Card from '../component/TinderCard'
import users from '../../assets/data/users.js'
import { GestureHandlerRootView } from "react-native-gesture-handler";

import Entypo from 'react-native-vector-icons/Entypo'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import { DataStore, Auth } from "aws-amplify";
import { User, Match } from "../models";


import AnimatedStack from "../component/AnimatedStack";


// const jeff={
//   name: 'Jeff',
//   bio: 'Im Jeff',
//   image: 'https://notjustdev-dummy.s3.us-east-2.amazonaws.com/avatars/jeff.jpeg'
// }

const HomeSrceen = ({isUserLoading}) => {
  const [users,setUsers] = useState([]);
  const [matchesIds, setMatchesIds] = useState([]);
  const [curentUser, setCurrentUser] = useState(null);
  const [me,setMe] = useState(null);

  useEffect(() => {
    const getCurrentUser = async () => {
        const authUser = await Auth.currentAuthenticatedUser();

        const dbUsers = await DataStore.query(
            User,
            // u => u.sub('eq', '6'),
            u => u.sub('eq', authUser.attributes.sub),
        );
        if(!dbUsers || dbUsers.lenght === 0){
            return;
        }
        setMe(dbUsers[0]);
    };
    getCurrentUser();
  },[isUserLoading])

  useEffect(() => {
    if(!me){
        return;
    }

    let isMounted = true;

    const fetchMatches = async () => {
        const result = await DataStore.query(Match,
            // match => match.user1Id('eq', me.id).user2Id('eq',me.id)
            m => m
                .isMatch('eq',true)
                .or(m1 => m1.user1Id('eq', me.id).user2Id('eq',me.id)),    
        );
        if (isMounted){
            setMatchesIds(result.map(match =>
              match.user1Id === me.id ? match.user2Id : match.user1Id,
            ));
        }
    };
    fetchMatches();
    return () => { isMounted = false;}
}, [me])

  useEffect(() => {
    if(!matchesIds){
      return;
    }
    const fetchUsers = async () => {
      let fetchedUsers = await DataStore.query(User, user => 
        user.gender('eq', me.lookingFor), 
      );
      fetchedUsers = fetchedUsers.filter(u => !matchesIds.includes(u.id));
      setUsers(fetchedUsers
        );
    }; 
    fetchUsers();
  }, [isUserLoading, me])

  const onSwipeLeft = () => {
    if(!curentUser || !me){
      return;
    }
    console.warn("swipeleft: ", curentUser.name)
  };

  const onSwipeRight = async () => {
    if(!curentUser || !me){
      return;
    }

    const myMatches = await DataStore.query(Match, match => 
      match.user1Id('eq', me.id).user2Id('eq',curentUser.id),
    );
    // console.warn("myMatches: ",myMatches.length);

    if(myMatches.length > 0){
      console.warn('You already swiped right to this user');
      return;
    }

    const hisMatches = await DataStore.query(Match, match => 
      match.user1Id('eq', curentUser.id).user2Id('eq',me.id),
    );
    console.warn("hisMatches: ",hisMatches.length);
    if(hisMatches.length > 0){
      console.warn('Yay, this is a new match');
      const hisMatch = hisMatches[0];
      DataStore.save(
        Match.copyOf(hisMatch, updated => (updated.isMatch = true)),
      );
      return;
    }

    console.warn('Seeding him a match request!');

    const newMatch = new Match({
      user1Id: me.id,
      user2Id: curentUser.id,
      isMatch: false
    })
    console.log(newMatch);
    DataStore.save(newMatch);
    console.log(users)
  };
  return (
    <GestureHandlerRootView style={styles.pageContainer}>
     <AnimatedStack
     data={users}
     renderItem={(({item}) => <Card user={item} />)}
     setCurrentUser={setCurrentUser}
     onSwipeLeft={onSwipeLeft}
     onSwipeRight={onSwipeRight}
     />
     <View style={styles.icons}>
        <View style={styles.button}>
          <FontAwesome name="undo" size={24} color="#FBD88B"/>
        </View>
        <View style={styles.button}>
          <Entypo name="cross" size={24} color="#F76C6B"/>
        </View>
        <View style={styles.button}>
          <FontAwesome name="star" size={24} color="#3AB4CC"/>
        </View>
        <View style={styles.button}>
          <FontAwesome name="heart" size={24} color="#4FCC94"/>
        </View>
        <View style={styles.button}>
          <Ionicons name="flash" size={24} color="#A65CD2"/>
        </View>
     </View>
    </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
  pageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    width: '100%',
    backgroundColor:'#ededed'
  },
  icons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10
  },
  button: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 50
  }
});

export default HomeSrceen;
