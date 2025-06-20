import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Pressable,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import { useToast } from "react-native-toast-notifications";
import { useFocusEffect } from "@react-navigation/native";
import { useContext } from "react";
import { GlobalContext } from "@/components/globalContext";

const { width } = Dimensions.get("window");
const frameSize = width * 0.5;

const QRCodeReaderScreen = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [scanned, setScanned] = useState(false);
  const toast = useToast();
  const { toastHeight } = useContext(GlobalContext);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (!scanned && data !== "") {
      setScanned(true);
      console.log(`Data: ${data}`);
      toast.show(`Бөглөөний код буруу байна`, {
        type: "info",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: {
          backgroundColor: Colors.primaryColor,
          top: toastHeight,
        },
      });

      setTimeout(() => {
        router.navigate("/(tabs)");
      }, 4000);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      return () => {};
    }, [])
  );

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        facing={facing}
        barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
        onBarcodeScanned={handleBarCodeScanned}
      >
        <View style={styles.overlay}>
          <View style={styles.actionContainer}>
            <View style={styles.backButtonWrapper}>
              <Pressable onPress={() => router.navigate("/(tabs)")}>
                <Image
                  source={require("@/assets/icons/backQrCodeReader.png")}
                />
              </Pressable>
            </View>
            {/* <View style={styles.iconWrapper}>
              <Image source={require("@/assets/icons/flashLight.png")} />
              <Image
                style={{ marginLeft: 10 }}
                source={require("@/assets/icons/uploadQrCode.png")}
              />
            </View> */}
          </View>
          <View style={styles.scanAreaWrapper}>
            <Text style={styles.instruction}>
              Идэвхтэй талбарт байрлуулна уу
            </Text>
            <View style={styles.scannerFrame}>
              <View style={styles.cornerTopLeft} />
              <View style={styles.cornerTopRight} />
              <View style={styles.cornerBottomLeft} />
              <View style={styles.cornerBottomRight} />
            </View>
          </View>
          <View style={styles.footer}>
            <Image
              source={require("@/assets/icons/qrCodeReader.png")}
              style={{ width: 24, height: 24 }}
            />
            <Text style={styles.footerText}>QR кодоо уншуулна уу !</Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const borderLength = 30;
const borderWidth = 4;
const borderColor = Colors.primaryColor;
const borderRadius = 12;

const styles = StyleSheet.create({
  container: { flex: 1 },
  message: { textAlign: "center", paddingBottom: 10 },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "column",
  },
  instruction: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: "600",
    marginBottom: 30,
  },
  scanAreaWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    width: "100%",
    height: 72,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  footerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.primaryColor,
    marginLeft: 10,
  },
  scannerFrame: {
    width: frameSize,
    height: frameSize,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 12,
  },
  cornerTopLeft: {
    position: "absolute",
    top: 0,
    left: 0,
    width: borderLength,
    height: borderLength,
    borderTopWidth: borderWidth,
    borderLeftWidth: borderWidth,
    borderColor: borderColor,
    borderTopLeftRadius: borderRadius,
  },
  cornerTopRight: {
    position: "absolute",
    top: 0,
    right: 0,
    width: borderLength,
    height: borderLength,
    borderTopWidth: borderWidth,
    borderRightWidth: borderWidth,
    borderColor: borderColor,
    borderTopRightRadius: borderRadius,
  },
  cornerBottomLeft: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: borderLength,
    height: borderLength,
    borderBottomWidth: borderWidth,
    borderLeftWidth: borderWidth,
    borderColor: borderColor,
    borderBottomLeftRadius: borderRadius,
  },
  cornerBottomRight: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: borderLength,
    height: borderLength,
    borderBottomWidth: borderWidth,
    borderRightWidth: borderWidth,
    borderColor: borderColor,
    borderBottomRightRadius: borderRadius,
  },
  actionContainer: {
    flexDirection: "row",
    marginTop: 53,
    marginHorizontal: 20,
    height: 40,
  },
  backButtonWrapper: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  iconWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },
});

export default QRCodeReaderScreen;
