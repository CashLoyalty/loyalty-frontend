import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Keyboard,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { OtpInput } from "react-native-otp-entry";
import { useToast } from "react-native-toast-notifications";
import { router } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { screenDimensions } from "@/constants/constans";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = screenDimensions;

export default function ChangeNewPinCodeScreen() {
  const [pinCode, setPinCode] = useState<string>("");
  const navigation = useNavigation();
  const route = useRoute();
  const { nowPinCode } = route.params as { nowPinCode?: string };
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        console.log("Fetched Token: ", storedToken);
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
  }, [pinCode]);

  useEffect(() => {
    if (nowPinCode?.length === 4 && pinCode.length === 4) {
      Keyboard.dismiss();
      handleHook(nowPinCode, pinCode);
    }
  }, [nowPinCode, pinCode]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHook = (nowPinCode: any, pinCode: string) => {
    handleChangePinCode(nowPinCode, pinCode);
  };

  const handleChangePinCode = async (nowPinCode: string, pinCode: string) => {
    try {
      setLoading(true);
      const response = await axios.put(
        "https://server-w6thjpmvcq-uc.a.run.app/api/user/updatePassCode",
        { oldPassCode: nowPinCode, newPassCode: pinCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 0 && response.data.title === "Success") {
        toast.show("Нууц үг солигдлоо", {
          type: "success",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
        });
        const timer = setTimeout(() => {
          router.push(`/profile`);
        }, 2000);
        return () => clearTimeout(timer);
      }
    } catch (error) {
      console.error(error);
      toast.show("Амжилтгүй", {
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
      <TouchableOpacity onPress={handleBack}>
        <Ionicons
          name="arrow-back"
          size={24}
          color={Colors.white}
          style={styles.backButton}
        />
      </TouchableOpacity>
      <View style={styles.createPinCodeContainer}>
        <Text style={styles.headerText}>Шинэ пин код</Text>
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
  createPinCodeContainer: {
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
  loaderImage: {
    width: 300,
    height: 300,
    transform: [{ scale: 1.2 }],
  },
});
