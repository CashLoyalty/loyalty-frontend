import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  StatusBar,
} from "react-native";
//import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
const { width, height } = Dimensions.get("window");

export default function Header() {
  const insets = useSafeAreaInsets();
  const [hasSaveArea, setHasSaveArea] = useState(false);

  useEffect(() => {
    setHasSaveArea(insets.top > 44);
  }, [insets.top]);

  const styles = StyleSheet.create({
    logo: {
      width: 90,
      height: 90,
    },
    container: {
      width: "100%",
      height: hasSaveArea ? height * 0.1 : height * 0.08,
      alignItems: "center",
      marginBottom: 16,
      backgroundColor: Colors.primaryColor,
      zIndex: 1,
    },
    logoContainerStyle: {
      position: "absolute",
      top: hasSaveArea ? height * 0.06 : height * 0.03,
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2,
      ...Platform.select({
        ios: {
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
      }),
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.logoContainerStyle}>
        <Image
          source={require("@/assets/images/header-pepsi-logo.png")}
          style={styles.logo}
        />
      </View>
    </SafeAreaView>
  );
}
