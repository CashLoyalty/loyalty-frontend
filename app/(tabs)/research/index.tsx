import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ListRenderItem,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import HeaderSecond from "@/components/headerSecond/headerSecond";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";

const { width, height } = screenDimensions;

interface ResearchItem {
  id: string;
  imgUrl: any;
  researchTitle: string;
  score: string;
  question: string;
}

const ResearchInfoData: ResearchItem[] = [
  {
    id: "1",
    imgUrl: require("@/assets/icons/researchItem1.png"),
    researchTitle: "Lipton Tea",
    score: "+150 оноо",
    question: "6 асуулт",
  },
  {
    id: "2",
    imgUrl: require("@/assets/icons/researchItem2.png"),
    researchTitle: "Pepsi Black",
    score: "+210 оноо",
    question: "2 асуулт",
  },
  {
    id: "3",
    imgUrl: require("@/assets/icons/researchItem3.png"),
    researchTitle: "Pepsi Vanilla",
    score: "+100 оноо",
    question: "5 асуулт",
  },
];

const Research: React.FC = () => {
  const handlejump = () => {
    router.push("/questions");
  };
  const renderItem: ListRenderItem<ResearchItem> = ({ item }) => (
    <View style={styles.researchItem}>
      <View style={styles.researchRowContainer}>
        <View style={styles.researchImgContainer}>
          <Image
            source={item.imgUrl}
            style={{
              width: 155,
              height: 156,
              borderWidth: 1,
              borderColor: Colors.primaryColor,
              borderRadius: 10,
            }}
          />
        </View>
        <View style={styles.researchInfoContainer}>
          <View style={styles.infoSection1} />
          <View style={styles.infoSection2}>
            <Text style={styles.researchInfoTitle}>{item.researchTitle}</Text>
            <View style={styles.scoureContainer}>
              <Image
                source={require("@/assets/icons/score.png")}
                style={{ width: 23, height: 23 }}
              />
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.primaryColor,
                  marginLeft: 10,
                }}
              >
                {item.score}
              </Text>
            </View>
            <View style={styles.questionContainer}>
              <Image source={require("@/assets/icons/questionIcon.png")} />
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.primaryColor,
                  marginLeft: 10,
                }}
              >
                {item.question}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Header />
      <HeaderSecond />
      <View style={styles.cardContainer}>
        <TouchableOpacity onPress={handlejump} style={styles.card}>
          <View style={styles.cardMini}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={styles.cardText}>хэрэглээний судалгаа </Text>
            </View>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  backgroundColor: "#0025FF",
                  flex: 1,
                  flexDirection: "row",
                  borderRadius: 15,
                  maxHeight: 30,
                  maxWidth: 80,
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                  padding: 8,
                }}
              >
                <Text style={{ color: "#ffffff" }}>1500</Text>
                <Image
                  style={{ width: 20, height: 17 }}
                  source={require("@/assets/icons/coin.png")}
                ></Image>
              </View>
              <Text style={{ color: "#4B5563" }}>3-5min</Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.rowContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Судалгаанууд</Text>
        </View>
      </View>
      <View style={styles.emptyImageContainer}>
        <Image
          source={require("@/assets/images/emptyResearch.png")}
          style={styles.emptyImage}
        />
        <Text style={styles.text}>Судалгаа олдсонгүй</Text>
      </View> */}
      {/*<FlatList
          data={ResearchInfoData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  cardText: {
    fontSize: 14,
    color: "#0025FF",
    fontWeight: 600,
    marginTop: 10,
  },
  card: {
    backgroundColor: "#0025FF",
    maxWidth: 160,
    height: 167,
    borderRadius: 12,
    flex: 1,
    justifyContent: "flex-end",
  },
  cardMini: {
    padding: 14,
    backgroundColor: "#FFFFFF",
    width: 160,
    height: 140,
    borderRadius: 12,
  },
  cardContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    color: Colors.primaryColor,
    fontSize: 20,
    fontFamily: "Inter",
  },
  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyImage: {
    //width: width / 100 * 65,
    //height: height / 100 * 41,
    width: 224,
    height: 222,
    opacity: 0.5,
  },
  text: {
    color: "#0E0E96",
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 14,
    opacity: 0.5,
  },
  researchItem: {
    flex: 1,
  },
  researchRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  researchImgContainer: {
    flex: 1,
    zIndex: 2,
  },
  researchInfoContainer: {
    flexDirection: "row",
    width: "100%",
    height: 150,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    justifyContent: "center",
    zIndex: 1,
    padding: 10,
  },
  infoSection1: {
    flex: 4,
    backgroundColor: Colors.white,
  },
  infoSection2: {
    flex: 5,
    backgroundColor: Colors.white,
  },
  researchInfoTitle: {
    textAlign: "left",
    fontSize: 23,
    fontWeight: "600",
    color: Colors.primaryColor,
  },
  scoureContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default Research;
