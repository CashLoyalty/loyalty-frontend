import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  Image,
  StatusBar,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { router } from "expo-router";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { OtpInput } from "react-native-otp-entry";
import Colors from "@/constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { screenDimensions } from "@/constants/constans";
import { SafeAreaView } from "react-native-safe-area-context";
import { SERVER_URI } from "@/utils/uri";

const { width, height } = screenDimensions;

export default function VerifyOtpScreen() {
  const route = useRoute();
  const { phoneNumber } = route.params as { phoneNumber?: string };
  const [pinCode, setPinCode] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const toast = useToast();

  useEffect(() => {
    if (phoneNumber?.length === 8 && pinCode.length === 6 && !loading) {
      handleConfirm(pinCode);
    }
  }, [phoneNumber, pinCode]);

  if (!phoneNumber) {
    return null;
  }

  const formatPhoneNumber = (phoneNumber: string | undefined) => {
    if (!phoneNumber || phoneNumber.length < 6) return phoneNumber;
    const start = phoneNumber.slice(0, 5);
    const end = phoneNumber.slice(-1);
    return `${start}**${end}`;
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleConfirm = async (otpCode: string) => {
    if (otpCode.length !== 6) {
      toast.show(`OTP код 6 оронтой байх ёстой.`, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
      });
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      const response = await axios.post(`${SERVER_URI}/api/user/checkOtp`, {
        phoneNumber,
        otp: otpCode,
      });

      if (response.data.code === 0) {
        router.push(
          `/createPinCode?phoneNumber=${encodeURIComponent(phoneNumber)}`
        );
      } else {
        toast.show(`Баталгаажуулах код буруу.`, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
        });
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      toast.show(errorMessage, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
      });
    } finally {
      setLoading(false);
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
      <View style={styles.verifyContainer}>
        <Text style={styles.headerText}>Баталгаажуулалт</Text>
        <Text style={styles.subText}>
          Бид доорх дугаарт 6 оронтой код илгээлээ.
        </Text>
        <Text style={styles.subTextPhoneNumber}>
          {formatPhoneNumber(phoneNumber)}
        </Text>
      </View>
      <View style={styles.inputContainer}>
        <OtpInput
          numberOfDigits={6}
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
              color: Colors.white, // Text color inside the input
              fontSize: 25, // Font size for the digits
              textAlign: "center", // Optionally align text
            },
          }}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black,
  },
  backButton: {
    position: "absolute",
    left: 20,
  },
  verifyContainer: {
    top: (height / 100) * 24,
    alignItems: "center",
  },
  headerText: {
    color: Colors.white,
    fontSize: width < 400 ? 24 : 32,
    fontFamily: "Inter",
  },
  subText: {
    fontSize: 16,
    color: "#F5F5F5",
    marginBottom: 20,
    textAlign: "center",
  },
  subTextPhoneNumber: {
    fontSize: 18,
    color: Colors.white,
    textAlign: "center",
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    top: (height / 100) * 24,
    justifyContent: "center",
    marginTop: 20,
    marginHorizontal: 20,
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
});
