import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Platform,
  Alert,
  StatusBar,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { SERVER_URI } from "@/utils/uri";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { screenDimensions } from "@/constants/constans";
import { useContext } from "react";
import { GlobalContext } from "@/components/globalContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { getDeviceToken } from "@/utils/notificationService";
import * as Updates from "expo-updates";

const { height, width } = screenDimensions;

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [showTokenModal, setShowTokenModal] = useState<boolean>(false);
  const [modalTokenValue, setModalTokenValue] = useState<string>("");
  const [checkingUpdate, setCheckingUpdate] = useState<boolean>(true);
  const [downloadingUpdate, setDownloadingUpdate] = useState<boolean>(false);
  const [updateMessage, setUpdateMessage] = useState<string>("");
  const [updateReady, setUpdateReady] = useState<boolean>(false);
  const requiredLength = 8;
  const toast = useToast();
  const { toastHeight } = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      const token = await getDeviceToken();
      if (token) {
        setExpoPushToken(token);
      }
    })();
  }, []);

  // EAS Update шалгалт
  useEffect(() => {
    checkForUpdates();
  }, []);

  const checkForUpdates = async () => {
    try {
      setCheckingUpdate(true);

      // Зөвхөн production build дээр update шалгах
      if (!Updates.isEnabled) {
        setCheckingUpdate(false);
        return;
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateMessage("Шинэ хувилбар Татаж байна...");
        setDownloadingUpdate(true);

        // Update татах
        await Updates.fetchUpdateAsync();

        setUpdateMessage("Шинэ хувилбар татагдлаа. Шинэчлэж байна...");
        setUpdateReady(true);

        toast.show("Шинэ хувилбар татагдлаа. Шинэчлэж байна...", {
          type: "success",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
          style: {
            top: toastHeight,
          },
        });

        // Update шууд ашиглах - app reload хийх
        setTimeout(() => {
          Updates.reloadAsync();
        }, 1500);
      } else {
        setUpdateMessage("");
        setCheckingUpdate(false);
      }
    } catch (error) {
      console.log("Update шалгах явцад алдаа гарлаа:", error);
      setUpdateMessage("");
    } finally {
      setCheckingUpdate(false);
    }
  };

  useEffect(() => {
    if (phoneNumber.length === requiredLength) {
      Keyboard.dismiss();
    }
  }, [phoneNumber]);

  const handleForgetPinCode = async () => {
    const verifiedPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");

    if (verifiedPhoneNumber.length === 0) {
      toast.show(`Утасны дугаар оруулна уу...`, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: {
          top: toastHeight,
        },
      });
      return;
    }

    if (verifiedPhoneNumber.length !== requiredLength) {
      toast.show(`Утасны дугаар буруу...`, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: {
          top: toastHeight,
        },
      });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${SERVER_URI}/api/user/getForgotPasscodeOtp`,
        {
          phoneNumber: verifiedPhoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data.code === 0) {
        router.push(
          `/verifyOtp?phoneNumber=${encodeURIComponent(
            verifiedPhoneNumber
          )}&screenName=${encodeURIComponent("forgotPinCode")}`
        );
      }
      /*if (data.title === "Success") {
        router.push(
          `/verifyOtp?phoneNumber=${encodeURIComponent(verifiedPhoneNumber)}`
        );
      } else if (data.title === "Phone number Duplicated") {
        router.push(
          `/loginPinCode?phoneNumber=${encodeURIComponent(verifiedPhoneNumber)}`
        );
      } else {
        toast.show(`Алдаа: ${data.title}`, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
                  style: {
          top: toastHeight,
        },
        });
      }*/
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.show(
          `Алдаа гарлаа (axios): ${
            error.response?.data?.message || error.message
          }`,
          {
            type: "danger",
            placement: "top",
            duration: 1500,
            animationType: "slide-in",
            style: {
              top: toastHeight,
            },
          }
        );
      } else {
        toast.show(`Алдаа гарлаа: ${String(error)}`, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
          style: {
            top: toastHeight,
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    // Update татаж байгаа бол login хийхийг хориглох
    if (downloadingUpdate) {
      toast.show("Шинэ хувилбар татаж байна. Түр хүлээнэ үү...", {
        type: "info",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
        style: {
          top: toastHeight,
        },
      });
      return;
    }

    const verifiedPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");

    if (verifiedPhoneNumber.length === 0) {
      toast.show(`Утасны дугаар оруулна уу...`, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: {
          top: toastHeight,
        },
      });
      return;
    }

    if (verifiedPhoneNumber.length !== requiredLength) {
      toast.show(`Утасны дугаар буруу...`, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: {
          top: toastHeight,
        },
      });
      return;
    }

    setLoading(true);

    try {
      const storedExpoToken = await AsyncStorage.getItem("expoPushToken");
      setModalTokenValue(storedExpoToken || "");
      setShowTokenModal(true);

      const response = await axios.post(
        `${SERVER_URI}/api/user/getOtp`,
        {
          phoneNumber: verifiedPhoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;

      if (data.title === "Success") {
        router.push(
          `/verifyOtp?phoneNumber=${encodeURIComponent(verifiedPhoneNumber)}`
        );
      } else if (data.title === "Phone number Duplicated") {
        router.push(
          `/loginPinCode?phoneNumber=${encodeURIComponent(verifiedPhoneNumber)}`
        );
      } else {
        toast.show(`Алдаа: ${data.title}`, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
          style: {
            top: toastHeight,
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.show(
          `Алдаа гарлаа (axios): ${
            error.response?.data?.message || error.message
          }`,
          {
            type: "danger",
            placement: "top",
            duration: 1500,
            animationType: "slide-in",
            style: {
              top: toastHeight,
            },
          }
        );
      } else {
        toast.show(`Алдаа гарлаа: ${String(error)}`, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
          style: {
            top: toastHeight,
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuestLogin = async () => {
    const response = await axios.post(`${SERVER_URI}/api/user/login`, {
      phoneNumber: "60101215",
      passCode: "0000",
    });
    if (response.data.code === 0) {
      const accessToken = response.data.response.access_token;
      router.push("/(tabs)");
    } else {
      if (response.data.title === "Passcode is wrong!") {
        toast.show("Пин код буруу", {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
          style: {
            top: toastHeight,
          },
        });
      } else {
        toast.show(response.data.title, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
          style: {
            top: toastHeight,
          },
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.snowContainer}>
        <Image
          style={styles.snowImage}
          source={require("@/assets/newYear/snow.png")}
        />
      </View>
      {Platform.OS === "android" && (
        <View
          style={{
            height: StatusBar.currentHeight,
            backgroundColor: Colors.black,
          }}
        />
      )}
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.topLeftContainer}>
        <Image
          style={styles.topLeft}
          source={require("@/assets/newYear/topLeft.png")}
        />
        <Image
          style={styles.lightLeft}
          source={require("@/assets/newYear/lightLeft.png")}
        />
      </View>
      <View
        style={{
          marginTop: (height / 100) * 13.7,
          marginBottom: (height / 100) * 5.7,
        }}
      >
        <Image
          style={styles.loginImage}
          source={require("@/assets/images/icon.png")}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.labelText}>Утасны дугаар</Text>
        <View style={styles.inputWrapper}>
          <Feather style={styles.icon} name="phone" size={25} color="#A0A4B0" />
          <View style={styles.verticalLine} />
          <TextInput
            style={styles.input}
            placeholder="Утасны дугаар"
            placeholderTextColor="#A0A4B0"
            keyboardType="numeric"
            maxLength={requiredLength}
            value={phoneNumber}
            onChangeText={(text) => {
              if (text.length <= requiredLength) {
                setPhoneNumber(text);
              }
            }}
          />
        </View>
        <TouchableOpacity
          style={[
            styles.button,
            (downloadingUpdate || checkingUpdate) && styles.buttonDisabled,
          ]}
          onPress={handleLogin}
          disabled={downloadingUpdate || checkingUpdate}
        >
          <Text style={styles.buttonSignText}>
            {downloadingUpdate
              ? "Татаж байна..."
              : checkingUpdate
              ? "Шалгаж байна..."
              : "Нэвтрэх"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgetPinCode}>
          <Text style={styles.underlineText}>Пин код сэргээх</Text>
        </TouchableOpacity>
        {(downloadingUpdate || checkingUpdate) && (
          <View style={styles.updateMessageContainer}>
            <ActivityIndicator size="small" color={Colors.primaryColor} />
            <Text style={styles.updateMessageTextInline}>
              {downloadingUpdate
                ? "Шинэ хувилбар татаж байна..."
                : "Хувилбар шалгаж байна..."}
            </Text>
          </View>
        )}
      </View>
      <View
        style={[
          styles.BotContainer,
          { bottom: Platform.OS === "ios" ? 15 : 50 },
        ]}
      >
        <Image
          style={styles.leftBot}
          source={require("@/assets/newYear/leftBot.png")}
        />
        <View>
          <View style={styles.midTextContainer}>
            <Image
              style={styles.midText}
              source={require("@/assets/newYear/midText.png")}
            />
          </View>
          <View style={styles.botTextContainer}>
            <Image
              style={styles.botText}
              source={require("@/assets/newYear/botText.png")}
            />
          </View>
        </View>
        <Image
          style={styles.rightBot}
          source={require("@/assets/newYear/rightBot.png")}
        />
      </View>
      {loading && (
        <View style={styles.loaderContainer}>
          <BlurView intensity={0} style={styles.loaderBackground} tint="dark" />
          <Image
            source={require("@/assets/images/loading2.gif")}
            style={styles.loaderImage}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

async function registerForPushNotificationsAsync(): Promise<
  string | undefined
> {
  const isSimulator = !Device.isDevice;

  // Android simulator doesn't support push tokens
  if (isSimulator && Platform.OS === "android") {
    Alert.alert(
      "Push мэдэгдэл зөвхөн бодит төхөөрөмж эсвэл iOS simulator дээр ажиллана."
    );
    return;
  }

  // iOS simulator can get test token
  if (isSimulator) {
    console.log("🔔 iOS simulator дээр test token авах гэж байна...");
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert("Push мэдэгдлийн зөвшөөрөл олгогдоогүй.");
    return;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync();

  if (isSimulator && tokenData?.data) {
    console.log("🔔 ⚠️ Simulator test token:", tokenData.data);
    console.log(
      "🔔 ⚠️ Жинхэнэ push мэдэгдэл ажиллахгүй, зөвхөн тест хийхэд ашиглана уу"
    );
  }

  return tokenData.data;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
    alignItems: "center",
  },
  loginImage: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 20,
  },
  inputContainer: {
    width: "100%",
    alignItems: "center",
  },
  labelText: {
    width: "90%",
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter",
    marginBottom: 10,
  },
  inputWrapper: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
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
  button: {
    height: 51,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    marginTop: 20,
    width: "90%",
  },
  buttonSignText: {
    color: "#EFF6FF",
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Inter",
  },
  footer: {
    marginTop: (height / 100) * 23,
    alignItems: "center",
  },
  footerText: {
    color: "#EFF6FF",
    fontSize: 16,
  },
  loaderContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loaderBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.black,
    opacity: 1,
  },
  loaderImage: {
    width: 300,
    height: 300,
    transform: [{ scale: 1.2 }],
  },
  notificationBanner: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
    zIndex: 2000,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  notificationTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  notificationBody: {
    color: "#ddd",
    fontSize: 14,
  },
  notificationClose: {
    color: "#4DA6FF",
    marginTop: 10,
    textAlign: "right",
    fontWeight: "600",
  },
  underlineText: {
    textDecorationLine: "underline",
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter",
    marginTop: 10,
  },
  quest: {
    height: 51,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    marginTop: 20,
    width: "90%",
  },
  questText: {
    height: 51,
    borderRadius: 10,
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
    marginTop: 20,
    width: "90%",
  },
  midTextContainer: {
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  midText: {
    width: 160,
    height: 60,
    resizeMode: "contain",
  },
  botTextContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  botText: {
    width: 110,
    height: 50,
    resizeMode: "contain",
  },
  leftBot: {
    width: 100,
    height: 140,
    resizeMode: "contain",
  },
  rightBot: {
    width: 100,
    height: 140,
    resizeMode: "contain",
  },
  leftBotContainer: {
    marginTop: 20,
    width: 200,
    height: 100,
    resizeMode: "contain",
  },
  BotContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    pointerEvents: "none",
    zIndex: 1000,
  },
  topLeft: {
    width: 110,
    height: 90,
    resizeMode: "contain",
  },
  lightLeft: {
    width: 220,
    height: 250,
    resizeMode: "contain",
  },
  topLeftContainer: {
    pointerEvents: "none",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  snowContainer: {
    position: "absolute",
    bottom: -85,
    zIndex: 1000,
    pointerEvents: "none",
  },
  snowImage: {
    width: width,
    resizeMode: "contain",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  updateContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  updateText: {
    color: Colors.white,
    fontSize: 16,
    fontFamily: "Inter",
    marginTop: 20,
    textAlign: "center",
  },
  updateMessageText: {
    color: Colors.primaryColor,
    fontSize: 14,
    fontFamily: "Inter",
    marginTop: 10,
    textAlign: "center",
  },
  updateMessageContainer: {
    width: "90%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(77, 166, 255, 0.1)",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    marginTop: 20,
  },
  updateMessageTextInline: {
    color: Colors.primaryColor,
    fontSize: 14,
    fontFamily: "Inter",
    marginLeft: 10,
    textAlign: "center",
  },
});
