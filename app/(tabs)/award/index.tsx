import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import Story from "@/components/global";
import { GiftItem } from "@/types/global";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SERVER_URI } from "@/utils/uri";
import { Dimensions } from "react-native";
import { UserResponse } from "@/types/global";
import useFetchUser from "@/hooks/useFetchUser";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import { useContext } from "react";
import { GlobalContext } from "@/components/globalContext";

const BottomModal = ({
  visible,
  setVisible,
  item,
  count,
  setCount,
  onConfirm,
  userData,
  buttonSpinner,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  item: GiftItem | null;
  count: number;
  setCount: React.Dispatch<React.SetStateAction<number>>;
  onConfirm: (item: GiftItem, count: number) => void;
  userData: UserResponse | null;
  buttonSpinner: boolean;
}) => {
  const handleDecrease = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const handleIncrease = () => {
    setCount(count + 1);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
        <Pressable style={styles.modal} onPress={() => {}}>
          <View style={styles.rowContainer2}>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "600" }}>ТАНД</Text>
            </View>
            <View style={styles.modalScore}>
              <Text
                style={{ fontSize: 15, fontWeight: "600", color: Colors.white }}
              >
                {userData?.point ? userData.point : "0"}
              </Text>
            </View>
            <View>
              <Text style={{ fontSize: 15, fontWeight: "600" }}>
                ОНОО БАЙНА
              </Text>
            </View>
          </View>

          <View style={styles.videoContainer}>
            <View style={styles.modalColumncontainer}>
              <Image
                source={{ uri: item?.image1 }}
                resizeMode="contain"
                style={{ width: 300, height: 156 }}
              />
              <Text style={{ fontSize: 15, fontWeight: "600" }}>
                {item?.name}
              </Text>
              <View style={{ alignItems: "flex-end" }}>
                <Text
                  style={{ fontSize: 12, fontWeight: "800", color: "#808080" }}
                >
                  үлд: {item?.limit}ш
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.modalColumncontainer2}>
            <Text style={{ fontSize: 18, fontWeight: "500" }}>Дэлгэрэнгүй</Text>
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 12, fontWeight: "600" }}>
                {item?.text}
              </Text>
            </View>
          </View>

          <View style={styles.modalTotalScore}>
            <Text style={styles.totalText}>НИЙТ</Text>
            <View style={styles.modalAmount}>
              <Text style={styles.amountText}>
                {item?.point ? count * item.point : 0}
              </Text>
              <Image source={require("@/assets/icons/plug2.png")} />
            </View>
          </View>

          <View style={styles.countContainer}>
            <TouchableOpacity
              style={styles.countButton}
              onPress={handleDecrease}
            >
              <Text style={styles.countButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.countText}>{count}</Text>
            <TouchableOpacity
              style={styles.countButton}
              onPress={handleIncrease}
            >
              <Text style={styles.countButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (item) {
                onConfirm(item, count);
                setCount(1);
                setVisible(false);
              }
            }}
            style={styles.closeButton}
          >
            {buttonSpinner ? (
              <ActivityIndicator size="small" color={Colors.white} />
            ) : (
              <Text style={styles.buttonText}>Авах</Text>
            )}
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const Award: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GiftItem | null>(null);
  const [token, setToken] = useState<string>("");
  const screenWidth = Dimensions.get("window").width;
  const isTablet = screenWidth >= 768;
  const numColumns = isTablet ? 4 : 2;
  const itemSpacing = 15;
  const horizontalPadding = 10; // Left and right padding
  const itemWidth =
    (screenWidth - horizontalPadding * 2 - itemSpacing * (numColumns - 1)) /
    numColumns;
  const [count, setCount] = useState<number>(1);
  const [selectedGifts, setSelectedGifts] = useState<
    { item: GiftItem; count: number }[]
  >([]);
  const [userData, setUserData] = useState<UserResponse | null>(null);
  const toast = useToast();
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const { toastHeight } = useContext(GlobalContext);
  const [spinGifts, setSpinGifts] = useState<GiftItem[] | null>(null);
  const [pointGifts, setPointGifts] = useState<GiftItem[] | null>(null);
  const [giftsLoading, setGiftsLoading] = useState(true);

  useEffect(() => {
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

    fetchToken();
  }, [token]);
  ``;

  const { data } = useFetchUser(SERVER_URI + "/api/user", token);

  useEffect(() => {
    if (data) {
      setUserData(data);
    }
  }, [data]);

  useEffect(() => {
    const fetchGifts = async () => {
      if (!token) {
        setGiftsLoading(false);
        return;
      }

      try {
        setGiftsLoading(true);

        // Fetch point gifts
        const pointResponse = await axios.get(
          `${SERVER_URI}/api/gift?type=POINT&status=ACTIVE`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (pointResponse.data.code === 0) {
          setPointGifts(pointResponse.data.response);
        } else {
          console.log(
            "Point gifts API returned error code:",
            pointResponse.data.code
          );
        }
      } catch (error) {
        console.log("Failed to fetch gifts: ", error);
      } finally {
        setGiftsLoading(false);
      }
    };

    fetchGifts();
  }, [token]);

  const handleBackPress = () => {
    router.navigate("/(tabs)");
  };

  const handleItemPress = (item: GiftItem) => {
    setSelectedItem(item);
    setVisible(true);
  };

  const handleConfirmGift = async (item: GiftItem, count: number) => {
    // Validate quantity
    if (count <= 0) {
      toast.show(`Тоо хэмжээ буруу байна`, {
        type: "warning",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
        style: {
          backgroundColor: "#FFA500",
          top: toastHeight,
        },
      });
      return;
    }

    setButtonSpinner(true);
    setSelectedGifts((prev) => [...prev, { item, count }]);

    try {
      let successCount = 0;
      let errorMessage = "";

      // Send multiple requests for each quantity
      for (let i = 0; i < count; i++) {
        const requestBody = {
          giftId: item.id,
          quantity: 1, // Always send quantity as 1
        };

        console.log(`Purchase request ${i + 1}/${count}:`, requestBody);

        const response = await axios.post(
          `${SERVER_URI}/api/user/gift/buy`,
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(
          `Purchase response ${i + 1}/${count} code:`,
          response.data.code
        );

        // Handle different response codes
        if (response.data.code === 0) {
          successCount++;
        } else if (response.data.code === 1010) {
          errorMessage = "Оноо хүрэхгүй байна";
          break; // Stop processing if insufficient points
        } else if (response.data.code === 1000) {
          errorMessage = "Бэлэг үлдэгдэл хүрэхгүй байна";
          break; // Stop processing if out of stock
        } else if (response.data.code === 1014) {
          errorMessage = "Бэлэг хязгаар хүрэхгүй байна";
          break; // Stop processing if gift limit reached
        } else {
          errorMessage = response.data.message || "Тодорхойгүй алдаа";
          break; // Stop processing on other errors
        }
      }

      // Show appropriate toast based on results
      if (successCount === count) {
        // All purchases successful
        toast.show(`${count}ш бэлэг амжилттай худалдаж авлаа!`, {
          type: "success",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
          style: {
            backgroundColor: Colors.green,
            top: toastHeight,
          },
        });

        // Refresh user data to update points
        const userResponse = await axios.get(`${SERVER_URI}/api/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (userResponse.data.code === 0) {
          setUserData(userResponse.data.response);
        }
      } else if (successCount > 0) {
        // Partial success
        toast.show(
          `${successCount}ш бэлэг амжилттай худалдаж авлаа. ${errorMessage}`,
          {
            type: "warning",
            placement: "top",
            duration: 3000,
            animationType: "slide-in",
            style: {
              backgroundColor: "#FFA500",
              top: toastHeight,
            },
          }
        );
      } else {
        // All failed
        toast.show(errorMessage, {
          type: "danger",
          placement: "top",
          duration: 2000,
          animationType: "slide-in",
          style: {
            backgroundColor: Colors.red,
            top: toastHeight,
          },
        });
      }
    } catch (error: any) {
      console.log("Purchase error:", error);

      let errorMessage = "Сүлжээний алдаа";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      toast.show(errorMessage, {
        type: "danger",
        placement: "top",
        duration: 2000,
        animationType: "slide-in",
        style: {
          backgroundColor: Colors.red,
          top: toastHeight,
        },
      });
    } finally {
      setButtonSpinner(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.rowContainer}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity onPress={handleBackPress}>
            <Image
              source={require("@/assets/icons/back.png")}
              style={{ width: 30, height: 30 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 2,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.titleText}>Шагнал</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <View style={styles.container2}>
        <Text style={styles.wheelTitle}>Азын хүрд шагнал</Text>
      </View>
      <Story spinGifts={spinGifts || []} />
      <View style={styles.container2}>
        <Text style={styles.wheelTitle}>Point Market</Text>
      </View>
      {giftsLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primaryColor} />
        </View>
      ) : (
        <FlatList
          data={pointGifts}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          columnWrapperStyle={{
            justifyContent: "space-between",
            marginBottom: 20,
            paddingHorizontal: horizontalPadding,
          }}
          contentContainerStyle={{ paddingVertical: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleItemPress(item)}>
              <View style={[styles.prizeContainer, { width: itemWidth }]}>
                <View style={styles.prizeImgContainer}>
                  <Image
                    source={{ uri: item.image1 }}
                    style={styles.prizeImage}
                    resizeMode="cover"
                  />
                </View>
                <View style={styles.prizeInfoContainer}>
                  <Text style={styles.prizeInfoTitle}>{item.name}</Text>
                  <View style={styles.prizeScoreContainer}>
                    <Text
                      style={{
                        color: Colors.white,
                        marginRight: 5,
                      }}
                    >
                      {item.point}
                    </Text>
                    <Image
                      source={require("@/assets/icons/plug.png")}
                      style={{ width: 14, height: 16 }}
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <BottomModal
        visible={visible}
        setVisible={setVisible}
        item={selectedItem}
        count={count}
        setCount={setCount}
        onConfirm={handleConfirmGift}
        userData={userData}
        buttonSpinner={buttonSpinner}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  container2: {
    marginTop: 10,
    marginLeft: 10,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
    marginHorizontal: 10,
  },
  rowContainer2: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
  titleContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    color: "#0E0E96",
    fontWeight: "600",
  },
  emptyImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyImage: {
    width: 255,
    height: 291,
    opacity: 0.5,
  },
  text: {
    color: "#0E0E96",
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 14,
    opacity: 0.5,
  },
  awardItem: {
    flex: 1,
  },
  awardRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 10,
  },
  awardImgContainer: {
    flex: 1,
    zIndex: 2,
  },
  awardInfoContainer: {
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
  awardInfoTitle: {
    textAlign: "left",
    fontSize: 23,
    fontWeight: "600",
    color: Colors.primaryColor,
  },
  videoContainer: {
    width: "100%",
    height: 222,
    marginTop: 10,
    borderWidth: 2,
    borderColor: "#E5E4E2",
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
  },
  lotteryContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  wheelTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.giftBackgroundColor,
  },
  container3: { padding: 10 },
  circle: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 5,
    borderColor: "blue",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    resizeMode: "contain",
  },
  prizeContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  prizeImgContainer: {
    zIndex: 2,
    width: "100%",
    height: 103,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  prizeImage: {
    width: "90%",
    height: 90,
  },
  prizeInfoContainer: {
    flexDirection: "column",
    width: "100%",
    marginTop: -20,
    height: 85,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    zIndex: 1,
    paddingTop: 10,
    paddingBottom: 10,
  },
  giftInfoTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.white,
    marginLeft: 20,
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 20,
    marginTop: 25,
    marginBottom: 10,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginLeft: 20,
  },
  prizeInfoTitle: {
    flex: 2,
    fontSize: 12,
    fontWeight: "600",
    color: Colors.white,
    paddingTop: 20,
    paddingLeft: 10,
  },
  prizeScoreContainer: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "flex-start",
    marginTop: 10,
    paddingRight: 20,
  },
  prizeScoreTitle: {
    fontSize: 10,
    fontWeight: "600",
    color: Colors.white,
    marginTop: 5,
    marginRight: 5,
  },
  row: {
    justifyContent: "space-evenly",
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  container5: { flex: 1, justifyContent: "center", alignItems: "center" },
  button: {
    backgroundColor: Colors.giftBackgroundColor,
    padding: 10,
    borderRadius: 5,
  },
  modalScore: {
    height: 30,
    backgroundColor: Colors.giftBackgroundColor,
    padding: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignContent: "center",
    marginHorizontal: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 25,
  },
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modal: {
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalText: { fontSize: 18, marginBottom: 10 },
  closeButton: {
    backgroundColor: Colors.giftBackgroundColor,
    height: 55,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  modalColumncontainer: {
    flexDirection: "column",
  },
  modalColumncontainer2: {
    flexDirection: "column",
    marginTop: 10,
    marginBottom: 10,
  },
  modalTotalScore: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    height: 50,
  },
  totalText: {
    fontSize: 23,
    fontWeight: "600",
    paddingTop: 5,
  },
  amountText: {
    fontSize: 23,
    fontWeight: "600",
    paddingTop: 5,
    paddingRight: 5,
  },
  modalAmount: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    flexShrink: 0,
  },
  countContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  countButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#E5E4E2",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
  },
  countButtonText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#E5E4E2",
    paddingBottom: 5,
  },
  countText: {
    fontSize: 24,
    fontWeight: "bold",
    marginHorizontal: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
});

export default Award;
