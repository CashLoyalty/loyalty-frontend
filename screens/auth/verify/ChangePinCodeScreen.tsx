import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { OtpInput } from "react-native-otp-entry";
import Colors from "@/constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
import { screenDimensions } from "@/constants/constans";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = screenDimensions;

export default function ChangePinCodeScreen() {
  const [pinCode, setPinCode] = useState<string>("");
  const navigation = useNavigation();

  useEffect(() => {
    if (pinCode.length === 4) {
      handleHook(pinCode);
    }
  }, [pinCode]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleHook = (pinCode: string) => {
    router.push(`/changeNewPinCode?nowPinCode=${encodeURIComponent(pinCode)}`);
    setPinCode("");
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
      <View style={styles.createPinCodeContainer}>
        <Text style={styles.headerText}>Пин код</Text>
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
});
