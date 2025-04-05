import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import Slider from "@react-native-community/slider";
import { Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";
import RadioButtonRN from "radio-buttons-react-native";

const { width, height } = screenDimensions;

const Questions: React.FC = () => {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState(false);
  const [navigationBtn, setNavigationBtn] = useState(true);
  const [formData, setFormData] = useState({
    value: "",
    rageValue: 3,
    text: "",
    selectedFlavors: [] as string[],
  });

  const handleNextStep = () => {
    setStep((prevStep) => prevStep + 1);

    if (step === 4) {
      console.log(formData);
      setModal(true);
      setNavigationBtn(false);
    }
  };

  const handlePrevStep = () => {
    setStep((prevStep) => (prevStep > 1 ? prevStep - 1 : prevStep));
  };

  const handleSliderChange = (newValue: number) => {
    setFormData((prevData) => ({
      ...prevData,
      rageValue: Math.round(newValue),
    }));
  };

  const toggleCheckbox = (flavor: string) => {
    setFormData((prevData) => ({
      ...prevData,
      selectedFlavors: prevData.selectedFlavors.includes(flavor)
        ? prevData.selectedFlavors.filter((item) => item !== flavor)
        : [...prevData.selectedFlavors, flavor],
    }));
  };

  const handleback = () => {
    router.push("/research");
  };

  const onChangeText = (inputText: string) => {
    setFormData((prevData) => ({
      ...prevData,
      text: inputText,
    }));
  };

  const handleCloseModal = () => {
    setModal(false);
    router.push("/research");
  };

  const data = [
    {
      value: "0-1",
      label: "0-1",
    },
    {
      value: "2-3",
      label: "2-3",
    },
    {
      value: "3-4",
      label: "3-4",
    },
    {
      value: "4-5",
      label: "4-5",
    },
  ];

  return (
    <SafeAreaView style={{ backgroundColor: Colors.primaryColor, flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 30 }}>
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

            {/* Step Views */}
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
                <RadioButtonRN
                  data={data}
                  selectedBtn={(e: any) => {
                    setFormData((prevData) => ({
                      ...prevData,
                      value: e.value,
                    }));
                  }}
                />
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
                      formData.selectedFlavors.includes("Дуртай")
                        ? "checked"
                        : "unchecked"
                    }
                    onPress={() => toggleCheckbox("Дуртай")}
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
                      formData.selectedFlavors.includes("Пепси энгийн")
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
                      formData.selectedFlavors.includes("Пепси сахаргүй")
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
                      formData.selectedFlavors.includes("Пепси лайм")
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
                  height: "90%",
                }}
              >
                <Text>Асуулт 3 - 4</Text>
                <Text style={{ fontSize: 20, fontWeight: 600, marginTop: 20 }}>
                  Танд “Пепси сахаргүй амтанд үнэлгээ өгвөл ямар үнэлгээ өгөх
                  вэ? /1-10/
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
                      borderRadius: 13,
                      paddingHorizontal: 20,
                      paddingVertical: 15,
                    }}
                  >
                    {formData.rageValue}
                  </Text>

                  <View>
                    <Slider
                      style={{ width: 280, height: 80 }}
                      minimumValue={0}
                      maximumValue={10}
                      value={formData.rageValue}
                      onValueChange={handleSliderChange}
                      step={1}
                      minimumTrackTintColor={Colors.primaryColor}
                      maximumTrackTintColor="#BEBEBE"
                      thumbTintColor={Colors.primaryColor}
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
                }}
              >
                <Text>Асуулт 4 - 4</Text>
                <Text style={{ fontSize: 20, fontWeight: 500, marginTop: 20 }}>
                  Та “Пепси сахаргүй амтны талаар сэтгэгдлээ бичнэ үү ?
                </Text>
                <View style={{ flex: 1, alignItems: "center" }}>
                  <TextInput
                    multiline
                    numberOfLines={4}
                    onChangeText={onChangeText}
                    value={formData.text}
                    placeholder="Та сэтгэгдэл ээ бичнэ үү"
                    placeholderTextColor="rgba(0, 0, 0, 0.5)"
                    onSubmitEditing={Keyboard.dismiss}
                    style={{
                      marginTop: 30,
                      borderWidth: 1,
                      borderColor: "rgba(0, 0, 0, 0.1)",
                      backgroundColor: Colors.white,
                      padding: 16,
                      borderRadius: 16,
                      width: "100%",
                      height: 200,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  />
                </View>
              </View>
            )}

            {/* Modal */}
            {modal && (
              <View
                style={{
                  padding: 12,
                  marginTop: 12,
                  marginBottom: 12,
                  borderRadius: 15,
                  height: "80%",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2,
                }}
              >
                <View
                  style={{
                    backgroundColor: Colors.white,
                    paddingHorizontal: 50,
                    paddingVertical: 70,
                    alignItems: "center",
                    borderRadius: 25,
                    gap: 25,
                  }}
                >
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 45,
                        color: Colors.primaryColor,
                        fontWeight: "800",
                      }}
                    >
                      Танд
                    </Text>
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <Text
                        style={{
                          fontSize: 45,
                          color: Colors.primaryColor,
                          fontWeight: "800",
                        }}
                      >
                        1500
                      </Text>
                      <Image
                        source={require("@/assets/icons/coin1.png")}
                        style={{ width: 40, height: 40 }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 25,
                        color: Colors.primaryColor,
                        fontWeight: "800",
                      }}
                    >
                      Нэмэгдлээ
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={{
                      backgroundColor: Colors.primaryColor,
                      padding: 12,
                      borderRadius: 25,
                      marginTop: 20,
                      alignItems: "center",
                      justifyContent: "center",
                      width: 290,
                      height: 56,
                    }}
                    onPress={handleCloseModal}
                  >
                    <Text
                      style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}
                    >
                      Тиймээ 🎉
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation Buttons */}
        {navigationBtn && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              marginBottom: 20,
              padding: 8,
            }}
          >
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
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Questions;
