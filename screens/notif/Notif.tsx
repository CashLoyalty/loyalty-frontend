import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";

// Destructuring screen dimensions
const { width, height } = screenDimensions;

// Sample notifications
const notificationMessage = [
  {
    id: 1,
    title: "Амжилттай!",
    message: "Таны “W9C1V2E1” бөглөө амжилттай бүртгэгдлээ.",
    status: "success",
  },
  {
    id: 2,
    title: "Алдаа гарлаа.",
    message: "Бөглөө “D2C1VRE4” бүртгэл амжилтгүй боллоо.",
    status: "error",
  },
  {
    id: 3,
    title: "",
    message:
      "Зөвхөн 7 хонгийн турш Mountain Dew ундааны бөглөө 200 оноо өгөх болно. Идэвхитэй оролцоорой!",
    status: "info",
  },
];

const handleBackPress = () => {
  router.navigate("/(tabs)");
};

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentWrapper}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image source={require("@/assets/icons/back.png")} />
          </TouchableOpacity>
          <Text style={styles.pageTitle}>Мэдэгдэл</Text>
        </View>

        {notificationMessage.map((notif, index) => (
          <View
            key={notif.id}
            style={[
              styles.notificationCard,
              {
                borderBottomWidth:
                  index === notificationMessage.length - 1 ? 1 : 0,
              },
            ]}
          >
            {notif.title ? (
              <Text style={styles.notifTitle}>{notif.title}</Text>
            ) : null}
            <Text style={styles.notifMessage}>{notif.message}</Text>
          </View>
        ))}
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
