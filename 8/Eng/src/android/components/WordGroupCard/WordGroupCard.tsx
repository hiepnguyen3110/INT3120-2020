import React, { Component, useState } from 'react';
import styles from './styles';
import { Card, Button } from 'react-native-elements';
import IconAntDeisign from 'react-native-vector-icons/AntDesign';
import IconFeather from 'react-native-vector-icons/Feather';
import IconFontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import { Text, View, Dimensions, Image } from 'react-native';


const CardWordGroup = (props: { data?: any; navigation?: any, topic_name: any }) => {
  const { data, topic_name } = props;
  // console.log(topic_name);
  const { navigation } = props;
  const [colorStar, setColorStar] = useState("staro");
  const changeStar = () => {
    if (colorStar == 'staro') {
      setColorStar('star');
    }
    else if (colorStar == 'star') {
      setColorStar('staro');
    }
  };
  const onPress = () => {
    navigation.navigate('DetailWordGroupScreen', { topicName: topic_name, lessonName: data.wordGroupName });
  }
  const onFlipCard = () => {
    navigation.navigate('FlipCardWord', { topicName: topic_name, lessonName: data.wordGroupName });
  };

  const goPracticeTest = () => {
    navigation.navigate('PracticeTestScreen', { topicName: topic_name, lessonName: data.wordGroupName });
  }; 

  const goGameChallenge = () => {
    navigation.navigate('GameChallengeScreen', { topicName: topic_name, lessonName: data.wordGroupName }); 
  }

  return (
    <View style={styles.containers}>
      <View style={styles.viewCard}>
        <Card containerStyle={styles.card}>
          <View style={styles.viewImg}>
            <IconAntDeisign
              name={colorStar}
              color='#ff5e00'
              size={25}
              style={{ position: 'absolute', top: 0, zIndex: 1, left: 0 }}
              onPress={changeStar}
            />
            <Image
              source={{ uri: data.image_les }}
              style={styles.img}
            />
          </View>

          <View style={{ alignItems: 'center', top: 15 }}>
          </View>
          <Text style={{ marginBottom: 30, textAlign: 'center', fontWeight: 'bold', fontSize: 24,marginTop:30 }}>
            {data.wordGroupName}
          </Text>
          <Text style={{ marginBottom: 30, textAlign: 'center', fontWeight: 'bold', color: '#ff5e00',fontSize:18 }}>
            {data.vn_meaning}
          </Text>
          <Text style={{ marginBottom: 10, textAlign: 'center' }}>
            Giúp bạn nắm vững {data.num_word} từ liên quan đến
             <Text style={{ fontStyle: 'italic', fontWeight: 'bold', textTransform: 'uppercase', fontSize: 14 }}> {data.vn_meaning}</Text> trong tiếng anh
      </Text>

        </Card>
      </View>
      <View style={styles.viewTool}>
        <View style={styles.viewIcon}>
          <IconFeather style={styles.iconTool}
            name='copy'
            onPress={onFlipCard}
          />
        </View>
        <View style={{ borderWidth: 0.25, borderColor: 'white', width: 25, marginTop: 3, marginBottom: 5 }}></View>
        <View style={styles.viewIcon}>
          <IconFeather style={styles.iconTool}
            name='edit'
            onPress={goPracticeTest}
          />
        </View>
        <View style={{ borderWidth: 0.25, borderColor: 'white', width: 25, marginTop: 3, marginBottom: 5 }}></View>
        <View style={styles.viewIcon}>
          <IconFontAwesome5 style={styles.iconTool}
            name='medal'
            onPress={goGameChallenge} 
          />
        </View>
      </View>
      <View style={styles.viewBtn}>
        <Button
          buttonStyle={styles.btnDetail}
          containerStyle={styles.btnDetail}
          title='CHI TIẾT'
          onPress={onPress}
        />
      </View>
    </View>
  )
}

export default CardWordGroup; 