import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
const { width, height } = Dimensions.get("window");
import Colors from "@/constants/Colors";
import { router } from "expo-router";

export default function GiftDetail2Screen() {
  const insets = useSafeAreaInsets();
  const handleBackPress = () => {
    router.navigate("/(routes)/gift");
  };
  const prizeData = {
    lastName: "Хүрэлбаатар Мөнх-Эрдэнэ",
    prizeID: "LA20250121",
    prizeName: "55 inch ухаалаг зурагт OLED",
    prizeType: "Азын хүрд",
    prizeDate: "2025-02-15",
    phone: "89880213",
  };
  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="black" />
      <ExpoStatusBar style="dark" />
      <View style={styles.containerSec}>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image source={require("@/assets/icons/back.png")} />
          </TouchableOpacity>
          <Text style={styles.titleText}>55 inch ухаалаг зурагт OLED</Text>
        </View>
        <View style={styles.card}>
          <Image source={require("@/assets/icons/display2.png")} />
        </View>
        <View style={styles.container2}>
          <View style={styles.row}>
            <Text style={styles.label}>Овог нэр</Text>
            <Text style={styles.rightAligned}>{prizeData.lastName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Шагналын ID</Text>
            <Text style={styles.rightAligned}>{prizeData.prizeID}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Шагналын нэр</Text>
            <Text style={styles.rightAligned}>{prizeData.prizeName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Шагналын төрөл</Text>
            <Text style={styles.rightAligned}>{prizeData.prizeType}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Шагналын огноо</Text>
            <Text style={styles.rightAligned}>{prizeData.prizeDate}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Утас</Text>
            <Text style={styles.rightAligned}>{prizeData.phone}</Text>
          </View>
        </View>
        <View style={styles.container3}>
          <Text numberOfLines={4}>
            Та бэлэгээ төв оффис дээр хүрэлцэн ирж авна уу. Ирэхдээ өөрийн бичиг
            баримттайгаа ирээрэй таньд амжилт хүсье. Холбоо барих дугаар 7575
            0000, 89829933
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.handleBackPress}
        >
          <Text style={styles.backBtnText}>БУЦАХ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  containerSec: {
    flex: 1,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginLeft: 10,
  },
  titleText: {
    fontSize: 16,
    color: Colors.black,
    marginLeft: 20,
    fontWeight: "600",
  },
  backBtnText: {
    fontSize: 14,
    color: Colors.white,
    fontWeight: "600",
  },
  card: {
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    height: 250,
    marginTop: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
  },
  container2: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginTop: 10,
    marginHorizontal: 10,
    padding: 20,
    borderRadius: 10,
  },
  container3: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 10,
    height: 88,
  },
  card2: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
    backgroundColor: Colors.white,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
    color: "#333",
  },
  detail: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 5,
    color: Colors.black,
  },
  label: {
    fontWeight: "600",
    fontSize: 12,
    color: Colors.prizeLabelColor,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  rightAligned: {
    textAlign: "right",
    fontWeight: "600",
    fontSize: 12,
    flex: 1, // Ensures the text takes the available space
  },
  handleBackPress: {
    height: 50,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 10,
  },
});
