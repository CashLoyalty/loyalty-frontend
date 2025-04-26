import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
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
        console.log(response.data);

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

  return (
    <View style={styles.container}>
      <Header />
      <HeaderSecond />

      <View style={styles.cardContainer}>
        {questions.length > 0 ? (
          questions.map((item) => (
            <TouchableOpacity key={item.id} onPress={() => handleJump(item.id, item.point)} style={styles.card}>
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
                  <View
                    style={{
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
                    }}
                  >
                    <Text style={{ color: "#ffffff", fontSize: 13 }}>{item.point}</Text>
                    <Image style={{ width: 20, height: 17 }} source={require("@/assets/icons/coin.png")} />
                  </View>
                  <Text style={{ color: "#4B5563", fontSize: 13 }}>
                    {item.minMinutes ?? 0}-{item.maxMinutes ?? 0}мин
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View>
              <Image source={require("@/assets/images/emptyTask.png")} style={{ width: 260, height: 230 }} />
              <Text style={{ color: "#0E0E96", fontWeight: "600", textAlign: "center" }}>Судалгаа олдсонгүй</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardText: {
    fontSize: 14,
    color: "#0025FF",
    fontWeight: "600",
    marginTop: 10,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  cardContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    justifyContent: "space-between",
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
  researchItem: {
    flex: 1,
  },
  researchRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  researchImgContainer: {
    flex: 1,
    zIndex: 2,
  },
  researchInfoContainer: {
    flexDirection: "row",
    width: "100%",
    height: 150,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    justifyContent: "center",
    zIndex: 1,
    padding: 10,
  },
  infoSection1: {
    flex: 4,
    backgroundColor: Colors.white,
  },
  infoSection2: {
    flex: 5,
    backgroundColor: Colors.white,
  },
  researchInfoTitle: {
    textAlign: "left",
    fontSize: 23,
    fontWeight: "600",
    color: Colors.primaryColor,
  },
  scoureContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 40,
    marginBottom: 10,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export default Research;
