import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useFetchGiftDetailSpin from "@/hooks/useFetchGiftDetailSpin";
import { SERVER_URI } from "@/utils/uri";
import { format } from "date-fns";
import { UserResponse } from "@/types/global";
import useFetchUser from "@/hooks/useFetchUser";

export default function GiftDetail2Screen() {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const { id } = route.params as { id?: string };
  const [token, setToken] = useState<string>("");
  const [userData, setUserData] = useState<UserResponse | null>(null);

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

  const handleBackPress = () => {
    router.back();
  };

  const { data: giftDetailSpin } = useFetchGiftDetailSpin(
    SERVER_URI + "/api/user/gift/history/" + id,
    token
  );

  const { data } = useFetchUser(SERVER_URI + "/api/user", token);

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor="black" />
      <ExpoStatusBar style="dark" />
      <View style={styles.containerSec}>
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              source={require("@/assets/icons/back.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
          <Text style={styles.titleText}>{giftDetailSpin?.name}</Text>
        </View>
        <View style={styles.card}>
          {/* <Image source={require("@/assets/icons/display2.png")} /> */}
        </View>
        <View style={styles.container2}>
          <View style={styles.row}>
            <Text style={styles.label}>Овог нэр</Text>
            <Text style={styles.rightAligned}>
              {userData?.lastName + " " + userData?.firstName}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Шагналын ID</Text>
            <Text style={styles.rightAligned}>LA20250121</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Шагналын нэр</Text>
            <Text style={styles.rightAligned}>{giftDetailSpin?.name}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Шагналын төрөл</Text>
            <Text style={styles.rightAligned}>Азын хүрд</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Шагналын огноо</Text>
            <Text style={styles.rightAligned}>
              {giftDetailSpin?.historyDate
                ? format(new Date(giftDetailSpin?.historyDate), "yyyy-MM-dd")
                : "N/A"}{" "}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Утас</Text>
            <Text style={styles.rightAligned}>{userData?.phoneNumber}</Text>
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
    marginLeft: 10,
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
    paddingLeft: 10,
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
    flex: 1,
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
