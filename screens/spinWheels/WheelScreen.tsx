import React, { useRef, useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Animated, ActivityIndicator } from "react-native";
import { SERVER_URI } from "@/utils/uri";
import axios from "axios";
import Colors from "@/constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useToast } from "react-native-toast-notifications";

type PrizeDetails = {
  prizeName: string;
  deg: number;
};

export default function WheelScreen() {
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);
  const [prizeImage, setPrizeImage] = useState<string>("");
  const [prize, setPrize] = useState<string>("");
  const [lottoCount, setLottoCount] = useState<number>(0);
  const [token, setToken] = useState<string>("");
  const circleRef = useRef<any>(null);
  const spinValue = useRef(new Animated.Value(0)).current;
  const toast = useToast();

  const getPrizeDetails = (giftName: string): PrizeDetails => {
    const prizeData = new Map<string, PrizeDetails>([
      ["THANK YOU", { prizeName: "Баярлалаа дахин оролдоно уу.", deg: 1313 }],
      ["IPHONE 16 PRO MAX", { prizeName: "iPhone 16 Pro Max", deg: 1349 }],
      ["AIRPODS MAX", { prizeName: "AirPods Max", deg: 1278 }],
      ["PEPSI 3 MONTHS OF USE", { prizeName: "PEPSI 3 САРЫН ХЭРЭГЛЭЭ", deg: 1242 }],
      ["AIR PURIFIER", { prizeName: "АГААР ЦЭВЭРШҮҮЛЭГЧ", deg: 1206 }],
      ["SMART TV", { prizeName: "Ухаалаг зурагт", deg: 1170 }],
      ["MARSHALL SPEAKER", { prizeName: "MARSHALL SPEAKER", deg: 1134 }],
      ["PEPSI 1 MONTHS OF USE", { prizeName: "PEPSI 1 САРЫН ХЭРЭГЛЭЭ", deg: 1459 }],
      ["DYSON V15", { prizeName: "Dyson V15", deg: 1421 }],
      ["APPLE WATCH", { prizeName: "Apple Watch", deg: 1385 }],
    ]);
    return (
      prizeData.get(giftName) || {
        prizeName: "Баярлалаа дахин оролдоно уу.",
        deg: 1313,
      }
    );
  };

  const checkLotto = async (): Promise<void> => {
    try {
      const access_token = await AsyncStorage.getItem("token");
      if (!access_token) {
        console.log("Access token not found");
        return;
      }
      const response = await axios.get(`${SERVER_URI}/api/user`, {
        headers: { Authorization: `Bearer ${access_token}` },
      });
      const lottoCount = response.data.response.lottoCount;
      setLottoCount(lottoCount);
    } catch (error) {
      console.error("Error fetching lotto data:", error);
    }
  };

  checkLotto();

  const handleSpin = async (): Promise<void> => {
    if (isSpinning) return;

    setLoader(true);
    setIsSpinning(true);

    const access_token = await AsyncStorage.getItem("token");

    if (access_token) {
      try {
        if (lottoCount === 0) {
          toast.show("Таньд хүрд эргүүлэх эрх байхгүй байна.", {
            type: "danger",
            placement: "top",
          });
          setLoader(false);
          setIsSpinning(false);
          return;
        } else if (lottoCount > 0) {
          const spinResponse = await axios.post(
            `${SERVER_URI}/api/user/spin`,
            {},
            { headers: { Authorization: `Bearer ${access_token}` } }
          );
          console.log(spinResponse);
          if (spinResponse && spinResponse.data && spinResponse.data.response) {
            const giftName = spinResponse.data.response.name;
            const prizeDetails = getPrizeDetails(giftName);
            const prizeDeg = prizeDetails.deg;

            spinValue.setValue(0);

            Animated.timing(spinValue, {
              toValue: 360 + prizeDeg,
              duration: 4500,
              useNativeDriver: true,
            }).start();

            setPrize(prizeDetails.prizeName);
            setPrizeImage(spinResponse.data.response.image);

            setTimeout(() => {
              setIsSpinning(false);
              setModal(true);
            }, 5000);
          } else {
            throw new Error("Invalid response from server");
          }
        }
        setLoader(false);
      } catch (error: any) {
        setIsSpinning(false);
        setLoader(false);
        if (error.message === "Invalid response from server") {
          toast.show("Таньд хүрд эргүүлэх эрх байхгүй байна.", {
            type: "danger",
            placement: "top",
          });
        } else {
          toast.show("Алдаа гарлаа. Дахин оролдож үзнэ үү.", {
            type: "danger",
            placement: "top",
          });
        }
      }
    } else {
      setLoader(false);
      toast.show("Та эхлээд нэвтэрнэ үү.", {
        type: "danger",
        placement: "top",
      });
    }
  };

  const handleModalClose = () => {
    setModal(false);
    setPrize("");
    setPrizeImage("");
    spinValue.setValue(0);
  };

  const handleProfile = () => {
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={{ color: "white", position: "absolute", top: 70, right: 30 }} onPress={handleProfile}>
        Хаах
      </Text>
      <View>
        <TouchableOpacity onPress={handleSpin} disabled={isSpinning}>
          <View style={styles.containersmall}>
            <Image source={require("@/assets/loyalty/zuun.png")} style={styles.choket} />
            <Image source={require("@/assets/loyalty/baruun.png")} style={styles.choket} />
          </View>
          <Image source={require("@/assets/loyalty/bg.png")} style={styles.bg} />
          <Image source={require("@/assets/loyalty/red.png")} style={styles.red} />
          <Animated.Image
            source={require("@/assets/loyalty/spin.png")}
            style={[
              styles.spin,
              {
                transform: [
                  {
                    rotate: spinValue.interpolate({
                      inputRange: [0, 360],
                      outputRange: ["0deg", "360deg"],
                    }),
                  },
                ],
              },
            ]}
          />
        </TouchableOpacity>
        <Text style={styles.lotto}>Таньд {lottoCount} хүрд эргүүлэх эрх байна.</Text>
      </View>
      <Modal transparent={true} animationType="fade" visible={modal} onRequestClose={() => setModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalPrize}>{prize}</Text>
            {prizeImage && <Image source={{ uri: prizeImage }} style={styles.prizeImage} />}
            <TouchableOpacity onPress={handleModalClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Хаах</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.black,
    paddingHorizontal: 20,
  },
  bg: { width: 500, height: 500, position: "relative", resizeMode: "contain" },
  red: {
    width: 25,
    height: 25,
    position: "absolute",
    top: "17%",
    left: "50%",
    marginLeft: -12,
    marginTop: -12,
  },
  containersmall: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    top: 0,
    left: -45,
    zIndex: 1,
  },
  choket: {
    width: 340,
    height: 500,
  },
  spin: {
    width: 300,
    height: 300,
    position: "absolute",
    zIndex: 10,
    top: "20%",
    left: "20%",
    transform: [{ translateX: -150 }, { translateY: -150 }],
  },
  lotto: {
    color: "#ffffff",
    position: "absolute",
    top: 415,
    left: "50%",
    transform: [{ translateX: -50 }],
  },
  
  errorText: { color: "white", textAlign: "center", marginVertical: 10 },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "80%",
    maxWidth: 300,
  },
  modalTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  modalPrize: { fontSize: 18, marginVertical: 10, color: Colors.black },
  prizeImage: {
    width: 100,
    height: 100,
    marginVertical: 10,
    resizeMode: "contain",
  },
  closeButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "rgb(59 130 246)",
    borderRadius: 5,
  },
  closeButtonText: { color: "white", fontSize: 16 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
});
