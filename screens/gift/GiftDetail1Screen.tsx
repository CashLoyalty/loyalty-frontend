import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { useRoute, useNavigation } from "@react-navigation/native";
import useFetchGiftDetail from "@/hooks/useFetchGiftDetail";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function GiftDetail1Screen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { id } = route.params as { id?: string };
  const [token, setToken] = useState<string>("");
  const navigation = useNavigation();

  console.log("id : ", id);

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
        console.error("Failed to fetch token: ", error);
      }
    };

    fetchToken();
  }, [token]);

  const { data: giftDetail } = useFetchGiftDetail(
    SERVER_URI + "/api/user/gift/history/" + id,
    token
  );

  const handleBackPress = () => {
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar style="dark" backgroundColor="black" />
      <View style={styles.containerSec}>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              source={require("@/assets/icons/back.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Text style={styles.titleText}>
            {" "}
            {giftDetail ? giftDetail.name : ""}
          </Text>
        </View>
        <View style={styles.card}>
          <Image
            source={{ uri: giftDetail?.image1 }}
            style={{ width: 300, height: 300, resizeMode: "contain" }}
          />
        </View>
        <View style={styles.card2}>
          <Text style={styles.qrText}>{giftDetail?.id}</Text>
        </View>
        <Text style={styles.text}>Хэрэглэх заавар</Text>
        <View style={styles.videoContainer}>
          <Image
            source={require("@/assets/icons/play-circle.png")}
            style={styles.playIcon}
            resizeMode="contain"
          />
        </View>
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
    marginLeft: 10,
    fontWeight: "600",
  },
  card: {
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    height: 350,
    marginTop: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  card2: {
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    height: 60,
    marginTop: 10,
    marginHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  qrText: {
    fontSize: 30,
    color: Colors.white,
    fontWeight: "600",
  },
  text: {
    marginTop: 20,
    marginLeft: 10,
    fontSize: 15,
    fontWeight: "600",
  },
  videoContainer: {
    height: 174,
    marginTop: 10,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  playIcon: {
    width: 50,
    height: 50,
  },
});
