import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Text, Animated, Dimensions } from "react-native";

interface Snowflake {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  startY: number;
  opacity: number;
}

const SCREEN_WIDTH = Dimensions.get("window").width;
const SCREEN_HEIGHT = Dimensions.get("window").height;
const SNOWFLAKE_COUNT = 50;

export default function SnowEffect() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    // Generate snowflakes with random positions and properties
    const generateSnowflakes = () => {
      const sizes = [8, 10, 11]; // Static sizes: 5px, 10px, 15px
      const flakes: Snowflake[] = [];
      for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
        flakes.push({
          id: i,
          x: Math.random() * SCREEN_WIDTH,
          size: sizes[Math.floor(Math.random() * sizes.length)], // Randomly pick from 3 static sizes
          duration: Math.random() * 10000 + 8500, // Random duration between 8.5-17 seconds
          delay: 0, // No delay - start immediately
          startY: Math.random() * -SCREEN_HEIGHT * 2, // Random start position above screen
          opacity: 0.5 + Math.random() * 0.5, // Random opacity between 0.5-1.0
        });
      }
      return flakes;
    };

    setSnowflakes(generateSnowflakes());
  }, []);

  return (
    <View style={styles.container} pointerEvents="none">
      {snowflakes.map((flake) => (
        <AnimatedSnowflake key={flake.id} flake={flake} />
      ))}
    </View>
  );
}

function AnimatedSnowflake({ flake }: { flake: Snowflake }) {
  const animatedValue = useRef(new Animated.Value(flake.startY)).current;
  const xOffset = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Vertical falling animation - continuous loop without gaps
    const endValue = SCREEN_HEIGHT * 2; // Fall well past the screen
    let isActive = true;

    const startAnimation = () => {
      if (!isActive) return;

      animatedValue.setValue(flake.startY); // Reset to start position
      Animated.timing(animatedValue, {
        toValue: endValue,
        duration: flake.duration,
        useNativeDriver: true,
      }).start(() => {
        if (isActive) {
          startAnimation(); // Restart immediately when done
        }
      });
    };

    // Start the animation loop
    startAnimation();

    // Subtle horizontal swaying animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(xOffset, {
          toValue: 15,
          duration: 6000,
          useNativeDriver: true,
        }),
        Animated.timing(xOffset, {
          toValue: -15,
          duration: 6000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <Animated.View
      style={[
        styles.snowflake,
        {
          left: flake.x,
          width: flake.size + 2,
          height: flake.size + 4,
          transform: [{ translateY: animatedValue }, { translateX: xOffset }],
          opacity: flake.opacity,
        },
      ]}
    >
      <Text style={[styles.snowflakeText, { fontSize: flake.size }]}>❄</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 9999,
  },
  snowflake: {
    position: "absolute",
    top: 0,
  },
  snowflakeText: {
    color: "#FFFFFF",
  },
});
