import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("@/assets/images/page1.png"),
    title: "Fizzpoint тавтай морил",
    description:
      "PEPSI, LIPTON ICE TEA, MOUNTAIN DEW, STING, MIRINDA, 7UP ундааны бөглөөгийн код бүртгүүлээд урамшуулалд оролцоорой.",
    button: "ДАРААГИЙНХ",
  },
  {
    id: "2",
    image: require("@/assets/images/page2.png"),
    title: "Оноо цуглуулаад бэлгээ аваарай",
    description:
      "Судалгаа, даалгавар, бөглөө бүртгүүлж оноо цуглуулаад бэлэг хожиж эсвэл худалдаж аваарай.",
    button: "ДАРААГИЙНХ",
  },
  {
    id: "3",
    image: require("@/assets/images/page3.png"),
    title: "Таны аялал эндээс эхэлнэ",
    description: "Оноогоо үнэ цэнтэй болгож, бүх боломжийг ашиглаарай.",
    button: "ДУУССАН",
  },
];

const IntroOnboarding = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      const seen = await AsyncStorage.getItem("onboardingSeen");
      if (!seen) {
        setShowOnboarding(true);
      }
      setLoading(false);
    };
    checkOnboarding();
  }, []);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      if (isChecked) {
        await AsyncStorage.setItem("onboardingSeen", "true");
      }
      setShowOnboarding(false);
    }
  };

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => (
    <View style={styles.page}>
      <Image source={item.image} style={styles.image} />
      {/* Dots */}
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View
            key={i}
            style={[
              styles.dot,
              { backgroundColor: i === currentIndex ? "#0040FF" : "#D3D3D3" },
            ]}
          />
        ))}
      </View>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.description}>{item.description}</Text>

      {item.id === "3" && (
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setIsChecked(!isChecked)}
          activeOpacity={0.7}
        >
          <View style={[styles.checkbox, isChecked && styles.checkboxChecked]}>
            {isChecked && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
          <Text style={styles.checkboxLabel}>Дахиж үзүүлэхгүй</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>{item.button}</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#0040FF" />
      </View>
    );
  }

  return (
    <Modal
      visible={showOnboarding}
      animationType="slide"
      onRequestClose={() => setShowOnboarding(false)}
    >
      <View style={styles.overlay}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <FlatList
          data={slides}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          ref={flatListRef}
          onMomentumScrollEnd={(e) => {
            const index = Math.round(e.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
        />
      </View>
    </Modal>
  );
};

export default IntroOnboarding;

const styles = StyleSheet.create({
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",

    justifyContent: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#0040FF",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  checkboxChecked: {
    backgroundColor: "#0040FF",
    borderColor: "#0040FF",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#333",
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width,
    height,
    backgroundColor: "#fff",
    zIndex: 9999,
  },
  page: {
    width,
    height,
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: "contain",
    marginTop: height * 0.1,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    color: "#0040FF",
  },
  description: {
    fontSize: 15,
    textAlign: "center",
    color: "#333",
    lineHeight: 22,
  },
  button: {
    backgroundColor: "#0040FF",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
