import { View, Image } from 'react-native';
import { styles } from '@/styles/home/banner.style';
import { StyleSheet } from 'react-native';
import Swiper from 'react-native-swiper';
import { bannerData } from '@/constants/constans';

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
          <View key={index} style={[styles.slide, { overflow: 'hidden' }]}>
            <Image
              source={item.bannerImageUrl!}
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
    width: '100%', // Set width to 375
    height: 175, // Set height to 175
    borderRadius: 10, // Set radius for all corners
    resizeMode: 'cover', // Ensure the image covers the area
  },
});
