import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  FlatList,
  ListRenderItem,
  TouchableOpacity,
} from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import HeaderSecond from "@/components/headerSecond/headerSecond";
import { router } from "expo-router";
const { width, height } = Dimensions.get("window");
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GiftHistoryItem } from "@/types/global";
import useFetchGiftsHistory from "@/hooks/userFetchGiftsHistory";
import { format } from "date-fns";

export default function GiftScreen() {
  const [token, setToken] = useState<string>("");
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        } else {
          console.warn("No token found in AsyncStorage");
        }
      } catch (error) {
        console.log("Failed to fetch token: ", error);
      }
    };

    fetchToken();
  }, [token]);

  const { data: giftHistory } = useFetchGiftsHistory(
    SERVER_URI + "/api/user/gift/history",
    token
  );

  const handleBackPress = () => {
    router.back();
  };

  const renderItem: ListRenderItem<GiftHistoryItem> = ({ item }) => (
    <TouchableOpacity
      style={styles.giftItem}
      onPress={() => handleItemPress(item)}
    >
      <View style={styles.giftRowContainer}>
        <View style={styles.giftImgContainer}>
          <Image source={{ uri: item.giftImage }} style={styles.image} />
        </View>
        <View style={styles.giftInfoContainer}>
          <View>
            <Text style={styles.giftInfoTitle}>{item.giftName}</Text>
            <View style={styles.scoreContainer}>
              <Image
                source={require("@/assets/icons/git-merge.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.white,
                  marginLeft: 10,
                }}
              >
                {item.giftType == "POINT" ? "Point market" : "Азын хүрд"}
              </Text>
            </View>
            <View style={styles.questionContainer}>
              <Image
                source={require("@/assets/icons/clock.png")}
                style={{ width: 16, height: 16 }}
                resizeMode="contain"
              />
              <Text
                style={{
                  fontSize: 12,
                  color: Colors.white,
                  marginLeft: 10,
                }}
              >
                {item.createdAt
                  ? format(new Date(item.createdAt), "yyyy-MM-dd")
                  : "N/A"}{" "}
                хүчинтэй
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  const handleItemPress = (item: GiftHistoryItem) => {
    if (item.giftType === "POINT") {
      router.push(`/giftDetail1?id=${item.id}`);
    } else {
      router.push(`/giftDetail2?id=${item.id}`);
    }
  };
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
          <Text style={styles.titleText}>Бэлэг</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
      {giftHistory && (
        <FlatList
          data={giftHistory}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginHorizontal: 10,
  },
  titleText: {
    fontSize: 20,
    color: "#0E0E96",
    fontWeight: "600",
  },
  giftItem: {
    flex: 1,
    marginHorizontal: 10,
  },
  giftRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  giftImgContainer: {
    zIndex: 2,
    width: (width / 100) * 46,
    height: 126,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    backgroundColor: Colors.white,
    alignContent: "center",
    justifyContent: "center",
  },
  giftInfoContainer: {
    flexDirection: "row",
    width: (width / 100) * 52.2,
    marginLeft: -10,
    height: 120,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    justifyContent: "center",
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
  image: {
    width: (width / 100) * 44.8,
    height: 100,
    resizeMode: "contain",
  },
});
