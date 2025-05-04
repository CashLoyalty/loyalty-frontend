import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import Colors from "@/constants/Colors";
import Header from "@/components/header/header";
import HeaderSecond from "@/components/headerSecond/headerSecond";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";
import axios from "axios";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = screenDimensions;

type Question = {
  id: string;
  title: string;
  description: string;
  status: string;
  type: string;
  createdAt: string;
  minMinutes: string;
  maxMinutes: string;
  point: string;
  pathname: string;
};

const Research: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const response = await axios.get(`${SERVER_URI}/api/user/survey`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
            "Content-Type": "application/json",
          },
        });
        if (response.data) {
          setQuestions(response.data.response);
        }
      } catch (error) {
        console.error("Failed to fetch questions:", error);
      }
    };

    fetchQuestions();
  }, []);

  const handleJump = (id: string, point: string) => {
    router.push(`/questions/${id}?point=${point}`);
  };

  const handleBackPress = () => {
    router.navigate("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <Header />
      <HeaderSecond />
      <View style={styles.rowContainer}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              source={require("@/assets/icons/back.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ flex: 2, alignItems: "center", justifyContent: "center" }}>
          <Text style={styles.titleText}>Судалгаанууд</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>

      {questions.length > 0 ? (
        <View style={styles.cardContainer}>
          {questions.map((item) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => handleJump(item.id, item.point)}
              style={styles.card}
            >
              <Image
                style={{
                  width: 35,
                  height: 35,
                  borderRadius: 7,
                  zIndex: 3,
                  top: 20,
                  left: 13,
                }}
                source={require("@/assets/loyalty/reserch.png")}
              />
              <View style={styles.cardMini}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                  <Text style={styles.cardText}>{item.title}</Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <View style={styles.pointContainer}>
                    <Text style={styles.pointText}>{item.point}</Text>
                    <Image
                      style={{ width: 20, height: 17 }}
                      source={require("@/assets/icons/coin.png")}
                    />
                  </View>
                  <Text style={styles.durationText}>
                    {item.minMinutes ?? 0}-{item.maxMinutes ?? 0}мин
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={styles.notFoundModal}>
          <Image
            source={require("@/assets/images/emptyTask.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.text}>Даалгавар олдсонгүй</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginHorizontal: 10,
  },
  titleText: {
    fontSize: 20,
    color: "#0E0E96",
    fontWeight: "600",
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
  },
  card: {
    backgroundColor: "#0025FF",
    width: 160,
    height: 167,
    borderRadius: 12,
    justifyContent: "flex-end",
    margin: 8,
  },
  cardMini: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    width: 160,
    height: 140,
    borderRadius: 12,
  },
  cardText: {
    fontSize: 14,
    color: "#0025FF",
    fontWeight: "600",
    marginTop: 10,
  },
  pointContainer: {
    backgroundColor: "#0025FF",
    flexDirection: "row",
    borderRadius: 15,
    maxHeight: 30,
    maxWidth: 80,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  pointText: {
    color: "#ffffff",
    fontSize: 13,
  },
  durationText: {
    color: "#4B5563",
    fontSize: 13,
  },
  notFoundModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "100%",
    marginBottom:70
  },
  emptyImage: {
    width: 261,
    height: 233,
    opacity: 0.5,
  },
  text: {
    color: "#0E0E96",
    fontWeight: "600",
    fontSize: 14,
    opacity: 0.5,
    marginTop: 20,
  },
});

export default Research;
