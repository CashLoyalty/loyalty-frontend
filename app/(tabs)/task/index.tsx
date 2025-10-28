import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Keyboard,
  ScrollView,
  FlatList,
} from "react-native";
import Colors from "@/constants/Colors";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "react-native-toast-notifications";
import { useContext } from "react";
import { GlobalContext } from "@/components/globalContext";
import axios from "axios";
import TaskCard from "@/components/task/TaskCard";
import TaskDetailsModal from "@/components/task/TaskDetailsModal";

const { width, height } = screenDimensions;

const Task: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [visibleSec, setVisibleSec] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [token, setToken] = useState<string>("");
  const [task, setTask] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const requiredLength = 8;
  const toast = useToast();
  const { toastHeight } = useContext(GlobalContext);

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

  const getTask = async () => {
    try {
      const response = await axios.get(`${SERVER_URI}/api/user/task`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tasksData = response.data.response || [];
      setTask(tasksData);
    } catch (error) {
      console.log("Failed to fetch task: ", error);
    }
  };
  useEffect(() => {
    if (token) {
      getTask();
    }
  }, [token]);

  useEffect(() => {
    if (phoneNumber.length === requiredLength) {
      Keyboard.dismiss();
    }
  }, [phoneNumber]);

  const handleBackPress = () => {
    router.navigate("/(tabs)");
  };

  const handleItemPress = () => {
    setVisible(true);
  };

  const handleItemPress2 = (taskItem: any) => {
    setSelectedTask(taskItem);
    setVisibleSec(true);
  };

  const handleTaskCardPress = (taskItem: any) => {
    setSelectedTask(taskItem);
    setVisibleSec(true);
  };

  // Function to parse task name and extract count and points
  const parseTaskName = (taskName: string) => {
    // Extract number before "ширхэг" (count)
    const countMatch = taskName.match(/(\d+)\s*ширхэг/);
    const count = countMatch ? parseInt(countMatch[1]) : 5;

    // Extract number before "оноо" (points)
    const pointsMatch = taskName.match(/(\d+)\s*оноо/);
    const points = pointsMatch ? parseInt(pointsMatch[1]) : 50;

    return { count, points };
  };

  const displayTasks = task;

  const handleInviteFriend = async () => {
    const verifiedPhoneNumber = phoneNumber.replace(/[^0-9]/g, "");

    if (verifiedPhoneNumber.length === 0) {
      toast.show(`Утасны дугаар оруулна уу...`, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: {
          top: toastHeight,
        },
      });
      return;
    }

    if (verifiedPhoneNumber.length !== requiredLength) {
      toast.show(`Утасны дугаар буруу...`, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: {
          top: toastHeight,
        },
      });
      return;
    }

    try {
      const response = await fetch(`${SERVER_URI}/api/user/friend/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invitedPhoneNumber: phoneNumber,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.show(`Алдаа гарлаа`, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
          style: {
            backgroundColor: Colors.red,
            top: toastHeight,
          },
        });
      } else {
        const data = await response.json();

        switch (data.code) {
          case 1000:
            toast.show(`Энэ дугаар бүртгэгдсэн байна....`, {
              type: "danger",
              placement: "top",
              duration: 1500,
              animationType: "slide-in",
              style: {
                backgroundColor: Colors.red,
                top: toastHeight,
              },
            });
            break;
          case 0:
            toast.show(`Амжилттай`, {
              type: "info",
              placement: "top",
              duration: 1500,
              animationType: "slide-in",
              style: {
                backgroundColor: Colors.green,
                top: toastHeight,
              },
            });
            break;
          default:
            toast.show(`Энэ дугаар бүртгэгдсэн байна....`, {
              type: "danger",
              placement: "top",
              duration: 1500,
              animationType: "slide-in",
              style: {
                backgroundColor: Colors.red,
                top: toastHeight,
              },
            });
        }
      }
    } catch (error) {
      console.log("Network error:", error);
    }
    setPhoneNumber("");
    setVisible(false);
  };

  const StepIndicator = ({ totalSteps = 4, currentStep = 1 }) => {
    return (
      <View style={styles.stepContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <View
              style={[
                styles.circle,
                index < currentStep
                  ? styles.activeCircle
                  : styles.inactiveCircle,
              ]}
            />
            {index < totalSteps - 1 && <View style={styles.line} />}
          </React.Fragment>
        ))}
      </View>
    );
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
          <Text style={styles.titleText}>Даалгаврууд</Text>
        </View>
        <View style={{ flex: 1 }} />
      </View>
      <TouchableOpacity onPress={() => handleItemPress()}>
        <View style={styles.taskRowContainer}>
          <View style={styles.taskInfoContainer}>
            <View style={{ paddingLeft: 20, marginTop: 10 }}>
              <Text
                style={{ fontSize: 15, fontWeight: "600", color: Colors.white }}
              >
                Найзаа урих
              </Text>
            </View>
            <View style={{ paddingLeft: 20, marginTop: 10 }}>
              <Text style={{ fontSize: 12, color: Colors.white }}>
                Та хайртай хүмүүсээ урьж
              </Text>
              <Text style={{ fontSize: 12, color: Colors.white }}>
                оноо цуглуулаарай
              </Text>
            </View>
            <StepIndicator currentStep={1} totalSteps={4} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Task Cards Grid - 2 columns */}
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cardsContainer}>
          {displayTasks.length > 0 &&
            displayTasks.map((item, index) => {
              // Parse task name to extract points
              const { points } = parseTaskName(item.taskName || "");
              // Use taskCount from API for totalSteps
              const totalSteps = item.taskCount || 5;

              return (
                <TaskCard
                  key={index}
                  task={{
                    id: index.toString(),
                    taskName: item.taskName || "Даалгавар",
                    description: item.description,
                    points: points,
                    progress: item.finishedCount || 0,
                    totalSteps: totalSteps,
                    expiryDate: item.endDate
                      ? new Date(item.endDate).toLocaleDateString("en-CA")
                      : "2025/10/31",
                    relatedProducts: item.relatedProducts || [],
                    image: item.taskImage,
                  }}
                  onPress={() => handleTaskCardPress(item)}
                />
              );
            })}
        </View>
      </ScrollView>
      <Modal
        transparent
        visible={visible}
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable
          style={styles.modalBackground}
          onPress={() => setVisible(false)}
        >
          <Pressable style={styles.modalContainer} onPress={() => {}}>
            <Text style={styles.modalText}>НАЙЗАА УРИХ</Text>
            <Text style={styles.modalTextDtl}>
              Та урих найзынхаа дугаарыг оруулна уу?
            </Text>
            <View style={styles.inputWrapper}>
              <Feather
                style={styles.icon}
                name="phone"
                size={25}
                color="#A0A4B0"
              />
              <View style={styles.verticalLine} />
              <TextInput
                style={styles.input}
                placeholder="Утасны дугаар"
                placeholderTextColor="#A0A4B0"
                keyboardType="numeric"
                maxLength={requiredLength}
                value={phoneNumber}
                onChangeText={(text) => {
                  if (text.length <= requiredLength) {
                    setPhoneNumber(text);
                  }
                }}
              />
            </View>
            <TouchableOpacity
              onPress={handleInviteFriend}
              style={styles.sendButton}
            >
              <Text style={styles.buttonText}>илгээх</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
      <TaskDetailsModal
        visible={visibleSec}
        onClose={() => setVisibleSec(false)}
        task={
          selectedTask
            ? (() => {
                const { points } = parseTaskName(selectedTask.taskName || "");
                const totalSteps = selectedTask.taskCount || 5;
                return {
                  id: selectedTask.id || "1",
                  taskName: selectedTask.taskName || "Даалгавар",
                  description: selectedTask.description,
                  points: points,
                  progress: selectedTask.finishedCount || 0,
                  totalSteps: totalSteps,
                  expiryDate: selectedTask.endDate
                    ? new Date(selectedTask.endDate).toLocaleDateString("en-CA")
                    : "2025/10/31",
                  relatedProducts: selectedTask.relatedProducts || [],
                  offerDescription:
                    selectedTask.offerDescription ||
                    `Та уг бүтээгдэхүүнээс ${totalSteps} ширхэгийг худалдан аваад ${points} оноо аваарай`,
                  image: selectedTask.taskImage,
                };
              })()
            : null
        }
      />
      {/* <View style={styles.emptyImageContainer}>
        <Image
          source={require("@/assets/images/emptyTask.png")}
          style={styles.emptyImage}
        />
        <Text style={styles.text}>Даалгавар олдсонгүй</Text>
      </View> */}
      {/*<View style={styles.flatListContainer}>
          <FlatList
            numColumns={2}
            data={TaskInfoData}
            renderItem={RenderItem}
            keyExtractor={(item) => item.id}
          />
        </View>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 10,
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
    width: 261,
    height: 233,
    opacity: 0.5,
  },
  text: {
    color: "#0E0E96",
    fontFamily: "Inter",
    fontWeight: "600",
    fontSize: 14,
    opacity: 0.5,
  },
  taskItem: {
    width: 177,
    height: 296,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    margin: 8,
    borderRadius: 10,
  },
  flatListContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  taskScoreRowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 5,
  },
  taskInfo: {
    padding: 10,
  },
  taskDateRowContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  taskTitleStyle: {
    fontSize: 16,
    fontWeight: "600",
  },
  taskInfoContainer: {
    flex: 1,
    marginLeft: 4,
    marginRight: 4,
    height: 135,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    zIndex: 1,
    paddingTop: 10,
  },
  taskImgWrapper: {
    position: "relative",
  },
  taskImgContainer: {
    zIndex: 2,
    width: width * 0.35,
    height: 185,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    borderRadius: 10,
    backgroundColor: Colors.white,
    marginLeft: -4,
    alignContent: "center",
    justifyContent: "center",
    maxWidth: 150,
  },
  overlayView: {
    position: "absolute",
    top: 15,
    right: 15,
    width: 74,
    height: 25,
    backgroundColor: Colors.giftBackgroundColor,
    zIndex: 3,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayViewSec: {
    position: "absolute",
    right: 15,
    width: 74,
    height: 25,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
    marginRight: 3,
  },
  taskRowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 8,
    paddingHorizontal: 8,
  },
  taskRowContainer2: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  modalBackground: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: 370,
    height: 230,
    padding: 20,
    backgroundColor: Colors.giftBackgroundColor,
    borderRadius: 25,
    elevation: 10,
  },
  modalText: {
    color: Colors.white,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
  },
  modalTextDtl: {
    color: Colors.white,
    marginBottom: 20,
    fontSize: 12,
    fontWeight: "300",
  },
  sendButton: {
    height: 51,
    padding: 10,
    borderRadius: 8,
    backgroundColor: Colors.black,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A1A1A1",
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: "white",
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  verticalLine: {
    width: 1,
    height: 31,
    backgroundColor: "#A1A1A1",
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  bottomSheet: {
    width: 393,
    height: 582,
    backgroundColor: Colors.white,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: 200,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  modalDesc: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 10,
  },
  modalDescRow: {
    fontSize: 12,
    marginLeft: 10,
    marginBottom: 10,
    paddingTop: 5,
  },
  stepContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginHorizontal: 4,
  },
  activeCircle: {
    backgroundColor: "blue",
    borderColor: "white",
  },
  inactiveCircle: {
    backgroundColor: "white",
    borderColor: "blue",
  },
  line: {
    height: 4,
    flex: 1,
    backgroundColor: "white",
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 8,
    borderRadius: 20,
    backgroundColor: "#E0E0E0",
    borderWidth: 1,
    borderColor: "#C0C0C0",
  },
  activeFilterButton: {
    backgroundColor: Colors.white,
    borderColor: Colors.primaryColor,
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  activeFilterText: {
    color: Colors.primaryColor,
    fontWeight: "600",
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
    marginTop: 20,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingBottom: 20,
    paddingHorizontal: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});

export default Task;
