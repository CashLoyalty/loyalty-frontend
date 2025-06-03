import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import Colors from "@/constants/Colors";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Header() {
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get("window").height;
  const [topOffset, setTopOffset] = useState(20);

  useEffect(() => {
    if (insets.top >= 44) {
      setTopOffset(insets.top - 8);
    } else if (insets.top > 20) {
      setTopOffset(insets.top);
    } else {
      setTopOffset(20);
    }
  }, [insets.top]);

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
      {Platform.OS === "android" && (
        <View
          style={{
            height: (screenHeight / 100) * 5.43,
            backgroundColor: Colors.black,
          }}
        />
      )}
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.logoContainerStyle}>
        <Image
          source={require("@/assets/images/header-pepsi-logo.png")}
          style={styles.logo}
        />
      </View>
    </SafeAreaView>
  );
}
