import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

interface TaskDetailsModalProps {
  visible: boolean;
  onClose: () => void;
  task: {
    id: string;
    taskName: string;
    description?: string;
    points?: number;
    image?: string;
    progress?: number;
    totalSteps?: number;
    expiryDate?: string;
    relatedProducts?: string[];
    offerDescription?: string;
  } | null;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({
  visible,
  onClose,
  task,
}) => {
  if (!task) {
    return null;
  }

  const {
    taskName,
    description,
    points = 500,
    progress = 0,
    totalSteps = 5,
    expiryDate = "2025/10/31",
    relatedProducts = [],
    offerDescription = "Та уг бүтээгдэхүүнээс 4 ширхэгийг худалдан аваад 5 дэх бүтээгдэхүүнээ үнэгүй аваарай",
  } = task;

  const renderProgressSteps = () => {
    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View key={index} style={styles.progressStep}>
            {index < progress ? (
              <View style={styles.completedStep}>
                <Feather name="check" size={14} color={Colors.white} />
              </View>
            ) : index === totalSteps - 1 ? (
              <View style={styles.rewardStep}>
                <Feather name="star" size={14} color={Colors.white} />
              </View>
            ) : (
              <View style={styles.pendingStep} />
            )}
            {index < totalSteps - 1 && (
              <View
                style={[
                  styles.progressLine,
                  index < progress ? styles.completedLine : styles.pendingLine,
                ]}
              />
            )}
          </View>
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalContainer} onPress={() => {}}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Feather name="arrow-left" size={20} color={Colors.white} />
              </TouchableOpacity>
              <View style={styles.brandContainer}>
                <Text style={styles.loyaltyText}>Loyalty</Text>
              </View>
              <View style={styles.placeholder} />
            </View>

            {/* Main Image */}
            <View style={styles.imageContainer}>
              <Image
                source={
                  task.image
                    ? { uri: task.image }
                    : require("@/assets/images/emptyTask.png")
                }
                style={styles.mainImage}
                resizeMode="cover"
              />
            </View>

            {/* Task Details Card */}
            <View style={styles.detailsCard}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.taskSubtitle}>Даалгаврын биелэлт</Text>
                  <Text style={styles.taskTitle}>{taskName}</Text>
                </View>
              </View>

              <View style={styles.dateContainer}>
                <Feather
                  name="calendar"
                  size={16}
                  color={Colors.primaryColor}
                />
                <Text style={styles.dateText}>{expiryDate} хүртэл</Text>
              </View>

              {renderProgressSteps()}

              <Text style={styles.offerDescription}>{description}</Text>

              {relatedProducts.length > 0 && (
                <View style={styles.relatedProductsContainer}>
                  <View style={styles.relatedProductsHeader}>
                    <Feather
                      name="gift"
                      size={16}
                      color={Colors.primaryColor}
                    />
                    <Text style={styles.relatedProductsTitle}>
                      Хамаарах бүтээгдэхүүнүүд
                    </Text>
                    <Feather
                      name="info"
                      size={16}
                      color={Colors.primaryColor}
                    />
                  </View>
                  {relatedProducts.map((product, index) => (
                    <Text key={index} style={styles.relatedProductItem}>
                      • {product}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cuLogo: {
    backgroundColor: "#00A651", // CU Green color
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
  },
  cuText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
  },
  loyaltyText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  placeholder: {
    width: 40,
  },
  subtitleText: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  imageContainer: {
    position: "relative",
    height: 200,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },
  floatingCoins: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  coin: {
    position: "absolute",
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    top: 20,
    right: 20,
  },
  coinText: {
    color: Colors.white,
    fontSize: 14,
    fontWeight: "bold",
  },
  detailsCard: {
    backgroundColor: Colors.white,
    marginHorizontal: 20,
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  taskSubtitle: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  dateText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedStep: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardStep: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  pendingStep: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#C0C0C0",
  },
  progressLine: {
    width: 24,
    height: 3,
    marginHorizontal: 4,
  },
  completedLine: {
    backgroundColor: Colors.primaryColor,
  },
  pendingLine: {
    backgroundColor: "#E0E0E0",
  },
  offerDescription: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    marginBottom: 20,
  },
  relatedProductsContainer: {
    marginTop: 10,
  },
  relatedProductsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  relatedProductsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
    flex: 1,
  },
  relatedProductItem: {
    fontSize: 12,
    color: "#666",
    marginLeft: 16,
    marginBottom: 4,
  },
});

export default TaskDetailsModal;
