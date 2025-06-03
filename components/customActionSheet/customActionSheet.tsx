import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

type CustomActionSheetProps = {
  visible: boolean;
  onSelect: (index: number) => void;
  onCancel: () => void;
};

export default function CustomActionSheet({
  visible,
  onSelect,
  onCancel,
}: CustomActionSheetProps) {
  const options = ["Камер", "Галлерей", "Татгалзах"];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {options.map((option, index) => {
            const isCancel = option === "Татгалзах";
            return (
              <TouchableOpacity
                key={index}
                style={[styles.optionButton, isCancel && styles.cancelButton]}
                onPress={() => {
                  if (isCancel) onCancel();
                  else onSelect(index);
                }}
              >
                <Text
                  style={[styles.optionText, isCancel && styles.cancelText]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheet: {
    padding: 10,
  },
  optionButton: {
    backgroundColor: "#0025FF",
    paddingVertical: 16,
    marginBottom: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  optionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: "white",
    marginBottom: 30,
  },
  cancelText: {
    color: "black",
  },
});
