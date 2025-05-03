import React, { useState } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  ListRenderItem,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import HeaderSecond from "@/components/headerSecond/headerSecond";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";
import Story from "@/components/global";

const { width, height } = screenDimensions;

interface AwardItem {
  id: string;
  imgUrl: any;
  awardTitle: string;
  date: string;
  lottery: string;
}

const AwardInfoData: AwardItem[] = [
  {
    id: "1",
    imgUrl: require("@/assets/icons/awardItem1.png"),
    awardTitle: "AirPod MAX Win Big хөтөлбөр",
    date: "2024-07-17",
    lottery: "6 оролцох эрх",
  },
  {
    id: "2",
    imgUrl: require("@/assets/icons/awardItem2.png"),
    awardTitle: "PlayStation 5 Win Big хөтөлбөр",
    date: "2024-08-25",
    lottery: "2 оролцох эрх",
  },
  {
    id: "3",
    imgUrl: require("@/assets/icons/awardItem3.png"),
    awardTitle: "Scooter PRO Win Big хөтөлбөр",
    date: "2024-09-27",
    lottery: "5 оролцох эрх",
  },
];

const products = [
  { id: "1", image: require("@/assets/icons/airСondition.png") },
  { id: "2", image: require("@/assets/icons/phone.png") },
  { id: "3", image: require("@/assets/icons/iwatch.png") },
  { id: "4", image: require("@/assets/icons/headPhone.png") },
];

interface PrizeItem {
  id: string;
  title: string;
  score: number;
  image: any;
}

const prizes: PrizeItem[] = [
  {
    id: "1",
    title: "Burger King 20`000₮ эрхийн бичиг",
    score: 15000,
    image: require("@/assets/icons/bur20.png"),
  },
  {
    id: "2",
    title: "Азын хүрд эргүүлэх",
    score: 15000,
    image: require("@/assets/icons/bur20.png"),
  },
  {
    id: "3",
    title: "Prime Cineplex 20`000₮ эрхийн бичиг",
    score: 20000,
    image: require("@/assets/icons/bur20.png"),
  },
  {
    id: "4",
    title: "PIZZA HUT 15`000 эрхийн бичиг",
    score: 15000,
    image: require("@/assets/icons/bur20.png"),
  },
];

const BottomModal = ({
  visible,
  setVisible,
  item,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  item: PrizeItem | null;
}) => {
  return (
    <Modal
      visible={visible}
      //animationType="slide"
      transparent
      onRequestClose={() => setVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.rowContainer2}>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "600" }}>ТАНД</Text>
            </View>
            <View style={styles.modalScore}>
              <Text
                style={{ fontSize: 15, fontWeight: "600", color: Colors.white }}
              >
                45203
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "600" }}>
                ОНОО БАЙНА
              </Text>
            </View>
          </View>
          <View style={styles.videoContainer}>
            <View style={styles.modalColumncontainer}>
              <View>
                <Image
                  source={require("@/assets/icons/bur2.png")}
                  resizeMode="contain"
                  style={{ width: 300, height: 156 }}
                />
              </View>
              <View>
                <Text style={{ fontSize: 15, fontWeight: "600" }}>
                  Burger King 20`000₮ эрхийн бичиг
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{ fontSize: 12, fontFamily: "800", color: "#808080" }}
                >
                  үлд: 20ш
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.modalColumncontainer2}>
            <View>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "500",
                  alignItems: "flex-start",
                }}
              >
                Дэлгэрэнгүй
              </Text>
            </View>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: "600" }}>
                Та BurgerKing аль ч салбараар 20`000₮ үйлчлүүлэх хөнгөлөлтийн
                эрхийн бичиг
              </Text>
            </View>
          </View>

          <View style={styles.modalTotalScore}>
            <Text style={styles.totalText}>НИЙТ</Text>
            <View style={styles.modalAmount}>
              <Text style={styles.amountText}>40`000</Text>
              <Image source={require("@/assets/icons/plug2.png")} />
            </View>
          </View>
          <View style={styles.countContainer}>
            <TouchableOpacity style={styles.countButton}>
              <Text style={styles.countButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>2</Text>
            <TouchableOpacity style={styles.countButton}>
              <Text style={styles.countButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => setVisible(false)}
            style={styles.closeButton}
          >
            <Text style={styles.buttonText}>Авах</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const Award: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PrizeItem | null>(null);

  const handleBackPress = () => {
    router.navigate("/(tabs)");
  };

  const renderItem: ListRenderItem<AwardItem> = ({ item }) => (
    <View style={styles.awardItem}>
      <View style={styles.awardRowContainer}>
        <View style={styles.awardImgContainer}>
          <Image source={item.imgUrl} />
        </View>
        <View style={styles.awardInfoContainer}>
          <View style={styles.infoSection1} />
          <View style={styles.infoSection2}>
            <Text style={styles.awardInfoTitle}>{item.awardTitle}</Text>
            <View style={styles.dateContainer}>
              <Image source={require("@/assets/icons/date.png")} />
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
            <View style={styles.lotteryContainer}>
              <Image source={require("@/assets/icons/lottery.png")} />
              <Text
                style={{
                  fontSize: 14,
                  color: Colors.primaryColor,
                  marginLeft: 10,
                }}
              >
                {item.lottery}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  const handleItemPress = (item: PrizeItem) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [count, setCount] = useState<number>(0);

  return (
    <View style={styles.container}>
      <Header />
      <HeaderSecond />
      <View style={styles.rowContainer}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              source={require("@/assets/icons/back.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.titleText}>Шагнал</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <View style={styles.container2}>
        <Text style={styles.wheelTitle}>Азын хүрд шагнал</Text>
      </View>
      {/* <View style={styles.container3}>
        <FlatList
          data={products}
          horizontal
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.circle}>
              <Image source={item.image} style={styles.image} />
            </View>
          )}
        />
      </View> */}
      <Story />
      <View style={styles.container2}>
        <Text style={styles.wheelTitle}>Point Market</Text>
      </View>
      <FlatList
        data={prizes}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleItemPress(item)}>
            <View style={styles.prizeContainer}>
              <View style={styles.prizeImgContainer}>
                <Image source={item.image} style={styles.prizeImage} />
              </View>
              <View style={styles.prizeInfoContainer}>
                <Text style={styles.prizeInfoTitle}>{item.title}</Text>
                <View style={styles.prizeScoreContainer}>
                  <Text style={styles.prizeScoreTitle}>{item.score}</Text>
                  <Image
                    source={require("@/assets/icons/plug.png")}
                    style={{ width: 14, height: 16 }}
                  />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <BottomModal
        visible={visible}
        setVisible={setVisible}
        item={selectedItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  container2: {
    marginTop: 10,
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginHorizontal: 10,
  },
  rowContainer2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
    width: 255,
    height: 291,
    opacity: 0.5,
  },
  text: {
    color: "#0E0E96",
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 14,
    opacity: 0.5,
  },
  awardItem: {
    flex: 1,
  },
  awardRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  awardImgContainer: {
    flex: 1,
    zIndex: 2,
  },
  awardInfoContainer: {
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
  awardInfoTitle: {
    textAlign: "left",
    fontSize: 23,
    fontWeight: "600",
    color: Colors.primaryColor,
  },
  videoContainer: {
    width: "100%",
    height: 222,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#E5E4E2",
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
  },
  lotteryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  wheelTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.giftBackgroundColor,
  },
  container3: { padding: 10 },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
  },
  prizeContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  prizeImgContainer: {
    zIndex: 2,
    width: 161,
    height: 103,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignContent: "center",
    justifyContent: "center",
  },
  prizeImage: {
    width: 150,
    height: 70,
    justifyContent: "center",
    alignContent: "center",
  },
  prizeInfoContainer: {
    flexDirection: "column",
    width: 161,
    marginTop: -20,
    height: 100,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    zIndex: 1,
    paddingTop: 10,
  },
  giftInfoTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 20,
  },
  prizeInfoTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.white,
    paddingTop: 20,
    paddingLeft: 10,
  },
  prizeScoreContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 5,
    marginRight: 20,
  },
  prizeScoreTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.white,
    marginTop: 5,
    marginRight: 5,
  },
  row: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  container5: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    backgroundColor: Colors.giftBackgroundColor,
    padding: 10,
    borderRadius: 5,
  },
  modalScore: {
    height: 30,
    backgroundColor: Colors.giftBackgroundColor,
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 25,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: { fontSize: 18, marginBottom: 10 },
  closeButton: {
    backgroundColor: Colors.giftBackgroundColor,
    height: 55,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalColumncontainer: {
    flexDirection: "column",
  },
  modalColumncontainer2: {
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 10,
  },
  modalTotalScore: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 20,
    height: 50,
  },
  totalText: {
    fontSize: 23,
    fontWeight: "600",
    paddingTop: 5,
  },
  amountText: {
    fontSize: 23,
    fontWeight: "600",
    paddingTop: 5,
    paddingRight: 5,
  },
  modalAmount: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    flexShrink: 0,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  countButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#E5E4E2",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  countButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#E5E4E2",
    paddingBottom: 5,
  },
  countText: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
});

export default Award;
