import React, { useRef, useEffect, useState } from "react";
import { View, Image, ScrollView, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const images = [
  {
    image: require('../../assets/banners/banner1.jpg'),
  },
  {
    image: require('../../assets/banners/banner2.jpg'),
  },
  {
    image: require('../../assets/banners/banner3.jpg'),
  }
];

export default function Banner() {
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false} 
        style={styles.scrollView}
      >
        {images.map((item, index) => (
          <Image
            key={index}
            source={item.image}
            style={styles.image}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 175,
    borderRadius: 10,
    overflow: 'hidden',
  },
  scrollView: {
    width: width,
  },
  image: {
    width: width,
    height: 175,
    resizeMode: 'cover',
  },
});