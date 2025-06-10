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
} from "react-native";
import { router } from "expo-router";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { SERVER_URI } from "@/utils/uri";
import { Feather } from "@expo/vector-icons";
import Colors from "@/constants/Colors";
import { SafeAreaView } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { screenDimensions } from "@/constants/constans";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { useContext } from "react";
import { GlobalContext } from "@/components/globalContext";

const { height } = screenDimensions;

export default function LoginScreen() {
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [expoPushToken, setExpoPushToken] = useState<string>("");
  const requiredLength = 8;
  const toast = useToast();
  const { toastHeight } = useContext(GlobalContext);

  // useEffect(() => {
  //   (async () => {
  //     const { status } = await Notifications.requestPermissionsAsync();
  //     console.log("Notification permission status:", status);
  //     if (status !== "granted") {
  //       alert("Notification permission denied");
  //     }

  //     if (Platform.OS === "android") {
  //       await Notifications.setNotificationChannelAsync("default", {
  //         name: "default",
  //         importance: Notifications.AndroidImportance.HIGH,
  //         sound: "default",
  //       });
  //     }
  //   })();
  // }, []);

  // useEffect(() => {
  //   registerForPushNotificationsAsync().then((token) => {
  //     if (token) {
  //       setExpoPushToken(token);
  //       console.log("Expo push token registered:", token);
  //     } else {
  //       console.log("Token олдсонгүй");
  //     }
  //   });
  // }, []);

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

  return (
    <SafeAreaView style={styles.container}>
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
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonSignText}>Нэвтрэх</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleForgetPinCode}>
          <Text style={styles.underlineText}>Пин код сэргээх</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.footerText}>#Илүүд тэмүүл</Text>
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
  if (!Device.isDevice) {
    Alert.alert("Push мэдэгдэл зөвхөн бодит төхөөрөмж дээр ажиллана.");
    return;
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
});
