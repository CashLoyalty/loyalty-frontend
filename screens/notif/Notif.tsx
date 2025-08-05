import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import { screenDimensions } from "@/constants/constans";
import { useNavigation } from "@react-navigation/native";

const { width, height } = screenDimensions;

const NotificationScreen = () => {
  const navigation = useNavigation();
  const handleBack = () => {
    navigation.goBack();
  };

  const data = [
    {
      id: 1,
      type: "succes",
      text: "Таны “W9C1V2E1” бөглөө амжиллтай бүртгэгдлэ",
      date: "2025/07/21 18:03",
    },
    {
      id: 2,
      type: "error",
      text: "Бөглөө “D2C1VRE4” бүртгэл амжилтгүй боллоо",
      date: "2025/07/21 18:03",
    },
  ];
  return (
    <View style={styles.container}>
      <Header />
      <View style={styles.contentWrapper}>
        <View style={styles.rowContainer}>
          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={handleBack}>
              <Image
                source={require("@/assets/icons/back.png")}
                style={{ width: 30, height: 30 }}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 2,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={styles.titleText}>Мэдэгдэл</Text>
          </View>
          <View style={{ flex: 1 }} />
        </View>
      </View>
      <View>
        {data.map((item, index) => (
          <View
            key={item.id}
            style={[
              styles.notificationCard,
              index === data.length - 1 && { borderBottomWidth: 1 }, // Зөвхөн хамгийн сүүлийн item-д
            ]}
          >
            <Text style={styles.dateTopRight}>{item.date}</Text>

            <View style={styles.headerRow}>
              <Image
                source={
                  item.type === "succes"
                    ? require("@/assets/icons/success.png")
                    : require("@/assets/icons/error.png")
                }
                style={{ width: 20, height: 20 }}
              />
              <Text style={styles.notifTitle}>
                {item.type === "succes" ? "Амжилттай" : "Алдаа Гарлаа"}
              </Text>
            </View>

            <Text style={styles.notifMessage}>{item.text}</Text>
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
    marginBottom: 10,
  },
  dateTopRight: {
    position: "absolute",
    top: 10,
    right: 16,
    fontSize: 12,
    color: "#666",
  },
  notificationCard: {
    borderTopWidth: 1,
    borderColor: "#B2B2B2",
    padding: 16,
    position: "relative",
    marginTop: 10,
  },
  notifTitle: {
    fontSize: 15,
    marginBottom: 4,
    fontWeight: "semibold",
  },
  notifMessage: {
    fontSize: 14,
    color: "#333",
  },
});

export default NotificationScreen;
