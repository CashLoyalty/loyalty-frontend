"use client";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  Easing,
  Image,
} from "react-native";
import Svg, { Path, G, Text as SvgText } from "react-native-svg";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SERVER_URI } from "@/utils/uri";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Colors from "@/constants/Colors";
import Ionicons from "react-native-vector-icons/Ionicons";
interface Segment {
  id: string;
  label: string;
  color: string;
}

const { width } = Dimensions.get("window");
const WHEEL_SIZE = 350;
const CENTER = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2;
const colorPalette = ["#001571", "#1443FF"];

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number
) {
  const angleInRadians = (angleInDegrees - 90) * (Math.PI / 180.0);
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function createSegmentPath(startAngle: number, endAngle: number): string {
  const start = polarToCartesian(CENTER, CENTER, RADIUS, endAngle);
  const end = polarToCartesian(CENTER, CENTER, RADIUS, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

  return [
    `M ${CENTER} ${CENTER}`,
    `L ${start.x} ${start.y}`,
    `A ${RADIUS} ${RADIUS} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
    "Z",
  ].join(" ");
}

export default function Spin() {
  const [segments, setSegments] = useState<Segment[]>([]);
  const [lottoCount, setLottoCount] = useState<number>(0);
  const [giftName, setGiftName] = useState("");
  const [showModal, setShowModal] = useState(false);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [isSpinning, setIsSpinning] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scaleLoopRef = useRef<Animated.CompositeAnimation | null>(null); // 👈 Store loop animation

  const navigation = useNavigation();

  const angleStep = segments.length > 0 ? 360 / segments.length : 0;

  const checkLotto = async (): Promise<void> => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const response = await axios.get(`${SERVER_URI}/api/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLottoCount(response.data.response.lottoCount);
    } catch (error) {
      console.log("Error fetching lotto:", error);
    }
  };

  useEffect(() => {
    checkLotto();
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${SERVER_URI}/api/gift?type=SPIN&status=ACTIVE`
        );
        const items = response.data.response;
        const extendedColorPalette: string[] = [];
        for (let i = 0; i < items.length; i++) {
          extendedColorPalette.push(colorPalette[i % colorPalette.length]);
        }

        const formattedData: Segment[] = items.map(
          (item: any, index: number) => ({
            id: item.id,
            label: item.name,
            color: extendedColorPalette[index],
          })
        );

        setSegments(formattedData);
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleSpin = async () => {
    if (isSpinning || segments.length === 0) return;

    setIsSpinning(true);

    // 👉 Stop pulsing animation
    scaleLoopRef.current?.stop();

    const token = await AsyncStorage.getItem("token");

    try {
      const spinResponse = await axios.post(
        `${SERVER_URI}/api/user/spin`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const winningGift = spinResponse.data.response.name;
      setGiftName(winningGift);

      const winningIndex = segments.findIndex((s) => s.label === winningGift);
      if (winningIndex === -1) {
        setIsSpinning(false);
        return;
      }

      const targetAngle = 360 - angleStep * winningIndex - angleStep / 2;
      const totalRotation = 360 * 3 + targetAngle;

      Animated.timing(rotateAnim, {
        toValue: totalRotation,
        duration: 5000,
        useNativeDriver: true,
        easing: Easing.out(Easing.cubic),
      }).start(() => {
        rotateAnim.setValue(totalRotation % 360);
        setIsSpinning(false);
        setShowModal(true);

        // 👉 Restart pulsing animation after spin
        const loop = Animated.loop(
          Animated.sequence([
            Animated.timing(scaleAnim, {
              toValue: 1.1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
          ])
        );
        loop.start();
        scaleLoopRef.current = loop;
      });
    } catch (error) {
      console.log("Spin error:", error);
      setIsSpinning(false);
      // 🛠 Optional: restart pulse if spin fails
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      scaleLoopRef.current = loop;
    }
  };

  const interpolatedRotate = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    scaleLoopRef.current = loop; // 👈 Save it so we can stop it later
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Semi-transparent background covering the whole window */}
      <View style={styles.overlayBackground} />

      <TouchableOpacity
        onPress={handleBack}
        style={{ position: "absolute", top: 60, right: 20, zIndex: 10 }}
      >
        <Text style={{ color: "white" }}>Хаах</Text>
      </TouchableOpacity>

      <Image source={require("@/assets/spin/bg.png")} style={styles.bg} />
      <Image source={require("@/assets/spin/light.png")} style={styles.light} />
      <Image source={require("@/assets/spin/red.png")} style={styles.red} />
      <Image
        source={require("@/assets/spin/zuun2.png")}
        style={[styles.zuun, { transform: [{ scale: 0.7 }] }]}
      />
      <Image
        source={require("@/assets/spin/baruun2.png")}
        style={[styles.baruun, { transform: [{ scale: 0.7 }] }]}
      />

      <Animated.View
        style={{
          position: "absolute",
          transform: [{ rotate: interpolatedRotate }],
          width: WHEEL_SIZE + 30,
          height: WHEEL_SIZE + 30,
          alignItems: "center",
          justifyContent: "center",
          borderRadius: (WHEEL_SIZE + 30) / 2,
          borderWidth: 15,
          borderColor: "black",
          backgroundColor: "transparent",
          zIndex: 5,
        }}
      >
        <Svg width={WHEEL_SIZE} height={WHEEL_SIZE}>
          <G>
            {segments.map((item, index) => {
              const startAngle = angleStep * index;
              const endAngle = startAngle + angleStep;
              const path = createSegmentPath(startAngle, endAngle);
              const labelAngle = startAngle + angleStep / 2;
              const labelPos = polarToCartesian(
                CENTER,
                CENTER,
                RADIUS * 0.6,
                labelAngle
              );
              return (
                <G key={item.id}>
                  <Path d={path} fill={item.color} />
                  <SvgText
                    x={labelPos.x}
                    y={labelPos.y}
                    fontFamily="Inter"
                    fill="white"
                    fontSize="11"
                    fontWeight="bold"
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    transform={`rotate(${labelAngle + 90 + 180}, ${
                      labelPos.x
                    }, ${labelPos.y})`}
                  >
                    {item.label}
                  </SvgText>
                </G>
              );
            })}
          </G>
        </Svg>

        {/* Dots (already rotating with the wheel) */}
        {segments.map((item, index) => {
          const startAngle = angleStep * index;
          const dotDistance = RADIUS + 7;

          const dot1Angle = startAngle + angleStep * 0.25;
          const dot2Angle = startAngle + angleStep * 0.75;

          const dot1 = polarToCartesian(CENTER, CENTER, dotDistance, dot1Angle);
          const dot2 = polarToCartesian(CENTER, CENTER, dotDistance, dot2Angle);

          return (
            <React.Fragment key={`dots-${item.id}`}>
              <View style={dotStyle(dot1.x - 2, dot1.y - 2, "#FFFFFF")} />
              <View style={dotStyle(dot2.x - 2, dot2.y - 2, "#FF0000")} />
            </React.Fragment>
          );
        })}
      </Animated.View>

      <TouchableOpacity
        style={{ position: "absolute", zIndex: 10 }}
        onPress={handleSpin}
        disabled={isSpinning}
      >
        <Animated.Image
          source={require("@/assets/spin/pepLogo.png")}
          style={[
            styles.centerImage,
            {
              transform: [
                { translateX: -40 },
                { translateY: -40 },
                { scale: scaleAnim },
              ],
            },
          ]}
        />
      </TouchableOpacity>

      <Text style={styles.topLabel}>
        {lottoCount > 0
          ? `Танд ${lottoCount} удаа эргүүлэх эрх байна`
          : "Эргүүлэх эрхгүй"}
      </Text>

      {showModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalText}>🎉 You won: {giftName}!</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowModal(false)}
            >
              <Text style={styles.modalButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const dotStyle = (x: number, y: number, color: string) => ({
  position: "absolute" as const,
  width: 8,
  height: 8,
  borderRadius: 5,
  backgroundColor: color,
  top: y - 2,
  left: x - 2,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontFamily: "Inter",
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  centerImage: {
    position: "absolute",
    width: 80,
    height: 80,
    left: "50%",
    top: "50%",
    transform: "translate(-50%, -50%)",
  },
  conainerCenterImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  overlayBackground: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    zIndex: 4,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 6,
  },
  zuun: {
    position: "absolute",
    zIndex: 2,
  },
  baruun: {
    position: "absolute",
    zIndex: 2,
  },
  topLabel: {
    position: "absolute",
    fontSize: 12,
    color: Colors.white,
    fontWeight: "bold",
    top: "73%",
    zIndex: 4,
  },
  bg: {
    width: 700,
    height: 700,
    position: "absolute",
    resizeMode: "contain",
    zIndex: 0,
  },
  light: {
    width: 1000,
    height: 1000,
    position: "absolute",
    zIndex: 1,
  },
  red: {
    width: 25,
    height: 25,
    position: "absolute",
    top: "27%",
    left: "58.8%",
    transform: "translateX(-50%)",
    zIndex: 10,
  },
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    width: "80%",
  },
  modalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  modalButton: {
    backgroundColor: "#1443FF",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
