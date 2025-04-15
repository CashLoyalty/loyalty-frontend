import Colors from "@/constants/Colors";
import RadioButtonRN from "radio-buttons-react-native";
import axios from "axios";
import { useToast } from "react-native-toast-notifications";
import { useEffect, useState } from "react";
import { Checkbox } from "react-native-paper";
import { SERVER_URI } from "@/utils/uri";
import { useLocalSearchParams, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Question = {
  id: string;
  type: string;
  text: string;
  options: string[];
};

export default function QuestionDetailPage() {
  const toast = useToast();
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState(false);
  const [question, setQuestion] = useState<Question[] | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [border, setBorder] = useState(true);
  const { id } = useLocalSearchParams();
  const [token, setToken] = useState("");

  useEffect(() => {
    const fetchToken = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) setToken(storedToken);
      console.log(storedToken);
    };
    fetchToken();
  }, []);

  useEffect(() => {
    if (id) {
      const fetchQuestionDetails = async () => {
        try {
          const response = await axios.get(
            `${SERVER_URI}/api/survey/${id}/questions`
          );
          setQuestion(response.data.response.questions);
        } catch (err) {
          console.error("Failed to load questions:", err);
        }
      };
      fetchQuestionDetails();
    }
  }, [id]);

  const handleNextStep = async () => {
    const currentQuestion = question?.[step - 1];
    if (!currentQuestion) return;

    const currentAnswer = formData[currentQuestion.id];

    const isEmptyMultipleChoice =
      currentQuestion.type === "multiple-choice" &&
      (!currentAnswer || currentAnswer.length === 0);

    const isEmptySingleOrText =
      (currentQuestion.type === "single-choice" ||
        currentQuestion.type === "text-input") &&
      !currentAnswer;

    if (isEmptyMultipleChoice || isEmptySingleOrText) {
      toast.show("Энэ асуултыг хариулаагүй байна.", {
        type: "danger",
        placement: "top",
      });
      return;
    }

    const isLastQuestion = step === question?.length;

    if (isLastQuestion) {
      try {
        const response = await axios.post(
          `${SERVER_URI}/api/user/survey/${id}`,
          {
            answers: formData, 
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Survey submitted:", response.data);
        setModal(true);
        Keyboard.dismiss();
      } catch (error) {
        console.error("Error submitting survey:", error);
        toast.show("Судалгаа илгээхэд алдаа гарлаа!", {
          type: "danger",
          placement: "top",
        });
      }
    } else {
      setStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setStep((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const handleback = () => router.push("/research");
  const handleCloseModal = () => {
    setModal(false);
    router.push("/research");
  };

  useEffect(() => {
    if (Platform.OS === "ios") {
      setBorder(true);
    } else if (Platform.OS === "android") {
      setBorder(false);
    }
  }, []);

  const renderQuestion = (q: Question) => {
    if (!q) return null;

    switch (q.type) {
      case "single-choice":
        return (
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              padding: 12,
              marginTop: 12,
              marginBottom: 12,
              borderRadius: 15,
              height: "85%",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#333" }}>
              Асуулт {step} - {question?.length}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 20 }}>
              {q.text}
            </Text>
            <RadioButtonRN
              data={q.options.map((item) => ({
                value: item,
                label: (
                  <Text style={{ fontSize: 18, fontWeight: "500" }}>
                    {item}
                  </Text>
                ),
              }))}
              selectedBtn={(e: any) =>
                setFormData((prev) => ({ ...prev, [q.id]: e.value }))
              }
              boxStyle={{
                borderWidth: 1,
                borderColor: "#ccc",
                padding: 10,
                marginTop: 20,
              }}
              activeColor={Colors.primaryColor}
              initial={
                formData[q.id] ? q.options.indexOf(formData[q.id]) + 1 : 0
              }
            />
          </View>
        );

      case "multiple-choice":
        return (
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              padding: 12,
              marginTop: 12,
              marginBottom: 12,
              borderRadius: 15,
              height: "85%",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#333" }}>
              Асуулт {step} - {question?.length}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 20 }}>
              {q.text}
            </Text>
            {q.options.map((option) => {
              const selected = formData[q.id]?.includes(option);
              return (
                <TouchableOpacity
                  key={option}
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    backgroundColor: Colors.white,
                    borderRadius: 6,
                    padding: 8,
                    marginTop: 15,
                    borderWidth: 1,
                    borderColor: selected ? Colors.primaryColor : "#ccc",
                    position: "relative",
                  }}
                  onPress={() => {
                    setFormData((prev) => {
                      const selectedOptions = prev[q.id] || [];
                      return {
                        ...prev,
                        [q.id]: selected
                          ? selectedOptions.filter((o: string) => o !== option)
                          : [...selectedOptions, option],
                      };
                    });
                  }}
                >
                  {border && (
                    <View
                      style={{
                        backgroundColor: selected
                          ? Colors.primaryColor
                          : Colors.white,
                        borderColor: selected ? Colors.primaryColor : "#ccc",
                        borderWidth: 1,
                        padding: 2,
                        borderRadius: 5,
                        position: "absolute",
                        height: 25,
                        width: 25,
                        marginLeft: 14,
                      }}
                    />
                  )}
                  <Checkbox
                    color="white"
                    status={selected ? "checked" : "unchecked"}
                  />
                  <Text style={{ fontSize: 18, fontWeight: "500" }}>
                    {option}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        );

      case "text-input":
        return (
          <View
            style={{
              backgroundColor: Colors.backgroundColor,
              padding: 12,
              marginTop: 12,
              marginBottom: 12,
              borderRadius: 15,
              height: "85%",
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#333" }}>
              Асуулт {step} - {question?.length}
            </Text>
            <Text style={{ fontSize: 20, fontWeight: "600", marginTop: 20 }}>
              {q.text}
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              onChangeText={(text) =>
                setFormData((prev) => ({ ...prev, [q.id]: text }))
              }
              value={formData[q.id] || ""}
              placeholder="Та сэтгэгдэл ээ бичнэ үү"
              placeholderTextColor="rgba(0, 0, 0, 0.5)"
              style={{
                marginTop: 30,
                borderWidth: 1,
                borderColor: "rgba(0, 0, 0, 0.1)",
                backgroundColor: Colors.white,
                padding: 16,
                borderRadius: 16,
                width: "100%",
                height: 150,
                textAlignVertical: "top",
              }}
              onSubmitEditing={Keyboard.dismiss}
            />
          </View>
        );

      default:
        return <Text>Unknown question type</Text>;
    }
  };

  return (
    <SafeAreaView style={{ backgroundColor: Colors.primaryColor, flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
          <View style={{ padding: 12 }}>
            {/* Header */}
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
              <Text style={{ color: "#fff", fontSize: 22 }}>
                Хэрэглээний судалгаа
              </Text>
            </View>

            {/* Render Question */}
            {question && renderQuestion(question[step - 1])}

            {/* Modal */}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginBottom: 20,
            padding: 8,
          }}
        >
          {step > 1 && (
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
          )}
          <TouchableOpacity
            style={{
              backgroundColor: Colors.backgroundColor,
              height: 50,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
            }}
            onPress={handleNextStep}
          >
            <Text style={{ fontWeight: "600" }}>Дараагийнх</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      {modal && (
        <View
          style={{
            position: "absolute", // Ensures the modal covers the screen
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent dark background
            justifyContent: "center", // Center the modal vertically
            alignItems: "center", // Center the modal horizontally
            zIndex: 999, // Make sure it appears on top
          }}
        >
          <View
            style={{
              backgroundColor: Colors.white, // White background for the modal content
              paddingHorizontal: 50,
              paddingVertical: 70,
              alignItems: "center",
              borderRadius: 25,
              gap: 25,
            }}
          >
            <Text
              style={{
                fontSize: 30,
                color: Colors.primaryColor,
                fontWeight: "800",
              }}
            >
              Танд
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
              }}
            >
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
                fontSize: 30,
                color: Colors.primaryColor,
                fontWeight: "800",
              }}
            >
              Нэмэгдлээ
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: Colors.primaryColor,
                padding: 12,
                borderRadius: 25,
                width: 290,
                height: 56,
                justifyContent: "center",
                alignItems: "center",
              }}
              onPress={handleCloseModal}
            >
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "600" }}>
                Тиймээ 🎉
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
