"use client";
import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput } from "react-native";
import Slider from "@react-native-community/slider";
import { RadioButton, Checkbox } from "react-native-paper"; // Import Checkbox from react-native-paper
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";

const { width, height } = screenDimensions;

const Questions: React.FC = () => {
  const [step, setStep] = useState(1);
  const [value, setValue] = useState<string>("");
  const [ragevalue, setRageValue] = useState(1);
  const [text, setText] = useState("");
  const [selectedFlavors, setSelectedFlavors] = useState<string[]>([]);

  const onChangeText = (inputText: any) => {
    setText(inputText);
  };

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);
    if (step === 5) {
      router.push("/research");
    }
  };

  const handlePrevStep = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const handleSliderChange = (newValue: any) => {
    const integerValue = Math.round(newValue);
    setRageValue(integerValue);
  };

  const toggleCheckbox = (flavor: string) => {
    setSelectedFlavors((prev) =>
      prev.includes(flavor)
        ? prev.filter((item) => item !== flavor)
        : [...prev, flavor]
    );
  };

  const handleback = () => {
    router.push("/research");
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.primaryColor }}>
      <View style={{ height: "100%", padding: 12 }}>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.white,
              width: 30,
              height: 30,
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleback}
          >
            <Image source={require("@/assets/icons/arrwleft.png")} />
          </TouchableOpacity>
          <Text style={{ color: "#ffffff", fontSize: 22 }}>
            Хэрэглээний судалгаа
          </Text>
        </View>
        {step === 1 && (
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              padding: 12,
              marginTop: 12,
              marginBottom: 12,
              borderRadius: 15,
              height: "80%",
            }}
          >
            <Text>Асуулт 1 - 4</Text>
            <Text style={{ fontSize: 20, fontWeight: 500, marginTop: 20 }}>
              Та өдөр дунжаар хэдэн ундаа уудаг вэ ?
            </Text>
            <RadioButton.Group
              onValueChange={(newValue) => setValue(newValue)}
              value={value}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.white,
                  borderRadius: 16,
                  padding: 4,
                  marginTop: 50,
                }}
              >
                <RadioButton color="blue" value="0-1" />
                <Text>0-1</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.white,
                  borderRadius: 16,
                  padding: 4,
                  marginTop: 8,
                }}
              >
                <RadioButton color="blue" value="2-3" />
                <Text>2-3</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  backgroundColor: Colors.white,
                  borderRadius: 16,
                  padding: 4,
                  marginTop: 8,
                }}
              >
                <RadioButton color="blue" value="3-4" />
                <Text>3-4</Text>
              </View>
            </RadioButton.Group>
          </View>
        )}
        {step === 2 && (
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              padding: 12,
              marginTop: 12,
              marginBottom: 12,
              borderRadius: 15,
              height: "80%",
            }}
          >
            <Text>Асуулт 2 - 4</Text>
            <Text style={{ fontSize: 20, fontWeight: 500, marginTop: 20 }}>
              Та “Пепси” аль амтанд дуртай вэ?
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.white,
                borderRadius: 16,
                padding: 8,
                marginTop: 20,
              }}
            >
              <Checkbox
                status={
                  selectedFlavors.includes("Дуртай") ? "checked" : "unchecked"
                }
                onPress={() => toggleCheckbox("Дуртай")}
              />
              <Text>Дуртай</Text>
            </View>
            {/* Add more checkbox options here */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.white,
                borderRadius: 16,
                padding: 8,
                marginTop: 8,
              }}
            >
              <Checkbox
                status={
                  selectedFlavors.includes("Пепси энгийн")
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => toggleCheckbox("Пепси энгийн")}
              />
              <Text>Пепси энгийн</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.white,
                borderRadius: 16,
                padding: 8,
                marginTop: 8,
              }}
            >
              <Checkbox
                status={
                  selectedFlavors.includes("Пепси сахаргүй")
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => toggleCheckbox("Пепси сахаргүй")}
              />
              <Text>Пепси сахаргүй</Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: Colors.white,
                borderRadius: 16,
                padding: 8,
                marginTop: 8,
              }}
            >
              <Checkbox
                status={
                  selectedFlavors.includes("Пепси лайм")
                    ? "checked"
                    : "unchecked"
                }
                onPress={() => toggleCheckbox("Пепси лайм")}
              />
              <Text>Пепси лайм</Text>
            </View>
          </View>
        )}
        {step === 3 && (
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              padding: 12,
              marginTop: 12,
              marginBottom: 12,
              borderRadius: 15,
              height: "80%",
            }}
          >
            <Text>Асуулт 3 - 4</Text>
            <Text style={{ fontSize: 20, fontWeight: 600, marginTop: 20 }}>
              Танд “Пепси сахаргүй амтанд үнэлгээ өгвөл ямар үнэлгээ өгөх вэ ?
              /1-10/
            </Text>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: Colors.white,
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  width: 300,
                  maxHeight: 200,
                  borderRadius: 16,
                }}
              >
                <Image
                  source={require("@/assets/icons/PEPZERO.png")}
                  style={{ width: 62, height: 146 }}
                />
              </View>
            </View>

            <View style={{ padding: 20, alignItems: "center" }}>
              <Text
                style={{
                  backgroundColor: Colors.white,
                  fontSize: 30,
                  fontWeight: 600,
                  justifyContent: "center",
                  alignItems: "center",
                  padding: 15,
                  borderRadius: 13,
                }}
              >
                {ragevalue}
              </Text>

              <View>
                <Slider
                  style={{ width: 300, height: 80 }}
                  minimumValue={1}
                  maximumValue={10}
                  value={ragevalue}
                  onValueChange={handleSliderChange}
                  step={1}
                />
              </View>
            </View>
          </View>
        )}
        {step === 4 && (
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              padding: 12,
              marginTop: 12,
              marginBottom: 12,
              borderRadius: 15,
              height: "80%",
              flex: 1,
              alignItems: "center",
            }}
          >
            <Text>Асуулт 4 - 4</Text>
            <Text style={{ fontSize: 20, fontWeight: 500, marginTop: 20 }}>
              Та “Пепси сахаргүй амтны талаар сэтгэгдлээ бичнэ үү ?
            </Text>
            <View style={{ flex: 1 }}>
              <TextInput
                editable
                multiline
                numberOfLines={4}
                maxLength={40}
                onChangeText={onChangeText}
                value={text}
                placeholder="Та сэтгэгдэл ээ бичнэ үү"
                placeholderTextColor="rgba(0, 0, 0, 0.5)"
                style={{
                  marginTop: 30,
                  borderWidth: 1,
                  borderColor: "rgba(0, 0, 0, 0.1)",
                  backgroundColor: Colors.white,
                  padding: 16,
                  borderRadius: 16,
                  width: 300,
                  height: 200,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </View>
          </View>
        )}
        {step === 5 && (
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              padding: 12,
              marginTop: 12,
              marginBottom: 12,
              borderRadius: 15,
              height: "80%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontSize: 32,
                color: Colors.primaryColor,
                fontWeight: 600,
              }}
            >
              Танд 1500 Нэмэгдлээ
            </Text>
          </View>
        )}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <TouchableOpacity
            style={{
              width: 55,
              height: 50,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: Colors.backgroundColor,
            }}
            onPress={handlePrevStep}
          >
            <Image
              source={require("@/assets/icons/arrow-left.png")}
              style={{ width: 23, height: 23 }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Colors.backgroundColor,
              height: 50,
              maxWidth: "100%",
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
            onPress={handleNextStep}
          >
            <Text style={{ maxWidth: "100%", fontWeight: 600 }}>
              Дараагийнх
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Questions;
