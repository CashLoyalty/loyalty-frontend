import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";

const { width, height } = screenDimensions;

const handleBackPress = () => {
  router.navigate("/(tabs)");
};

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentWrapper}>
        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleBackPress}>
              <Image
                source={require("@/assets/icons/back.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.titleText}>Мэдэгдэл</Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  contentWrapper: {
    marginTop: 20,
  },
  titleText: {
    fontSize: 20,
    color: "#0E0E96",
    fontWeight: "600",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginHorizontal: 10,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: 15,
    marginBottom: 10,
  },
  pageTitle: {
    fontSize: 17,
    color: "#0E0E96",
    fontWeight: "600",
  },
  notificationCard: {
    borderTopWidth: 1,
    borderColor: "#B2B2B2",
    padding: 16,
  },
  notifTitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notifMessage: {
    fontSize: 14,
    color: "#333",
  },
});

export default NotificationScreen;
