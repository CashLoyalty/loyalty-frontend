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
  ScrollView,
} from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import HeaderSecond from "@/components/headerSecond/headerSecond";
import { router } from "expo-router";
const { width } = Dimensions.get("window");
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GiftHistoryItem } from "@/types/global";
import { format } from "date-fns";
import axios from "axios";

export default function GiftScreen() {
  const [token, setToken] = useState<string>("");
  const [giftHistory, setGiftHistory] = useState<GiftHistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  const getGiftHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(`${SERVER_URI}/api/user/gift/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("history response: PKOMP ", response.data);

      if (response.data.code === 0) {
        const filteredData = response.data.response.filter(
          (item: GiftHistoryItem) => item.giftName !== "THANK YOU"
        );

        // Sort by date (latest first)
        const sortedData = filteredData.sort(
          (a: GiftHistoryItem, b: GiftHistoryItem) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA; // Descending order (newest first)
          }
        );

        setGiftHistory(sortedData);
      } else {
        setError(response.data.title || "API returned error");
      }
    } catch (error) {
      console.log("Failed to fetch gift history: ", error);
      setError("Failed to fetch gift history");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (token) {
      getGiftHistory();
    }
  }, [token]);

  const handleBackPress = () => {
    router.back();
  };

  const renderItem: ListRenderItem<GiftHistoryItem> = ({ item }) => {
    const isPoint = item.giftType === "POINT";
    const isSpin = item.giftType === "SPIN";

    return (
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
                  {isPoint
                    ? "Point market"
                    : isSpin
                    ? "Азын хүрд"
                    : "Point market"}
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
  };
  const handleItemPress = (item: GiftHistoryItem) => {
    router.push(`/giftDetail?id=${item.id}`);
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
      <ScrollView style={styles.scrollContainer}>
        {giftHistory.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.giftCard}
            onPress={() => handleItemPress(item)}
          >
            <View style={styles.cardRowContainer}>
              <View style={styles.imageSection}>
                <Image
                  source={{ uri: item.giftImage }}
                  style={styles.cardImage}
                />
              </View>
              <View style={styles.infoSection}>
                <Text style={styles.giftTitle}>{item.giftName}</Text>
                <View style={styles.iconRow}>
                  <Image
                    source={require("@/assets/icons/git-merge.png")}
                    style={styles.icon}
                  />
                  <Text style={styles.iconText}>
                    {item.giftType === "POINT"
                      ? "Point market"
                      : item.giftType === "SPIN"
                      ? "Азын хүрд"
                      : "Point market"}
                  </Text>
                </View>
                <View style={styles.iconRow}>
                  <Image
                    source={require("@/assets/icons/clock.png")}
                    style={styles.icon}
                  />
                  <Text style={styles.iconText}>2026.01.23 хүчинтэй</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: Colors.black,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: Colors.black,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingTop: 20,
  },
  giftCard: {
    marginBottom: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    overflow: "hidden",
    backgroundColor: Colors.white,
  },
  cardRowContainer: {
    flexDirection: "row",
    height: 120,
  },
  imageSection: {
    width: "50%",
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "contain",
  },
  infoSection: {
    width: "50%",
    backgroundColor: Colors.primaryColor,
    padding: 15,
    justifyContent: "center",
  },
  cardImage: {
    width: "100%",
    height: "100%",
  },
  giftTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 8,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  iconText: {
    fontSize: 12,
    color: Colors.white,
  },
});
