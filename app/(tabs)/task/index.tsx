import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ListRenderItem,
  Modal,
  TextInput,
  Pressable,
} from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import HeaderSecond from "@/components/headerSecond/headerSecond";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";

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
  const [visible, setVisible] = useState(false);
  const [visibleSec, setVisibleSec] = useState(false);

  const handleBackPress = () => {
    router.navigate("/(tabs)");
  };

  const handleItemPress = () => {
    console.log("handleItemPress : 1");
    setVisible(true);
  };

  const handleItemPress2 = () => {
    console.log("handleItemPress : 2");
    setVisibleSec(true);
  };

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
  const StepIndicator = ({ totalSteps = 4, currentStep = 1 }) => {
    return (
      <View style={styles.stepContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <View
              style={[
                styles.circle,
                index < currentStep
                  ? styles.activeCircle
                  : styles.inactiveCircle,
              ]}
            />
            {index < totalSteps - 1 && <View style={styles.line} />}
          </React.Fragment>
        ))}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <Header />
      <HeaderSecond />
      <View style={styles.rowContainer}>
        <TouchableOpacity onPress={handleBackPress}>
          <Image source={require("@/assets/icons/back.png")} />
        </TouchableOpacity>
        <Text style={styles.titleText}>Даалгаврууд</Text>
      </View>
      <TouchableOpacity onPress={() => handleItemPress()}>
        <View style={styles.taskRowContainer}>
          <View style={styles.taskInfoContainer}>
            <View style={{ paddingLeft: 20, marginTop: 10 }}>
              <Text
                style={{ fontSize: 15, fontWeight: "600", color: Colors.white }}
              >
                Найзаа урих
              </Text>
            </View>
            <View style={{ paddingLeft: 20, marginTop: 10 }}>
              <Text style={{ fontSize: 12, color: Colors.white }}>
                Та хайртай хүмүүсээ урьж оноо цуглуулаарай
              </Text>
            </View>
            <StepIndicator currentStep={1} totalSteps={4} />
          </View>
          <View style={styles.taskImgWrapper}>
            <View style={styles.taskImgContainer}>
              <Image
                source={require("@/assets/icons/taskImage1.png")}
                style={{ alignSelf: "center" }}
              />
            </View>
            <View style={styles.overlayView}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.overlayText}>500</Text>
                <Image source={require("@/assets/icons/plug3.png")} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleItemPress2()}>
        <View style={styles.taskRowContainer2}>
          <View style={styles.taskInfoContainer}>
            <View style={{ paddingLeft: 20, marginTop: 10 }}>
              <Text
                style={{ fontSize: 15, fontWeight: "600", color: Colors.white }}
              >
                Pepsi
              </Text>
            </View>
            <View style={{ paddingLeft: 20, marginTop: 10 }}>
              <Text style={{ fontSize: 12, color: Colors.white }}>
                Lipton ice Tea -Pepsi Lime -Pepsi vanila -Pepsi zero 4-ийг
                хэрэглэх
              </Text>
            </View>
            <StepIndicator currentStep={2} totalSteps={4} />
          </View>
          <View style={styles.taskImgWrapper}>
            <View style={styles.taskImgContainer}>
              <Image
                source={require("@/assets/icons/taskImage2.png")}
                style={{ alignSelf: "center" }}
              />
            </View>
            <View style={styles.overlayView}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.overlayText}>500</Text>
                <Image source={require("@/assets/icons/plug3.png")} />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setVisible(false)}
        >
          <Pressable style={styles.modalContainer} onPress={() => {}}>
            <Text style={styles.modalText}>НАЙЗАА УРИХ</Text>
            <Text style={styles.modalTextDtl}>
              Та урих найзынхаа дугаарыг оруулна уу?
            </Text>
            <View style={styles.inputWrapper}>
              <Feather
                style={styles.icon}
                name="phone"
                size={25}
                color="#A0A4B0"
              />
              <View style={styles.verticalLine} />
              <TextInput
                style={styles.input}
                placeholder="Утасны дугаар"
                placeholderTextColor="#A0A4B0"
                keyboardType="numeric"
                // maxLength={requiredLength}
                // value={phoneNumber}
                // onChangeText={(text) => {
                //   if (text.length <= requiredLength) {
                //     setPhoneNumber(text);
                //   }
                // }}
              />
            </View>
            <TouchableOpacity
              onPress={() => setVisible(false)}
              style={styles.sendButton}
            >
              <Text style={styles.buttonText}>илгээх</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
      <Modal
        //animationType="slide"
        transparent
        visible={visibleSec}
        onRequestClose={() => setVisibleSec(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setVisibleSec(false)}
        >
          <Pressable style={styles.bottomSheet} onPress={() => {}}>
            <View style={{ alignItems: "center", marginBottom: 20 }}>
              <Image source={require("@/assets/icons/rectangle.png")} />
            </View>
            <View style={{ alignItems: "center", marginBottom: 10 }}>
              <Image source={require("@/assets/icons/pepsi.png")} />
            </View>
            <Text style={styles.modalTitle}>Pepsi / Илүүд тэмүүл /</Text>
            <Text style={styles.modalDesc}>
              Pepsi Lime, Pepsi Vanila, Pepsi black, Pepsi 4 төрлийн Pepsi
              сонгон хэрэглэж оноогоо цуглуулаарай
            </Text>
            <Text style={styles.modalTitle}>Хамаарагдах бүтээгдэхүүн</Text>
            <Text style={styles.modalDesc}>-Pepsi</Text>
            <Text style={styles.modalDesc}>-Pepsi black</Text>
            <Text style={styles.modalDesc}>-Pepsi Lime</Text>
            <Text style={styles.modalDesc}>-Pepsi Vanila</Text>
            <Text style={styles.modalTitle}>Хөтөлбөрийн хугацаа</Text>
            <View style={{ flexDirection: "row" }}>
              <Text style={styles.modalDescRow}>
                2025.04.12-2025.05.12 дуустал
              </Text>
              <View style={styles.overlayViewSec}>
                <View style={{ flexDirection: "row" }}>
                  <Text style={styles.overlayText}>500</Text>
                  <Image source={require("@/assets/icons/plug3.png")} />
                </View>
              </View>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
      {/* <View style={styles.emptyImageContainer}>
        <Image
          source={require("@/assets/images/emptyTask.png")}
          style={styles.emptyImage}
        />
        <Text style={styles.text}>Даалгавар олдсонгүй</Text>
      </View> */}
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
    fontSize: 20,
    color: "#0E0E96",
    marginLeft: (width / 100) * 23.63,
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "600",
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
  taskInfoContainer: {
    width: (width / 100) * 52.2,
    marginLeft: 10,
    height: 175,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    zIndex: 1,
    paddingTop: 10,
  },
  taskImgWrapper: {
    position: "relative",
  },
  taskImgContainer: {
    zIndex: 2,
    width: (width / 100) * 46,
    height: 185,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    backgroundColor: Colors.white,
    marginLeft: -10,
    alignContent: "center",
    justifyContent: "center",
  },
  overlayView: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 74,
    height: 25,
    backgroundColor: Colors.giftBackgroundColor,
    zIndex: 3,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayViewSec: {
    position: "absolute",
    right: 15,
    width: 74,
    height: 25,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 3,
  },
  taskRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
  },
  taskRowContainer2: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 370,
    height: 230,
    padding: 20,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 25,
    elevation: 10,
  },
  modalText: {
    color: Colors.white,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  modalTextDtl: {
    color: Colors.white,
    marginBottom: 20,
    fontSize: 12,
    fontWeight: "300",
  },
  sendButton: {
    height: 51,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A1A1A1",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  verticalLine: {
    width: 1,
    height: 31,
    backgroundColor: "#A1A1A1",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    width: 393,
    height: 582,
    backgroundColor: Colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 10,
  },
  modalDescRow: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 10,
    paddingTop: 5,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "blue",
    padding: 10,
    marginBottom: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 4,
  },
  activeCircle: {
    backgroundColor: "blue",
    borderColor: "white",
  },
  inactiveCircle: {
    backgroundColor: "white",
    borderColor: "blue",
  },
  line: {
    height: 4,
    flex: 1,
    backgroundColor: "white",
  },
});

export default Task;
