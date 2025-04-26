import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Modal,
  StyleSheet,
  Dimensions,
  Pressable,
  Animated,
  ImageSourcePropType,
} from "react-native";

// Define the Product type
type Product = {
  id: string;
  image: ImageSourcePropType;
  storyImage: ImageSourcePropType;
};

// Product list with typed images
const products: Product[] = [
  {
    id: "1",
    image: require("@/assets/icons/airСondition.png"),
    storyImage: require("@/assets/loyalty/story1.png"),
  },
  {
    id: "2",
    image: require("@/assets/icons/phone.png"),
    storyImage: require("@/assets/loyalty/story2.png"),
  },
  {
    id: "3",
    image: require("@/assets/icons/iwatch.png"),
    storyImage: require("@/assets/loyalty/red.png"),
  },
  {
    id: "4",
    image: require("@/assets/icons/headPhone.png"),
    storyImage: require("@/assets/loyalty/baruun.png"),
  },
];

export default function Story() {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [progress] = useState(new Animated.Value(0));
  const isAnimating = useRef(false);

  const screenWidth = Dimensions.get("window").width;

  const openModal = (index: number) => {
    if (isAnimating.current) return;

    isAnimating.current = true;
    setCurrentIndex(index);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    progress.setValue(0);
    isAnimating.current = false;
  };

  const startProgress = () => {
    progress.setValue(0);
    Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    }).start(() => {
      if (currentIndex < products.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        closeModal();
      }
    });
  };

  const handlePress = (event: any) => {
    const screenCenter = screenWidth / 2;
    const clickX = event.nativeEvent.locationX;

    console.log("Clicked X:", clickX, "Screen Center:", screenCenter);

    if (clickX < screenCenter) {
      goToPrevious(); // Go to previous story on the left click
    } else {
      goToNext(); // Go to next story on the right click
    }
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex < products.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex > 0) {
        return prevIndex - 1;
      }
      return prevIndex;
    });
  };

  useEffect(() => {
    if (modalVisible) {
      startProgress();
    }
  }, [modalVisible, currentIndex]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenWidth],
  });

  return (
    <View>
      <FlatList
        data={products}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <TouchableOpacity onPress={() => openModal(index)}>
            <View style={styles.storyItem}>
              <Image source={item.image} style={styles.storyImage} />
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal visible={modalVisible} transparent animationType="fade" onRequestClose={closeModal}>
        <Pressable style={styles.fullScreenModal} onPress={handlePress}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Image source={require("@/assets/loyalty/close.png")} style={{ width: 23, height: 23 }} />
          </TouchableOpacity>

          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
          </View>

          <Image source={products[currentIndex]?.storyImage} style={styles.fullScreenImage} resizeMode="cover" />
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  storyItem: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  storyImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  fullScreenImage: {
    width: "100%",
    height: "100%",
  },
  progressBarContainer: {
    width: "100%",
    zIndex: 10,
    height: 4,
    backgroundColor: "rgba(255,255,255,0.2)",
    position: "absolute",
    top: 50,
    left: 0,
  },
  progressBar: {
    height: 4,
    backgroundColor: "#fff",
  },
  closeButton: {
    position: "absolute",
    top: 60,
    right: 5,
    padding: 10,
    borderRadius: 50,
    zIndex: 20,
  },
});
