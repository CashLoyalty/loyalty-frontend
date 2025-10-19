import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";

const { width } = Dimensions.get("window");

const images = [
  {
    image: require("../../assets/banners/banner1.jpg"),
  },
  {
    image: require("../../assets/banners/banner2.jpg"),
  },
  {
    image: require("../../assets/banners/banner3.jpg"),
  },
];

export default function Banner() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [token, setToken] = useState<string>("");
  const [banner, setBanner] = useState<any[]>([]);

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        console.warn("No token found in AsyncStorage");
      }
    } catch (error) {
      console.log("Failed to fetch token: ", error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  const getBanner = async () => {
    try {
      const response = await axios.get(
        `${SERVER_URI}/api/user/banner?status=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setBanner(response.data.response);
    } catch (error) {
      console.log("Failed to fetch banners: ", error);
    }
  };

  useEffect(() => {
    if (token) {
      getBanner();
    }
  }, [token]);

  useEffect(() => {
    const totalImages = banner.length > 0 ? banner.length : images.length;

    if (totalImages <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % totalImages;
        scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, banner.length]);

  const onScrollEnd = (e: any) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentIndex(newIndex);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled
        onMomentumScrollEnd={onScrollEnd}
        style={styles.scrollView}
      >
        {banner.length > 0
          ? banner.map((item: any, index: number) => (
              <Image
                key={index}
                source={{ uri: item.image }}
                style={styles.image}
              />
            ))
          : images.map((item, index) => (
              <Image key={index} source={item.image} style={styles.image} />
            ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 175,
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 10,
  },
  scrollView: {
    width: width,
  },
  image: {
    width: width,
    height: 175,
    resizeMode: "cover",
  },
});
