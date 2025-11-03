import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import Colors from "@/constants/Colors";
import { Feather } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface TaskCardProps {
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
  };
  onPress: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onPress }) => {
  const { totalSteps, progress = 0, points, expiryDate } = task;
  if (!totalSteps) return null;
  const renderProgressSteps = () => {
    return (
      <View style={styles.progressContainer}>
        {Array.from({ length: totalSteps }).map((_, index) => (
          <View key={index} style={styles.progressStep}>
            {index < progress ? (
              <View style={styles.completedCheckbox}>
                <Feather name="check" size={8} color={Colors.white} />
              </View>
            ) : index === totalSteps - 1 ? (
              <View style={styles.rewardCheckbox}>
                <Feather name="star" size={8} color={Colors.white} />
              </View>
            ) : (
              <View style={styles.pendingCheckbox} />
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
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View style={styles.cardHeader}>
        <View style={styles.brandContainer}>
          <Text style={styles.loyaltyText}>Loyalty</Text>
          <View style={styles.pointsContainer}>
            <Text style={styles.pointsText}>{points}</Text>
            <Image
              source={require("@/assets/icons/plug3.png")}
              style={styles.coinIcon}
            />
          </View>
        </View>
      </View>
      <Text style={styles.subtitleText}>{task.taskName}</Text>

      <View style={styles.imageContainer}>
        <Image
          source={
            task.image
              ? { uri: task.image }
              : require("@/assets/images/emptyTask.png")
          }
          style={styles.taskImage}
          resizeMode="cover"
        />
      </View>

      {renderProgressSteps()}

      <View style={styles.dateContainer}>
        <Feather name="calendar" size={14} color={Colors.primaryColor} />
        <Text style={styles.dateText}>{expiryDate} хүртэл</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    width: (width - 48) / 2,
    maxWidth: (width - 48) / 2,
    minHeight: 280,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flex: 1,
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
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  subtitleText: {
    fontSize: 10,
    color: "#666",
    marginBottom: 12,
  },
  imageContainer: {
    position: "relative",
    height: 120,
    marginBottom: 12,
    borderRadius: 8,
    overflow: "hidden",
  },
  taskImage: {
    width: "100%",
    height: "100%",
  },
  pointsContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primaryColor,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  pointsText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: "bold",
    marginRight: 4,
  },
  coinIcon: {
    width: 16,
    height: 16,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    justifyContent: "center",
    width: "100%",
    paddingHorizontal: 8,
  },
  progressStep: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    minWidth: 18,
  },
  completedCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  rewardCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.primaryColor,
  },
  pendingCheckbox: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#C0C0C0",
  },
  progressLine: {
    width: 8,
    height: 2,
    marginHorizontal: 1,
    flex: 1,
    maxWidth: 15,
  },
  completedLine: {
    backgroundColor: Colors.primaryColor,
  },
  pendingLine: {
    backgroundColor: "#E0E0E0",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
});

export default TaskCard;
