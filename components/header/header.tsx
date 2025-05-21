import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  Dimensions,
  StatusBar as RNStatusBar,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Colors from "@/constants/Colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const { height } = Dimensions.get("window");

export default function Header() {
  const insets = useSafeAreaInsets();

  let topOffset = 0;

  if (insets.top >= 44) {
    topOffset = insets.top - 8;
  } else if (insets.top > 20) {
    topOffset = insets.top + 7;
  } else {
    topOffset = 20;
  }

  const styles = StyleSheet.create({
    statusBarBackground: {
      backgroundColor: Colors.primaryColor,
      width: "100%",
    },
    logo: {
      width: 90,
      height: 90,
    },
    container: {
      width: "100%",
      alignItems: "center",
      marginBottom: 16,
      backgroundColor: Colors.primaryColor,
      zIndex: 1,
    },
    logoContainerStyle: {
      position: "absolute",
      top: topOffset,
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
      <View style={styles.statusBarBackground} />
      <StatusBar style="light" />
      <View style={styles.logoContainerStyle}>
        <Image
          source={require("@/assets/images/header-pepsi-logo.png")}
          style={styles.logo}
        />
      </View>
    </SafeAreaView>
  );
}
