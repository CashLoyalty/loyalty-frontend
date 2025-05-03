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
} from "react-native";

type GiftItem = {
  id: string;
  name: string;
  probability: number;
  limit: number;
  text: string;
  type: string;
  expiresAt?: string | null;
  image1?: string;
  image2?: string;
  point?: number;
  isCoupon?: boolean;
};

type StoryProps = {
  spinGifts: GiftItem[];
};

const StoryBackground = require("@/assets/loyalty/storyBackground.png");

export default function Story({ spinGifts }: StoryProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [progress] = useState(new Animated.Value(0));
  const isAnimating = useRef(false);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const filteredSpinGifts = spinGifts.filter(
    (item) => !!item.image1?.trim() && !!item.image2?.trim()
  );

  const openModal = (itemId: string) => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setCurrentItemId(itemId);
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
      const currentIndex = filteredSpinGifts.findIndex(
        (item) => item.id === currentItemId
      );
      if (currentIndex < filteredSpinGifts.length - 1) {
        setCurrentItemId(filteredSpinGifts[currentIndex + 1].id);
      } else {
        closeModal();
      }
    });
  };

  const handlePress = (event: any) => {
    const screenCenter = screenWidth / 2;
    const clickX = event.nativeEvent.locationX;

    if (clickX < screenCenter) {
      goToPrevious();
    } else {
      goToNext();
    }
  };

  const goToNext = () => {
    const currentIndex = filteredSpinGifts.findIndex(
      (item) => item.id === currentItemId
    );
    if (currentIndex < filteredSpinGifts.length - 1) {
      setCurrentItemId(filteredSpinGifts[currentIndex + 1].id);
    }
  };

  const goToPrevious = () => {
    const currentIndex = filteredSpinGifts.findIndex(
      (item) => item.id === currentItemId
    );
    if (currentIndex > 0) {
      setCurrentItemId(filteredSpinGifts[currentIndex - 1].id);
    }
  };

  useEffect(() => {
    if (modalVisible && currentItemId) {
      startProgress();
    }
  }, [modalVisible, currentItemId]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenWidth],
  });

  return (
    <View>
      <FlatList
        data={filteredSpinGifts}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item.id)}>
            <View style={styles.storyItem}>
              {item.image1 ? (
                <Image
                  source={{ uri: item.image1 }}
                  style={styles.storyImage}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        )}
      />

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.fullScreenModal} onPress={handlePress}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Image
              source={require("@/assets/loyalty/close.png")}
              style={{ width: 23, height: 23 }}
            />
          </TouchableOpacity>

          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[styles.progressBar, { width: progressWidth }]}
            />
          </View>

          <View style={styles.storyContainer}>
            <Image
              source={StoryBackground}
              style={[
                StyleSheet.absoluteFillObject,
                { zIndex: 0, width: screenWidth, height: screenHeight },
              ]}
              resizeMode="cover"
            />
            {currentItemId && (
              <Image
                source={{
                  uri:
                    filteredSpinGifts.find((item) => item.id === currentItemId)
                      ?.image2 ?? "",
                }}
                style={styles.storyImageOverlay}
                resizeMode="contain"
              />
            )}
          </View>
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
    justifyContent: "center",
    alignItems: "center",
  },
  storyContainer: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 0,
    width: "100%",
    height: "100%",
  },
  storyImageOverlay: {
    width: "80%",
    height: "80%",
    zIndex: 1,
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
