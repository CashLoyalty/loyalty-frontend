import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
  Platform,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";

// ✅ expo-audio зөв импорт
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";

import { OtpInput } from "react-native-otp-entry";
import { useToast } from "react-native-toast-notifications";
import { SERVER_URI } from "@/utils/uri";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { screenDimensions } from "@/constants/constans";
import { SafeAreaView } from "react-native-safe-area-context";
import { GlobalContext } from "@/components/globalContext";
import {
  getDeviceToken,
  getDeviceTokenSimple,
} from "@/utils/notificationService";

const { width, height } = screenDimensions;

export default function LoginWithPinCodeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber = "" } = route.params as { phoneNumber?: string };
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const [pinCode, setPinCode] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { toastHeight } = useContext(GlobalContext);

  useEffect(() => {
    (async () => {
      console.log("🚀 Starting token retrieval...");

      // Try multiple approaches
      let token = null;

      // Approach 1: Direct call
      try {
        console.log("🔔 Approach 1: Direct call...");
        const result = await Notifications.getExpoPushTokenAsync();
        console.log("🔔 Direct result:", result);
        if (result?.data) {
          token = result.data;
          console.log("🔔 Direct success:", token);
        }
      } catch (error) {
        console.log(
          "🔔 Direct failed:",
          error instanceof Error ? error.message : String(error)
        );
      }

      // Approach 2: With project ID
      if (!token) {
        try {
          console.log("🔔 Approach 2: With project ID...");
          const result = await Notifications.getExpoPushTokenAsync({
            projectId: "aa3019f0-33c3-4d89-bfde-e0cef80729b7",
          });
          console.log("🔔 Project ID result:", result);
          if (result?.data) {
            token = result.data;
            console.log("🔔 Project ID success:", token);
          }
        } catch (error) {
          console.log(
            "🔔 Project ID failed:",
            error instanceof Error ? error.message : String(error)
          );
        }
      }

      // Approach 3: Check permissions first
      if (!token) {
        try {
          console.log("🔔 Approach 3: Check permissions...");
          const { status } = await Notifications.getPermissionsAsync();
          console.log("🔔 Permission status:", status);

          if (status === "granted") {
            const result = await Notifications.getExpoPushTokenAsync();
            console.log("🔔 Permission granted result:", result);
            if (result?.data) {
              token = result.data;
              console.log("🔔 Permission success:", token);
            }
          } else {
            console.log("🔔 Requesting permissions...");
            const { status: newStatus } =
              await Notifications.requestPermissionsAsync();
            console.log("🔔 New permission status:", newStatus);

            if (newStatus === "granted") {
              const result = await Notifications.getExpoPushTokenAsync();
              console.log("🔔 New permission result:", result);
              if (result?.data) {
                token = result.data;
                console.log("🔔 New permission success:", token);
              }
            }
          }
        } catch (error) {
          console.log(
            "🔔 Permission approach failed:",
            error instanceof Error ? error.message : String(error)
          );
        }
      }

      console.log("🔔 Final token result:", token);
      if (token) {
        setExpoPushToken(token);
        console.log("🔔 Token set successfully:", token);
      } else {
        console.warn("🔔 ALL METHODS FAILED - No token received");
      }
    })();
  }, []);

  // ✅ expo-audio player — require ашиглахад OK
  const player = useAudioPlayer(require("@/assets/sounds/login.mp3"));

  useEffect(() => {
    // iOS-д чимээ дуугаргахын тулд silent mode-д тоглуулахыг зөвшөөрнө
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const playSound = async () => {
    try {
      // дахин тоглуулахын тулд эхлэл рүү нь аваад play
      player.seekTo(0);
      await player.play();
    } catch (e) {
      console.log("Error playing sound:", e);
    }
  };

  useEffect(() => {
    if (phoneNumber?.length === 8 && pinCode.length === 4 && !loading) {
      handleLogin(phoneNumber, pinCode);
    }
  }, [phoneNumber, pinCode]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleLogin = async (phoneNumber: string, pinCode: string) => {
    Keyboard.dismiss();
    try {
      setLoading(true);
      console.log("🔐 Login attempt with device token:", expoPushToken);
      const response = await axios.post(`${SERVER_URI}/api/user/login`, {
        phoneNumber: phoneNumber,
        passCode: pinCode,
        deviceToken: expoPushToken,
      });

      if (response.data.code === 0) {
        const accessToken = response.data.response.access_token;
        await AsyncStorage.setItem("token", accessToken);
        await playSound();
        router.push("/(tabs)");
      } else {
        if (response.data.title === "Passcode is wrong!") {
          toast.show("Пин код буруу", {
            type: "danger",
            placement: "top",
            duration: 1500,
            animationType: "slide-in",
            style: { top: toastHeight },
          });
        } else {
          toast.show(response.data.title, {
            type: "danger",
            placement: "top",
            duration: 1500,
            animationType: "slide-in",
            style: { top: toastHeight },
          });
        }
      }
    } catch (error: any) {
      toast.show("Алдаа гарлаа: " + error, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: { top: toastHeight },
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPinCode = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${SERVER_URI}/api/user/getForgotPasscodeOtp`,
        { phoneNumber },
        { headers: { "Content-Type": "application/json" } }
      );

      const data = response.data;
      if (data.code === 0) {
        router.push(
          `/verifyOtp?phoneNumber=${encodeURIComponent(
            phoneNumber
          )}&screenName=${encodeURIComponent("forgotPinCode")}`
        );
      }
    } catch (error: any) {
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
            style: { top: toastHeight },
          }
        );
      } else {
        toast.show(`Алдаа гарлаа: ${String(error)}`, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
          style: { top: toastHeight },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={handleBack}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.white}
          style={styles.backButton}
        />
      </TouchableOpacity>

      <View style={styles.pinCodeContainer}>
        <View>
          <Text style={styles.title}>Пин кодоор нэвтрэх.</Text>
        </View>

        <View style={styles.inputContainer}>
          <OtpInput
            numberOfDigits={4}
            onTextChange={setPinCode}
            focusColor={Colors.primaryColor}
            focusStickBlinkingDuration={400}
            theme={{
              pinCodeContainerStyle: {
                backgroundColor: Colors.black,
                width: width < 400 ? 45 : 55,
                height: height < 650 ? 45 : 55,
                borderRadius: 10,
                borderWidth: 2,
                borderColor: Colors.primaryColor,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: Colors.primaryColor,
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.9,
                shadowRadius: 10,
                elevation: 12,
              },
              filledPinCodeContainerStyle: {
                borderColor: Colors.primaryColor,
                width: width < 400 ? 50 : 55,
                height: height < 650 ? 50 : 55,
              },
              focusedPinCodeContainerStyle: {
                width: width < 400 ? 45 : 55,
                height: height < 650 ? 45 : 55,
              },
              pinCodeTextStyle: {
                color: Colors.white,
                fontSize: 25,
                textAlign: "center",
              },
            }}
          />
        </View>

        <TouchableOpacity onPress={handleForgetPinCode}>
          <Text style={styles.underlineText}>Пин код сэргээх</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  pinCodeContainer: {
    top: (height / 100) * 24,
    alignItems: "center",
  },
  title: {
    color: Colors.white,
    fontSize: width < 400 ? 24 : 32,
    fontFamily: "Inter",
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginHorizontal: 70,
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
  underlineText: {
    textDecorationLine: "underline",
    color: Colors.white,
    fontSize: 14,
    fontFamily: "Inter",
    marginTop: 10,
  },
});
