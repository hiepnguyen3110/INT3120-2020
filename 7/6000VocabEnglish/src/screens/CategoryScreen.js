import React, { Component } from "react";
const GLOBAL = require("../utils/Globals");
import { View, StyleSheet, FlatList, ScrollView, Alert } from "react-native";
import OverviewTopicItem from "../components/OverviewTopicItem";
import Carousel from "react-native-snap-carousel";
import itemTopicPeople from "../../data/CategoryItemByTopic";
import db from "../../config/configFirebase";
import Spinner from "react-native-loading-spinner-overlay";

export default class CategoryScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      topicItems: [],
    };
  }

  static navigationOptions = ({ route }) => {
    return {
      title: route.params.categoryTitle,
      headerTitleStyle: {
        color: GLOBAL.COLOR.ORANGE,
        fontWeight: "bold",
        textTransform: "capitalize",
      },
      headerTitleAlign: "center",
      headerTintColor: GLOBAL.COLOR.ORANGE,

      //title: navigation.getParam("categoryTitle", "A Nested Details Screen")
    };
  };

  _renderItem = ({ item, index }) => {
    let parentTopic = this.props.route.params.categoryTitle;
    return (
      <View
        style={{
          justifyContent: "center",
          alignContent: "center",
          alignItems: "center",
        }}
      >
        <OverviewTopicItem
          item={item}
          handleGotoDetail={this.handleGotoDetail(item.topicName, parentTopic)}
          gotoSlide={this.gotoSlide(item.topicName, parentTopic)}
          gotoPractice={this.gotoPractice(item.topicName)}
          gotoExam={this.gotoExam(item.topicName)}
        ></OverviewTopicItem>
      </View>
    );
  };

  gotoSlide(topicName, parentTopic) {
    return () => {
      console.log("Go to slide show!");
      this.props.navigation.navigate("SlideshowByTopic", {
        titleTopic: topicName,
        parentTopic: parentTopic,
      });
    };
  }
  gotoExam(topicName) {
    const { categoryId } = this.props.route.params;
    return () => {
      this.props.navigation.navigate("Exam", {
        titleTopic: topicName,
        categoryName: categoryId,
      });
    };
  }
  gotoPractice(topicName) {
    return () => {
      // console.log("Go to exam!");
      this.props.navigation.navigate("Practice", {
        titleTopic: topicName,
      });
    };
  }
  handleGotoDetail(topicName, parentTopic) {
    // console.log("TItle" + topicName);
    return () => {
      this.props.navigation.navigate("DetailTopic", {
        titleTopic: topicName,
        parentTopic: parentTopic,
      });
    };
    // console.log("View detal");
  }
  componentDidMount() {
    const { categoryId } = this.props.route.params;
    // if (categoryId !== "people") {
    //   Alert.alert(
    //     "Ứng dụng đang trong quá trình phát triển!",
    //     "Các bạn vui lòng lựa chọn chủ đề People/Body để trải nghiệm. \nXin cảm ơn!"
    //   );
    //   this.setState({ isLoading: false });
    // } else {
    //   this.fetchData();
    // }
    this.fetchData();
  }

  fetchData() {
    const { categoryId } = this.props.route.params;
    // console.log(categoryId);

    let data = [];
    if (categoryId !== undefined) {
      db.collection("/topic/")
        .doc(categoryId)
        .collection(categoryId)
        .get()
        .then((docs) => {
          docs.forEach((doc) => {
            // console.log(doc.id, "=>", doc.data());
            data.push(doc.data());
            // console.log(data);
          });

          this.setState({ topicItems: data, isLoading: !this.state.isLoading });
        })
        .catch((err) => {
          console.log("Error getting documents", err);
        });
    }
  }
  render() {
    const { categoryId } = this.props.route.params;
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.isLoading}
          textContent={"Loading..."}
          textStyle={{ color: "#fff" }}
        />
        <Carousel
          ref={(c) => {
            this._carousel = c;
          }}
          layout={"default"}
          data={this.state.topicItems}
          renderItem={this._renderItem}
          sliderWidth={1000}
          itemWidth={350}
        ></Carousel>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    backgroundColor: GLOBAL.COLOR.LIGHTGRAY,
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
});
