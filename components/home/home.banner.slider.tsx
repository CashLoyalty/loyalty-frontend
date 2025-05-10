import React from "react";
import { View, Image } from "react-native";
import { styles } from "@/styles/home/banner.style";
import { StyleSheet } from "react-native";
import Swiper from "react-native-swiper";
import { bannerData } from "@/constants/constans";
import { BannerDataTypes } from "@/types/global";

export default function HomeBannerSlider() {
  return (
    <View style={styles.container}>
      <Swiper
        dotStyle={styles.dot}
        activeDotStyle={styles.activeDot}
        autoplay={true}
        autoplayTimeout={5}
      >
        {bannerData.map((item: BannerDataTypes, index: number) => (
          <View key={index} style={[styles.slide, { overflow: "hidden" }]}>
            <Image
              source={item.bannerImageUrl}
              style={inStyles.image}
            />
          </View>
        ))}
      </Swiper>
    </View>
  );
}

const inStyles = StyleSheet.create({
  image: {
    width: "100%",
    height: 175,
    borderRadius: 10,
    resizeMode: "cover",
  },
});
