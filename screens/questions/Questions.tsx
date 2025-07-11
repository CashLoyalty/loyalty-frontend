import React, { useEffect, useState } from "react";
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
import { useToast } from "react-native-toast-notifications";
import Slider from "@react-native-community/slider";
import { Checkbox } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { screenDimensions } from "@/constants/constans";
import { router } from "expo-router";
import RadioButtonRN from "radio-buttons-react-native";
import { useContext } from "react";
import { GlobalContext } from "@/components/globalContext";

const { width, height } = screenDimensions;

const Questions: React.FC = () => {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState(false);
  const [border, setBorder] = useState(true);
  const [navigationBtn, setNavigationBtn] = useState(false);
  const [navigationFirstBtn, setNavigationFirstBtn] = useState(true);
  const { toastHeight } = useContext(GlobalContext);
  const [formData, setFormData] = useState({
    value: "",
    rageValue: 3,
    text: "",
    selectedFlavors: [] as string[],
  });

  const handleNextStep = () => {
    // Step 1 Validation
    if (step === 1 && formData.value === "") {
      toast.show("Та асуулт 1-г хариулаагүй байна.", {
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

    // Step 2 Validation
    if (step === 2 && formData.selectedFlavors.length === 0) {
      toast.show("Та амт сонгоогүй байна.", {
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

    setStep((prevStep) => {
      const newStep = prevStep + 1;
      if (newStep === 1) {
        setNavigationFirstBtn(true);
        setNavigationBtn(false);
      } else {
        setNavigationFirstBtn(false);
        setNavigationBtn(true);
      }
      return newStep;
    });

    if (step === 4) {
      console.log(formData);
      setModal(true);
      setNavigationBtn(false);
    }
  };

  const handlePrevStep = () => {
    setStep((prevStep) => {
      const newStep = prevStep > 1 ? prevStep - 1 : prevStep;
      if (newStep === 1) {
        setNavigationFirstBtn(true);
        setNavigationBtn(false);
      } else {
        setNavigationFirstBtn(false);
        setNavigationBtn(true);
      }
      return newStep;
    });
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

  useEffect(() => {
    if (Platform.OS === "ios") {
      setBorder(true);
    } else if (Platform.OS === "android") {
      setBorder(false);
    }
  }, []);

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
                <View style={{ marginTop: 20 }}>
                  <RadioButtonRN
                    data={data.map((item) => ({
                      ...item,
                      label: (
                        <Text style={{ fontSize: 20, fontWeight: 600 }}>
                          {item.label}
                        </Text>
                      ),
                    }))}
                    selectedBtn={(e: any) => {
                      setFormData((prevData) => ({
                        ...prevData,
                        value: e.value,
                      }));
                    }}
                  />
                </View>
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

                <View style={{ marginTop: 20 }}>
                  {[
                    "Пепси энгийн",
                    "Пепси сахаргүй",
                    "Пепси лайм",
                    "Пепси ванила",
                  ].map((flavor) => (
                    <TouchableOpacity
                      key={flavor}
                      style={{
                        flexDirection: "row",
                        gap: 8,
                        alignItems: "center",
                        backgroundColor: Colors.white,
                        borderRadius: 6,
                        padding: 8,
                        marginTop: 15,
                        borderWidth: 1,
                        borderColor: formData.selectedFlavors.includes(flavor)
                          ? Colors.primaryColor
                          : "#ccc",
                      }}
                      onPress={() => toggleCheckbox(flavor)}
                    >
                      {border && (
                        <View
                          style={{
                            backgroundColor: formData.selectedFlavors.includes(
                              flavor
                            )
                              ? Colors.primaryColor
                              : "",
                            borderColor: formData.selectedFlavors.includes(
                              flavor
                            )
                              ? Colors.primaryColor
                              : "#C6C9CC",
                            borderWidth: 1,
                            padding: 2,
                            borderRadius: 5,
                            position: "absolute",
                            height: 25,
                            width: 25,
                            marginLeft: 14,
                          }}
                        ></View>
                      )}
                      <Checkbox
                        color="white"
                        status={
                          formData.selectedFlavors.includes(flavor)
                            ? "checked"
                            : "unchecked"
                        }
                        onPress={() => toggleCheckbox(flavor)}
                      />
                      <Text style={{ fontSize: 20, fontWeight: 600 }}>
                        {flavor}
                      </Text>
                    </TouchableOpacity>
                  ))}
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
                      borderRadius: 8,
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
                      height: 150,
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
        {/* Bottom First Navigation Buttons */}
        {navigationFirstBtn && (
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
