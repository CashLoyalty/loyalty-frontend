import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Image,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { OtpInput } from "react-native-otp-entry";
import { useToast } from "react-native-toast-notifications";
import { SERVER_URI } from "@/utils/uri";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { BlurView } from "expo-blur";
import { screenDimensions } from "@/constants/constans";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = screenDimensions;

export default function LoginWithPinCodeScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phoneNumber } = route.params as { phoneNumber?: string };
  const [pinCode, setPinCode] = useState<string>("");
  const [sound, setSound] = useState<Audio.Sound | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const loadSound = async () => {
    const { sound: loadedSound } = await Audio.Sound.createAsync(
      require("@/assets/sounds/login.mp3")
    );
    setSound(loadedSound);
  };

  useEffect(() => {
    loadSound();
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const playSound = async () => {
    if (sound) {
      try {
        await sound.replayAsync();
      } catch (error) {
        console.log("Error playing sound:", error);
      }
    } else {
      console.log("Sound is not loaded yet");
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
      const response = await axios.post(`${SERVER_URI}/api/user/login`, {
        phoneNumber: phoneNumber,
        passCode: pinCode,
      });

      if (response.data.code === 0) {
        const accessToken = response.data.response.access_token;
        await AsyncStorage.setItem("token", accessToken);
        playSound();
        router.push("/(tabs)");
      } else {
        if (response.data.title === "Passcode is wrong!") {
          toast.show("Пин код буруу", {
            type: "danger",
            placement: "top",
            duration: 1500,
            animationType: "slide-in",
          });
        } else {
          toast.show(response.data.title, {
            type: "danger",
            placement: "top",
            duration: 1500,
            animationType: "slide-in",
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.show("Алдаа гарлаа: " + error, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
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
        {
          phoneNumber: phoneNumber,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      /*if (data.code === 0) {
        router.push(
          `/verifyOtp?phoneNumber=${encodeURIComponent(
            phoneNumber
          )}&screenName=${encodeURIComponent("forgotPinCode")}`
        );
      }*/
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
          }
        );
      } else {
        toast.show(`Алдаа гарлаа: ${String(error)}`, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
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
          <Text style={styles.title}>Пин кодоор нэвтрэх</Text>
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
                borderColor: Colors.primaryColor, // this adds the blue border
                justifyContent: "center",
                alignItems: "center",

                // Shadow for iOS
                shadowColor: Colors.primaryColor,
                shadowOffset: { width: 5, height: 5 },
                shadowOpacity: 0.9,
                shadowRadius: 10,

                // Shadow for Android
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
                color: Colors.white, // Text color inside the input
                fontSize: 25, // Font size for the digits
                textAlign: "center", // Optionally align text
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
