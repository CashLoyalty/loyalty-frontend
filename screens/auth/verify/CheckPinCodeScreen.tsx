import React, { useState, useEffect, useContext } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import { router } from "expo-router";
import { useNavigation, useRoute } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// ❌ import { Audio } from "expo-audio";
// ✅ use expo-audio hooks/APIs
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { OtpInput } from "react-native-otp-entry";
import { useToast } from "react-native-toast-notifications";
import Colors from "@/constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { screenDimensions } from "@/constants/constans";
import { SafeAreaView } from "react-native-safe-area-context";
import { SERVER_URI } from "@/utils/uri";
import { GlobalContext } from "@/components/globalContext";

const { width, height } = screenDimensions;

export default function CheckPinCodeScreen() {
  const [code, setCode] = useState<string>("");
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber, pinCode, screenName } = route.params as {
    phoneNumber?: string;
    pinCode?: string;
    screenName?: string;
  };
  const { toastHeight } = useContext(GlobalContext);
  const toast = useToast();
  const [loading, setLoading] = useState(false);

  // ✅ expo-audio: файлаа hook-р ачаалж, тоглуулна
  const player = useAudioPlayer(require("@/assets/sounds/login.mp3"));

  useEffect(() => {
    // iOS silent mode-д чимээ гарах тохиргоо
    setAudioModeAsync({ playsInSilentMode: true }).catch(() => {});
  }, []);

  const playSound = async () => {
    try {
      player.seekTo(0);
      await player.play();
    } catch (e) {
      console.log("Error playing sound:", e);
    }
  };

  useEffect(() => {
    if (phoneNumber?.length === 8 && code.length === 4) {
      handleConfirm(phoneNumber, code);
    }
  }, [phoneNumber, code]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirm = async (phoneNumber: any, againPinCode: string) => {
    const enteredCode = againPinCode;

    if (enteredCode === pinCode) {
      setLoading(true);
      if (screenName) {
        // forgot/new PIN урсгал
        try {
          const response = await axios.post(
            `${SERVER_URI}/api/user/setNewPassCode`,
            {
              phoneNumber: phoneNumber,
              newPassCode: enteredCode,
            }
          );

          if (response.data.code === 0) {
            router.push("/");
          } else {
            toast.show("Баталгаажуулалт амжилтгүй!", {
              type: "danger",
              placement: "top",
              duration: 1500,
              animationType: "slide-in",
              style: { top: toastHeight },
            });
          }
        } catch (error) {
          console.log(error);
          toast.show("Алдаа гарлаа, дахин оролдоно уу...", {
            type: "danger",
            placement: "top",
            duration: 1500,
            animationType: "slide-in",
            style: { top: toastHeight },
          });
        } finally {
          setLoading(false);
        }
      } else {
        // register урсгал
        try {
          const response = await axios.post(`${SERVER_URI}/api/user/register`, {
            phoneNumber: phoneNumber,
            passCode: enteredCode,
          });

          if (response.data.code === 0) {
            const accessToken = response.data.response.access_token;
            await AsyncStorage.setItem("token", accessToken);
            await playSound();
            router.push("/(tabs)?terms=true");
          } else {
            toast.show("Баталгаажуулалт амжилтгүй!", {
              type: "danger",
              placement: "top",
              duration: 1500,
              animationType: "slide-in",
              style: { top: toastHeight },
            });
          }
        } catch (error) {
          console.log(error);
          toast.show("Алдаа гарлаа, дахин оролдоно уу...", {
            type: "danger",
            placement: "top",
            duration: 1500,
            animationType: "slide-in",
            style: { top: toastHeight },
          });
        } finally {
          setLoading(false);
        }
      }
    } else {
      toast.show("Кодууд тохирохгүй байна!", {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: { top: toastHeight },
      });
      return;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <TouchableOpacity onPress={handleBack}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.white}
          style={styles.backButton}
        />
      </TouchableOpacity>

      <View style={styles.confirmPinCodeContainer}>
        <Text style={styles.headerText}>Дахин оруулна уу</Text>
        <View style={styles.inputContainer}>
          <OtpInput
            numberOfDigits={4}
            onTextChange={setCode}
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
                elevation: 10,
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
  container: { flex: 1, backgroundColor: Colors.black },
  backButton: { position: "absolute", left: 20 },
  confirmPinCodeContainer: {
    top: (height / 100) * 24,
    alignItems: "center",
  },
  headerText: {
    fontSize: width < 400 ? 24 : 32,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginTop: 20,
    justifyContent: "center",
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
  loaderImage: { width: 300, height: 300, transform: [{ scale: 1.2 }] },
});
