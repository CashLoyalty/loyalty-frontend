import React, { useEffect } from "react";
import { Tabs } from "expo-router";
import { Image, StyleSheet, Text, View, Platform } from "react-native";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

export default function TabsLayout() {
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS === "android") {
      // Цагаан background + хар товч
      NavigationBar.setBackgroundColorAsync("#ffffff");
      NavigationBar.setButtonStyleAsync("dark");
    }
  }, []);

  console.log("insert bottom : " + insets.bottom);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, focused }) => {
          let iconName;
          if (route.name === "index") {
            iconName = require("@/assets/icons/home.png");
          } else if (route.name === "award/index") {
            iconName = require("@/assets/icons/award.png");
          } else if (route.name === "task/index") {
            iconName = require("@/assets/icons/task.png");
          } else if (route.name === "research/index") {
            iconName = require("@/assets/icons/research.png");
          }

          const tintColor = focused ? Colors.primaryColor : color;

          return (
            <Image style={[styles.icon, { tintColor }]} source={iconName} />
          );
        },
        tabBarLabel: ({ focused, color }) => {
          let label;
          if (route.name === "index") {
            label = "Нүүр";
          } else if (route.name === "award/index") {
            label = "Шагнал";
          } else if (route.name === "task/index") {
            label = "Даалгавар";
          } else if (route.name === "research/index") {
            label = "Судалгаа";
          }

          const tintColorLabel = focused ? Colors.primaryColor : color;

          return (
            <View style={styles.labelContainer}>
              <Text style={[styles.label, { color: tintColorLabel }]}>
                {label}
              </Text>
            </View>
          );
        },
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 20 },
        ],
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="award/index" />
      <Tabs.Screen name="task/index" />
      <Tabs.Screen name="research/index" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 24,
    height: 24,
  },
  tabBar: {
    backgroundColor: "#fff",
  },
  labelContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },
});
