import { View, Text, StyleSheet, SafeAreaView, Image, ImageBackground } from 'react-native'
import React, {useState, useEffect} from 'react'
import users from '../../assets/data/users';
import { Directions } from 'react-native-gesture-handler';
import { DataStore, Auth} from 'aws-amplify';
import Animated  from 'react-native-reanimated';

import { Match, User } from '../models';



const MatchSrceen = () => {
    const [matches, setMatches] = useState([]);
    const [me, setMe] = useState(null);
    
    useEffect(() =>{ 
        let isMounted = true;

        const getCurrentUser = async () => {
            const authUser = await Auth.currentAuthenticatedUser();
    
            const dbUsers = await DataStore.query(
                User,
                u => u.sub('eq', authUser.attributes.sub),
                // u => u.sub('eq', '6'),
            );
    
            if(!dbUsers || dbUsers.lenght === 0){
                // console.warn('This is a new user');
                return;
            }
            if (isMounted){
                setMe(dbUsers[0]);
            }
        };

        getCurrentUser(),[]
        return () => { isMounted = false;}
    },[]);


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
                setMatches(result);
            }
        };
        fetchMatches();
        return () => { isMounted = false;}
    }, [me])

    useEffect(() => {
        const subscription = DataStore.observe(Match).subscribe(msg => {
            // console.log(msg.model, msg.opType, msg.element);
            if(msg.opType === 'UPDATE'){
                const newMatch = msg.element;
                if(
                    newMatch.isMatch &&
                    (newMatch.user1Id === me.id || newMatch.user2Id === me.id)
                ){
                    // console.log(
                    //     '+++++++++++++++++++++++++++++ There is a new match waiting for you!',
                    // );
                }
            }
        });

        return () => subscription.unsubscribe();
    },[me]);

  return (
    <SafeAreaView style={styles.root}>
        <View style={styles.container}>
      <Text style={{fontWeight: 'bold', fontSize: 24, color: '#F63A6E'}}>
        New Matches
        </Text>
        <View style={styles.users}>
            {matches.map(match => {
                const matchUser = match.User1.id === me.id ? match.User2 : match.User1;
                if(!match.User1 || !match.User2){
                    return(
                        <View style={styles.user} key={match.id}>
                            <Image style={styles.image} resizeMode='contain' source={{}}/>
                            <Text style={styles.name}>New Match</Text>
                        </View>
                    );
                }
                return(
                    <View style={styles.user} key={match.id}>
                        <Image style={styles.image} resizeMode='contain' source={matchUser.image}/>
                        <Text style={styles.name}>{matchUser.name}</Text>
                    </View>
                );
            })}

        </View>
        </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    root: {
        width: '100%',
        padding: 10,
        flex: 1,
    },
    container: {
        padding: 10,
    },
    users: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    user: {
        width: 100,
        height: 100,
        margin: 10,
        borderRadius: 50,

        borderWidth: 3,
        padding: 3,
        borderColor: '#F63A6E',

    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 50,
    },
    name: {
        textAlign:'center',
        marginTop: 10,
        fontWeight:'bold'
    }
});

export default MatchSrceen