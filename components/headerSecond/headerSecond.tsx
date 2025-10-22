import React, { useEffect, useState } from "react";
import { View, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserResponse } from "@/types/global";
import useFetchUser from "@/hooks/useFetchUser";
import { SERVER_URI } from "@/utils/uri";

export default function HeaderSecond() {
  const [token, setToken] = useState<string>("");
  const [userData, setUserData] = useState<UserResponse | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.log("Failed to fetch token: ", error);
      }
    };

    fetchToken();
  }, []);

  const { data } = useFetchUser(`${SERVER_URI}/api/user`, token);

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  const handleProfile = () => {
    router.push("/(routes)/profile");
  };

  const handleGift = () => {
    // router.navigate("/(routes)/gift");
    router.navigate("/(routes)/giftHistory");
  };

  const handleWheel = () => {
    router.navigate("/(routes)/spinWheels");
  };
  const handleNotification = () => {
    router.navigate("/(routes)/notif");
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={styles.section1}>
          <TouchableOpacity onPress={handleProfile}>
            <View style={styles.iconBackground}>
              <Image
                source={require("@/assets/icons/profileHeader2.png")}
                style={styles.iconImage}
              />
            </View>
          </TouchableOpacity>

          <View style={styles.column}>
            <View style={styles.row}>
              <Text style={styles.helloTextStyle}>Сайн байна уу</Text>
              <Image
                source={require("@/assets/icons/hello.png")}
                style={{ width: 15, height: 15 }}
              />
            </View>
            <Text style={styles.userTextStyle}>
              {userData?.phoneNumber || ""}
            </Text>
          </View>
        </View>
        <View style={styles.section2}>
          <TouchableOpacity onPress={handleWheel}>
            <View style={styles.iconBackground}>
              <Image
                source={require("@/assets/icons/spinWheel.png")}
                style={styles.iconImage}
              />
              {/* <View style={styles.redDot} /> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleGift}>
            <View style={styles.iconBackground}>
              <Image
                source={require("@/assets/icons/gift.png")}
                style={styles.iconImage}
              />
              {/* <View style={styles.redDot} /> */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNotification}>
            <View style={styles.iconBackground}>
              <Image
                source={require("@/assets/icons/notification.png")}
                style={styles.iconImage}
              />
              {/* <View style={styles.redDot} /> */}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    height: 50,
    marginTop: 15,
    marginHorizontal: 10,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  section1: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    justifyContent: "flex-start",
  },
  section2: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  helloTextStyle: {
    fontWeight: "600",
    fontSize: 13,
  },
  userTextStyle: {
    fontWeight: "600",
    color: Colors.primaryColor,
    fontSize: 13,
  },
  iconBackground: {
    width: 35,
    height: 35,
    borderRadius: 20,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    position: "relative",
  },
  iconImage: {
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  column: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  redDot: {
    position: "absolute",
    top: 1,
    right: 1,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ff0000",
    borderWidth: 1,
    borderColor: "#ffffff",
  },
});
