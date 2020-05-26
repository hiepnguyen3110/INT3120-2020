import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Image, Card } from 'react-native-elements';
import firebase from 'firebase';
import styles from './styles';
import Sound from 'react-native-sound';
import layout from '../../../constants/layout';

const AnswerTypeTwo = (props: { content?: any; lessonInfo?: any; 
  setNextQuestion?: any; id?: any; heart?: any; setHeart?: any }) => {
  const { content, lessonInfo, setNextQuestion, id, heart, setHeart } = props;
  const database = firebase.database();
  const result = database.ref('/topic_detail/' +
    lessonInfo.topicName + '/test_bank/' + lessonInfo.lessonName +
    '/results/' + content.id);
  const [backgrounColor1, setBackgroundColor1] = useState('#FFF');
  const [backgrounColor2, setBackgroundColor2] = useState('#FFF');
  const [backgrounColor3, setBackgroundColor3] = useState('#FFF');
  const [backgrounColor4, setBackgroundColor4] = useState('#FFF');
  const [status, setStatus] = useState('loading'); 

  useEffect(() => {
    console.log('type' + 2)
    setStatus('loading'); 
    let check = 0; 
    Object.keys(content).forEach((item, index) => {
      if (item == 'id') check++
      else if (item == 'content_a') check++
      else if (item == 'content_b') check++
      else if (item == 'content_c') check++
      else if (item == 'content_d') check++
    })
    if ( check == 5 ) {
      setNextQuestion(false);
      setBackgroundColor1('#FFF');
      setBackgroundColor2('#FFF');
      setBackgroundColor3('#FFF');
      setBackgroundColor4('#FFF');
      setStatus('run'); 
    } else {
      setStatus('null'); 
    }
  }, [id])

  useEffect(() => {
    if (status == null) {
      setTimeout(() => {
        setNextQuestion(true);
      }, 3000)
    }
  }, [status])

  function onPress(selected: any, id: number) {
    // console.log(selected); 
    result.on('value', function (snapshot: any) {
      // console.log(snapshot); 
      if (snapshot.val().text == selected) {
        switch (id) {
          case 1:
            setBackgroundColor1("#80e27e");
            break;
          case 2:
            setBackgroundColor2("#80e27e");
            break;
          case 3:
            setBackgroundColor3("#80e27e");
            break;
          case 4:
            setBackgroundColor4("#80e27e");
            break;
          default:
            break;
        }
      } else {
        switch (id) {
          case 1:
            setBackgroundColor1("#F44336");
            break;
          case 2:
            setBackgroundColor2("#F44336");
            break;
          case 3:
            setBackgroundColor3("#F44336");
            break;
          case 4:
            setBackgroundColor4("#F44336");
            break;
          default:
            break;
        }
        switch (snapshot.val().text) {
          case 'a':
            setBackgroundColor1("#80e27e");
            break;
          case 'b':
            setBackgroundColor2("#80e27e");
            break;
          case 'c':
            setBackgroundColor3("#80e27e");
            break;
          case 'd':
            setBackgroundColor4("#80e27e");
            break;
          default:
            break;
        }
        setHeart(heart-1)
      }
      // speaker
      const speaker = new Sound(snapshot.val().void_uri, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('failed to load the sound', error);
          return;
        }
        setTimeout(() => {
          speaker.release();
          setNextQuestion(true);
        }, speaker.getDuration() * 1000)
        speaker.play((success) => {
          if (success) {
            console.log('successfully finished playing');
          } else {
            console.log('playback failed due to audio decoding errors')
          }
        })
      })
    })
  }

  if (status == 'loading') {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Waiting answer...</Text>
      </View>
    )
  }
  else if (status == 'null') {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <Text>Sorry! The data is not Ready.</Text>
      </View>
    )
  }
  else {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ flexDirection: 'row' }}>
          <View>
            <TouchableOpacity
              style={styles.view_a}
              onPress={() => onPress('a', 1)}
            >
              <Card containerStyle={{ alignItems: 'center', backgroundColor: backgrounColor1 }}>
                <Image
                  source={{ uri: content.content_a }}
                  containerStyle={styles.image}
                />
              </Card>
            </TouchableOpacity>
          </View>

          <View>
            <TouchableOpacity
              style={styles.view_b}
              onPress={() => onPress('b', 2)}
            >
              <Card containerStyle={{ backgroundColor: backgrounColor2 }}>
                <Image
                  source={{ uri: content.content_b }}
                  style={styles.image}
                />
              </Card>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ flexDirection: 'row' }}>
          <View>
            <TouchableOpacity
              style={styles.view_c}
              onPress={() => onPress('c', 3)}
            >
              <Card containerStyle={{ backgroundColor: backgrounColor3 }}>
                <Image
                  source={{ uri: content.content_c }}
                  style={styles.image}
                />
              </Card>
            </TouchableOpacity>
          </View>
          <View>
            <TouchableOpacity
              style={styles.view_d}
              onPress={() => onPress('d', 4)}
            >
              <Card containerStyle={{ backgroundColor: backgrounColor4 }}>
                <Image
                  source={{ uri: content.content_d }}
                  style={styles.image}
                />
              </Card>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

export default AnswerTypeTwo; 