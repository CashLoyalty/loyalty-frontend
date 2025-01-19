import React from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  FlatList,
  ListRenderItem,
} from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import HeaderSecond from "@/components/headerSecond/headerSecond";
import { screenDimensions } from "@/constants/constans";

const { width, height } = screenDimensions;

interface TaskItem {
  id: string;
  imgUrl: any;
  taskTitle: string;
  score: string;
  date: string;
}

const TaskInfoData: TaskItem[] = [
  {
    id: "1",
    imgUrl: require("@/assets/icons/taskItem1.png"),
    taskTitle: "Найзаар урих",
    score: "+300",
    date: "2024-07-17",
  },
  {
    id: "2",
    imgUrl: require("@/assets/icons/taskItem2.png"),
    taskTitle: "Хүслийн жагсаалт",
    score: "+200",
    date: "2024-08-25",
  },
  {
    id: "3",
    imgUrl: require("@/assets/icons/taskItem1.png"),
    taskTitle: "Найзаар урих",
    score: "+100",
    date: "2024-09-27",
  },
];

const Task: React.FC = () => {
  const RenderItem: ListRenderItem<TaskItem> = ({ item }) => (
    <View>
      <View style={styles.taskItem}>
        <View>
          <Image source={item.imgUrl} />
        </View>
        <View style={styles.taskInfo}>
          <View>
            <Text style={styles.taskTitleStyle}>{item.taskTitle}</Text>
          </View>
          <View style={styles.taskScoreRowContainer}>
            <Image
              source={require("@/assets/icons/score.png")}
              style={{ width: 23, height: 23 }}
            ></Image>
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
          <View style={styles.taskDateRowContainer}>
            <Image
              source={require("@/assets/icons/date.png")}
              style={{ width: 23, height: 23 }}
            ></Image>
            <Text
              style={{
                fontSize: 14,
                color: Colors.primaryColor,
                marginLeft: 10,
              }}
            >
              {item.date}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <Header />
      <HeaderSecond />
      <View style={styles.rowContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Даалгаврууд</Text>
        </View>
      </View>
      <View style={styles.emptyImageContainer}>
        <Image
          source={require("@/assets/images/emptyTask.png")}
          style={styles.emptyImage}
        />
        <Text style={styles.text}>Даалгавар олдсонгүй</Text>
      </View>
      {/*<View style={styles.flatListContainer}>
          <FlatList
            numColumns={2}
            data={TaskInfoData}
            renderItem={RenderItem}
            keyExtractor={(item) => item.id}
          />
        </View>*/}
    </View>
  );
};

const styles = StyleSheet.create({
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
    //width: width / 100 * 62.5,
    //height: height / 100 * 41,
    width: 261,
    height: 233,
    opacity: 0.5,
  },
  text: {
    color: "#0E0E96",
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 14,
    opacity: 0.5,
  },
  taskItem: {
    width: 177,
    height: 296,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    margin: 8,
    borderRadius: 10,
  },
  flatListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskScoreRowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 5,
  },
  taskInfo: {
    padding: 10,
  },
  taskDateRowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  taskTitleStyle: {
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Task;
