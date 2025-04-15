import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, Button } from "react-native";
import { Camera } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";

export default function QrcodeReaderScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState("");

  type BarCodeScannerResult = {
    type: string;
    data: string;
  };

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      console.log("status : " + status);
      setHasPermission(status === "granted");
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }: BarCodeScannerResult) => {
    setScanned(true);
    setQrData(data);
  };

  if (hasPermission === null) {
    return <Text>Төхөөрөмжийн эрхийг хүлээн авч байна...</Text>;
  }
  if (hasPermission === false) {
    return <Text>Камераа ашиглах эрхгүй байна. Тохиргоогоо шалгаарай.</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>QR код уншигч</Text>
      {scanned && (
        <Button
          title={"QR кодыг дахин унших"}
          onPress={() => setScanned(false)}
        />
      )}
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
  },
});
