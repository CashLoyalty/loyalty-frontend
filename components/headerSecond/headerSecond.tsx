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
        console.error("Failed to fetch token: ", error);
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
    router.navigate("/(routes)/gift");
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
            <Image
              source={require("@/assets/icons/profileHeader2.png")}
              style={styles.icon}
            />
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
            <Image
              source={require("@/assets/icons/wheelIcon.png")}
              style={{ width: 60, height: 60 }}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleGift}>
            <Image
              source={require("@/assets/icons/gift.png")}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNotification}>
            <Image
              source={require("@/assets/icons/notification.png")}
              style={styles.icon}
            />
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
  icon: {
    width: 25,
    height: 25,
    marginHorizontal: 5,
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
});
