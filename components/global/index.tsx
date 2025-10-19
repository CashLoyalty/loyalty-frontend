import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
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

type StoryItem = {
  id: string;
  title: string;
  image: string;
  status: string;
  expiresAt: string;
};

type StoryProps = {
  spinGifts?: any[]; // Keep for backward compatibility but not used
};

export default function Story({ spinGifts }: StoryProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const progress = useRef(new Animated.Value(0)).current;
  const animation = useRef<Animated.CompositeAnimation | null>(null);
  const isAnimating = useRef(false);
  const [token, setToken] = useState<string>("");
  const [story, setStory] = useState<StoryItem[]>([]);

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

  const getStory = async (retryCount = 0) => {
    try {
      const response = await axios.get(
        `${SERVER_URI}/api/user/story?status=ACTIVE`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setStory(response.data.response);
      console.log("story: ", response.data.response);
    } catch (error: any) {
      console.log("Failed to fetch story: ", error);

      // Handle 429 (Too Many Requests) with exponential backoff
      if (error.response?.status === 429 && retryCount < 3) {
        const delay = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        console.log(`Rate limited. Retrying in ${delay}ms...`);
        setTimeout(() => {
          getStory(retryCount + 1);
        }, delay);
      } else if (error.response?.status === 429) {
        console.log(
          "Max retries reached for story fetch. Please try again later."
        );
        // You could show a user-friendly message here
      }
    }
  };

  useEffect(() => {
    if (token) {
      getStory();
    }
  }, [token]);

  const screenWidth = Dimensions.get("window").width;
  const screenHeight = Dimensions.get("window").height;

  const filteredStories = story.filter(
    (item) => !!item.image?.trim() && item.status === "ACTIVE"
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

  const goToNextStory = () => {
    const currentIndex = filteredStories.findIndex(
      (item) => item.id === currentItemId
    );

    if (currentIndex < filteredStories.length - 1) {
      setCurrentItemId(filteredStories[currentIndex + 1].id);
      progress.setValue(0);
      startProgress();
    } else {
      closeModal();
    }
  };

  const startProgress = () => {
    progress.setValue(0);
    animation.current = Animated.timing(progress, {
      toValue: 1,
      duration: 5000,
      useNativeDriver: false,
    });

    animation.current.start(({ finished }) => {
      if (finished) {
        goToNextStory();
      }
    });
  };

  const resumeProgress = () => {
    const currentProgress = (progress as any).__getValue();
    const remainingDuration = (1 - currentProgress) * 5000;

    animation.current = Animated.timing(progress, {
      toValue: 1,
      duration: remainingDuration,
      useNativeDriver: false,
    });

    animation.current.start(({ finished }) => {
      if (finished) {
        goToNextStory();
      }
    });
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
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={filteredStories}
        horizontal
        keyExtractor={(item) => item.id}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => openModal(item.id)}>
            <View style={styles.storyItem}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.storyImage} />
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
        <Pressable
          style={styles.fullScreenModal}
          onPressIn={() => {
            if (animation.current) animation.current.stop();
          }}
          onPressOut={() => {
            resumeProgress();
          }}
        >
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
            {currentItemId && (
              <Image
                source={{
                  uri:
                    filteredStories.find((item) => item.id === currentItemId)
                      ?.image ?? "",
                }}
                style={styles.storyImageFullScreen}
                resizeMode="cover"
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
  storyImageFullScreen: {
    width: "100%",
    height: "100%",
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
