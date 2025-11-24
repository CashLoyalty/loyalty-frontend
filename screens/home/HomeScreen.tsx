import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  Platform,
  Keyboard,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import HomeBannerSlider from "@/components/home/home.banner.slider";
import Colors from "@/constants/Colors";
import { useToast } from "react-native-toast-notifications";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import usePointDetails from "@/hooks/usePointDetials";
import { SERVER_URI } from "@/utils/uri";
import { format } from "date-fns";
import Checkbox from "expo-checkbox";
import { useLocalSearchParams, router } from "expo-router";
import { useCameraPermissions } from "expo-camera";
import * as Notifications from "expo-notifications";
import { showLocalNotification } from "@/utils/localNotification";
import { useContext } from "react";
import { GlobalContext } from "@/components/globalContext";
import { useDisableGestures } from "@/hooks/useDisableGestures";
import IntroOnboarding from "@/components/home/IntroOnboarding";

const HomeScreen: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const toast = useToast();
  const [token, setToken] = useState<string>("");
  const [buttonSpinner, setButtonSpinner] = useState(false);
  const {
    pointDetails,
    loading: loadingPoints,
    fetchPointDetails,
    error: pointDetailsError,
  } = usePointDetails(SERVER_URI);
  const { terms } = useLocalSearchParams();
  const [modalVisibleTerms, setModalVisibleTerms] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const showTerms = String(terms).toLowerCase() === "true";
  const [permission, requestPermission] = useCameraPermissions();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const [notificationContent, setNotificationContent] =
    useState<Notifications.NotificationContent | null>(null);
  const { toastHeight } = useContext(GlobalContext);

  useDisableGestures();

  useEffect(() => {
    if (showTerms) setModalVisibleTerms(true);
  }, [showTerms]);

  const toggleModalTerms = () => {
    setModalVisibleTerms(!modalVisibleTerms);
  };

  const handleAccept = () => {
    if (isChecked) {
      toggleModalTerms();
    }
  };

  const fetchToken = async () => {
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
      } else {
        console.warn("No token found in AsyncStorage");
      }
    } catch (error) {
      console.log("Failed to fetch token: ", error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Foreground notification:", notification);
        setNotificationContent(notification.request.content);
        setShowNotification(true);
      }
    );
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (showNotification) {
      const timeout = setTimeout(() => {
        setShowNotification(false);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showNotification]);

  if (inputValue.length === 8) {
    Keyboard.dismiss();
  }

  const handleRegLotteryNum = () => {
    setModalVisible(true);
  };

  const handleQRLotteryNum = async () => {
    if (permission === null) {
      return;
    }

    if (!permission.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert(
          "Permission required",
          "We need permission to access your camera to scan a QR code."
        );
        return;
      }
    }

    router.push("/qrcodeReader");
  };
  const handleModalClose = () => {
    setModalVisible(false);
    setInputValue("");
  };

  const handleChangeText = (text: string) => {
    const upperCaseText = text.toUpperCase();
    if (upperCaseText.length <= 8) {
      setInputValue(upperCaseText);
    }
  };

  const handleSave = async () => {
    setButtonSpinner(true);
    if (inputValue.length < 8) {
      toast.show(`Бөглөөний код буруу байна`, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: {
          top: toastHeight,
        },
      });
      setButtonSpinner(false);
      return;
    }

    try {
      const response = await axios.post(
        `${SERVER_URI}/api/user/collectLotteryCode`,
        { code: inputValue },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.code === 0) {
        toast.show(`Бөглөө код амжилттай бүртгэгдлээ`, {
          type: "success",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
          style: {
            top: toastHeight,
          },
        });

        await fetchPointDetails();
      } else if (response.data.code !== 0) {
        let errorMessage = "Код буруу байна";
        if (response.data.title === "This code already registered.") {
          errorMessage = `Бүртгэгдсэн бөглөөний код байна`;
        } else if (response.data.title) {
          if (
            response.data.title.includes("Code is wrong") ||
            response.data.title.includes("Error: Code is wrong")
          ) {
            errorMessage = "Код буруу байна";
          } else {
            errorMessage = response.data.title;
          }
        }

        toast.show(errorMessage, {
          type: "danger",
          placement: "top",
          duration: 1500,
          animationType: "slide-in",
          style: {
            backgroundColor: Colors.red,
            top: toastHeight,
          },
        });
      }
    } catch (error) {
      toast.show(`Код илгээхэд алдаа гарлаа`, {
        type: "danger",
        placement: "top",
        duration: 1500,
        animationType: "slide-in",
        style: {
          backgroundColor: Colors.red,
          top: toastHeight,
        },
      });
    } finally {
      setModalVisible(false);
      setInputValue("");
      setButtonSpinner(false);
    }
  };

  interface PointDetail {
    imgUrl: string;
    phoneNumber: string;
    eventCode: string;
    point: number;
    brandName: string;
    lotteryCode: string;
    createdAt: string;
  }

  const renderPointDetail = ({ item }: { item: PointDetail }) => {
    let imageSource = require("@/assets/icons/pepsiIcon.png");

    switch (item.brandName) {
      case "sevenup":
        imageSource = require("@/assets/icons/sevenupIcon.png");
        break;
      case "pepsi":
        imageSource = require("@/assets/icons/pepsiIcon.png");
        break;
      case "mountaindew":
        imageSource = require("@/assets/icons/mountaindewIcon.png");
        break;
      case "lipton":
        imageSource = require("@/assets/icons/liptonIcon.png");
        break;
      case "mirinda":
        imageSource = require("@/assets/icons/mirindaIcon.png");
        break;
      case "sting":
        imageSource = require("@/assets/icons/stingIcon.png");
        break;
    }

    return (
      <View style={styles.lotteryItem}>
        <View style={styles.lotteryItemColumns}>
          <View style={styles.imageContainer}>
            <Image source={imageSource} style={styles.image} />
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.codeText}>{item.lotteryCode || "N/A"}</Text>
            <Text style={styles.dateText}>
              {item.createdAt
                ? format(new Date(item.createdAt), "yyyy-MM-dd HH:mm:ss")
                : "No Date"}
            </Text>
          </View>
          <View style={styles.scoreContainer}>
            <View style={styles.scoreBox}>
              <Text style={styles.scoreText}>{item.point || 0}</Text>
            </View>
            <Text style={{ fontSize: 12 }}>ОНОО</Text>
          </View>
        </View>
        <View style={styles.line} />
      </View>
    );
  };

  const renderEmptyComponent = () => {
    if (loadingPoints) {
      return null;
    }

    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>
          Одоогоор танд бүртгүүлсэн бөглөөний код байхгүй байна.
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.homeBannerSlider}>
        <HomeBannerSlider />
      </View>
      <View style={styles.lotteryList}>
        {loadingPoints ? (
          <View style={styles.loaderContainer}>
            <ActivityIndicator size="small" color={Colors.primaryColor} />
          </View>
        ) : (
          <FlatList
            data={pointDetails}
            renderItem={renderPointDetail}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={
              pointDetails.length === 0 ? styles.emptyListContainer : undefined
            }
            ListEmptyComponent={renderEmptyComponent}
          />
        )}
      </View>

      <View style={styles.registerLotteryContainer}>
        <View style={styles.lotteryNumber}>
          <TouchableOpacity
            onPress={handleRegLotteryNum}
            accessibilityLabel="Register Lottery Number"
          >
            <Image
              source={require("@/assets/icons/lotteryNumber.png")}
              style={{ width: 50, height: 50 }}
            />
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Код бүртгүүлэх</Text>
            <TextInput
              style={styles.input}
              placeholder="Бөглөөний дугаар"
              placeholderTextColor="#A1A1A1"
              value={inputValue}
              onChangeText={handleChangeText}
            />
            <View style={styles.modalButtonsContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleModalClose}
              >
                <Text style={styles.modalButtonText}>Буцах</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                {buttonSpinner ? (
                  <ActivityIndicator size="small" color={Colors.primaryColor} />
                ) : (
                  <Text style={styles.modalButtonText}>Илгээх</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Modal
        transparent={true}
        visible={modalVisibleTerms}
        onRequestClose={toggleModalTerms}
      >
        <View style={styles.modalContainerTerms}>
          <View style={styles.modalContentTerms}>
            <ScrollView>
              <View style={styles.section}>
                <Text style={styles.title}>Үйлчилгээний нөхцөл</Text>
                <Text style={styles.subTitle}>
                  “Fizz point ЛОЯАЛТИ ХӨТӨЛБӨР”-ИЙН ХЭРЭГЛЭГЧИЙН ГЭРЭЭ
                </Text>
                <Text style={styles.text}>
                  Тодорхойлолт: "Fizz point лояалти хөтөлбөр" гэдэг нь
                  “PepsiCO”-гийн албан ёсны онцгой эрхт монгол дахь савлан
                  үйлдвэрлэгч Жи эн Бевережис ХХК үнэнч хэрэглэгчээ урамшуулах
                  зорилгоор хэрэгжүүлж буй ЛОЯАЛТИ ХӨТӨЛБӨР юм.
                </Text>
                <Text style={styles.text}>
                  “Хэрэглэгч” гэж "Fizz point" хөтөлбөрийг хүлээн зөвшөөрсөн
                  болон үйлчилгээний нөхцөл, хэрэглэгчийн гэрээг хүлээн зөвшөөрч
                  аппликейшнд бүртгүүлсэн иргэнийг хэлнэ.
                </Text>
                <Text style={styles.warning}>
                  САНАМЖ: "Хэрэглэгч" гэж "Fizz point"-ыг хүлээн авсан болон
                  үйлчилгээний нөхцөл, хэрэглэгчийн гэрээг хүлээн зөвшөөрч
                  аппликейшн бүртгүүлсэн иргэнийг хэлнэ.
                </Text>
                <Text style={styles.text}>
                  Гэрээний хувилбар: 0.1 /2024.12.01/
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>
                  1. Fizz point цуглуулах, зарцуулах эрхийн талаар
                </Text>
                <Text style={styles.text}>
                  1.1 "Fizz point лояалти хөтөлбөр"-ийн Fizz point аппликейшн
                  болон www.pepsi.mn вэб сайт, "Fizz point" аппликейшн нь Жи Эн
                  Бевережис" ХХК -ийн өмч бөгөөд "Хэрэглэгч" нь "Fizz point"-ын
                  эзэмшигч байна.
                </Text>
                <Text style={styles.text}>
                  1.2 "Fizz point" худалдан авах болон Fizz point аппликейшнээр
                  нэвтрэн үйлчилгээний нөхцөл, хэрэглэгчийн гэрээтэй уншиж
                  танилцан хүлээн зөвшөөрснөөр гэрээ байгуулсанд тооцно.
                </Text>
                <Text style={styles.text}>
                  1.3 Хэрэглэгч лояалти хөтөлбөрт Fizz point оноо хэрэглэхдээ
                  доорх аргуудаар Fizz point оноо цуглуулах, зарцуулах боломжтой
                  байна.
                </Text>
                <Text style={styles.text}>1.3.1 Pepsi.mn вебсайт</Text>
                <Text style={styles.text}>1.3.2 Fizz point аппликейшн</Text>
                <Text style={styles.text}>
                  1.4 Хэрэглэгч Fizz point аппликейшнд нэвтэрснээр Fizz point
                  оноогоо цуглуулах, зарцуулах, гүйлгээний түүхээ харах,
                  үлдэгдэл оноогоо шалгах, урамшуулалт хөтөлбөрүүдэд хамрагдах,
                  бүтээгдэхүүн үйлчилгээний талаар мэдээлэл авах боломжтой
                  болно.
                </Text>
                <Text style={styles.text}>
                  1.5 Хэрэглэгч Fizz point оноогоо цуглуулах, зарцуулахдаа пин
                  код ашиглана. Пин код нь 4 оронтой тоо байна. Fizz point
                  аппликейшнд бүртгүүлэх тохиолдолд хэрэглэгч өөрийн хүссэн пин
                  кодоо үүсгэнэ.
                </Text>
                <Text style={styles.text}>
                  1.6 Хэрэглэгч худалдан авалт хийх үедээ 1 Fizz point оноо = 1
                  төгрөг зарчмаар Fizz point оноогоо зарцуулан, тухайн
                  бүтээгдэхүүн үйлчилгээний үнийн дүнгийн 100% хүртэлх дүнд
                  хөнгөлөлт эдлэх боломжтой.
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>2. Хэрэглэгчийн мэдээлэл:</Text>
                <Text style={styles.text}>
                  2.1 Fizz point аппликейшнд бүртгүүлэхэд таны дараах хувийн
                  мэдээллүүд шаардлагатай. Үүнд: Овог, нэр, регистрийн дугаар
                  болон гэрийн хаяг.
                </Text>
                <Text style={styles.text}>
                  2.2 "Fizz point лояалти хөтөлбөр"- үйлчлүүлэх боломжийг
                  нэмэгдүүлэх, бүтээгдэхүүн, үйлчилгээг сайжруулах, хөгжүүлэлт
                  хийх, урамшуулал санал болгох зорилгоор бид таны хувийн
                  мэдээллийг Fizz point -н данс эзэмшигч байх хугацаанд
                  цуглуулах, боловсруулах, ашиглах хамтрагч дамжуулж болно.
                </Text>
                <Text style={styles.text}>
                  2.3 Fizz point -н данс эзэмшигч байх эрхээ Fizz point -н
                  лавлах төвд холбогдон цуцлуулах боломжтой.
                </Text>
                <Text style={styles.text}>
                  2.4 Бид таны хувийн мэдээллийг нийтэд ил болгохгүй.
                </Text>
                <Text style={styles.text}>
                  2.5 Гэмт хэрэг, зөрчил шалган шийдвэрлэх ажиллагааны явцад
                  хууль сахиулах болон шүүх эрх мэдлийн байгууллагаас албан
                  ёсоор шаардсан тохиолдолд таны мэдээлэл, бүтээгдэхүүн
                  үйлчилгээ, хөнгөлөлт, урамшууллын түүхийн талаарх мэдээллийг
                  өгөх болно.
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>
                  3. Мэдээллийн аюулгүй байдал, нууцлалтай холбоотой үүрэг:
                </Text>
                <Text style={styles.text}>
                  3.1 Жи Эн Бевережис" ХХК нь лояалти системийн аюулгүй,
                  найдвартай хэвийн ажиллагааг хангах, мэдээллийн нууцлалыг
                  хамгаалах бүх талын арга хэмжээг авч ажиллана.
                </Text>
                <Text style={styles.text}>
                  3.2 Хэрэглэгч өөрийн мэдээллийн аюулгүй байдлыг хангах
                  үүрэгтэй ба хангаагүйн улмаас үүсэх эрсдэлийг Жи Эн Бевережис"
                  ХХК ХХК хариуцахгүй.
                </Text>
                <Text style={styles.text}>
                  3.3 Хэрэглэгч гүйлгээний пин кодоо бусдад алдахгүй байх,
                  дамжуулахгүй байх үүрэгтэй.
                </Text>
                <Text style={styles.text}>
                  3.4 Хэрэглэгч бүртгүүлсэн утасны дугаараа ашиглахаа больсон
                  эсвэл эзэмших эрхийг бусдад шилжүүлсэн тохиолдолд Fizz point
                  аппликейшнд өөрийн эрхээр нэвтрэн бүртгэлтэй утасны дугаарын
                  мэдээллээ шинэчлэх үүрэгтэй.
                </Text>
                <Text style={styles.text}>
                  3.5 Хэрэглэгч Fizz point бүртгэлээ бусдад ашиглуулахгүй,
                  дамжуулахгүй байх үүрэгтэй.
                </Text>
                <Text style={styles.text}>
                  3.6 Хэрэглэгч Fizz point нэвтрэх пин мартсан эсвэл гар утсаа
                  бусдад алдан Fizz point аппликейшн руу хандах боломжгүй болсон
                  тохиолдолд 7575 0000 лавлах төвд холбогдон Fizz point оноогоо
                  зарцуулах эрхийг түр хаалган бусдад зүй бусаар ашиглуулахаас
                  сэргийлэх үүрэгтэй.
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>4. Баталгаа өгөхгүй зүйлс:</Text>
                <Text style={styles.text}>
                  4.1 Хэрэглэгчийн бүртгүүлсэн мэдээллийн үнэн зөв байдал.
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>
                  5. Хэрэглэгчид хориглох зүйл:
                </Text>
                <Text style={styles.text}>
                  5.1 Fizz point зөвхөн өөрийн хувийн хэрэгцээнд ашиглах ёстой
                  ба бусдад дамжуулан худалдах, бусдад хэрэглүүлж мөнгө авах
                  зэрэг үйлчилгээний нөхцөлийг зөрчсөн үйлдэл хийхийг хориглоно.
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>Холбоо барих:</Text>
                <Text style={styles.text}>
                  "Жи Эн Бевережис" ХХК Хан-Уул, 3-хороо, Чингисийн өргөн
                  чөлөө-14, Пепси төв байр \17060\ Монгол Улс
                </Text>
                <Text style={styles.text}>
                  ГОМДОЛ, ХҮСЭЛТ ХҮЛЭЭН АВАХ: И-мэйл:
                  <Text
                    style={styles.link}
                    onPress={() => Linking.openURL("mailto:hello@pepsi.mn")}
                  >
                    hello@pepsi.mn
                  </Text>
                </Text>
                <Text style={styles.text}>Утас: 7575 0000</Text>
                <Text style={styles.text}>
                  Fizz point аппликейшн: Гомдол санал илгээх хэсэг
                </Text>
                <Text style={styles.text}>
                  “Fizz point ЛОЯАЛТИ ХӨТӨЛБӨР”-ИЙН ҮЙЛЧИЛГЭЭНИЙ НӨХЦӨЛ,
                  ХЭРЭГЛЭГЧИЙН ГЭРЭЭГ УНШИЖ ТАНИЛЦАН ХҮЛЭЭН ЗӨВШӨӨРЧ БАЙНА.
                </Text>
              </View>
            </ScrollView>
            <View>
              <View style={styles.bottomSection}>
                <Checkbox value={isChecked} onValueChange={setIsChecked} />
                <Text style={styles.checkboxText}>Зөвшөөрөх</Text>
              </View>
              <TouchableOpacity
                style={[
                  styles.acceptButton,
                  { backgroundColor: isChecked ? "blue" : "gray" },
                ]}
                disabled={!isChecked}
                onPress={handleAccept}
              >
                <Text style={styles.buttonText}>Зөвшөөрөх</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <IntroOnboarding />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  homeBannerSlider: {
    marginTop: 10,
  },
  lotteryList: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: Colors.white,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    padding: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  lotteryItem: {
    flex: 1,
  },
  lotteryItemColumns: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  imageContainer: {
    alignItems: "center",
    marginRight: 5,
  },
  image: {
    width: 40,
    height: 40,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  codeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  typeText: {
    fontSize: 12,
  },
  dateText: {
    fontSize: 12,
  },
  scoreContainer: {
    alignItems: "center",
    marginRight: 15,
  },
  scoreBox: {
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  scoreText: {
    color: Colors.white,
    fontWeight: "bold",
    fontSize: 12,
  },
  dotsContainer: {
    alignItems: "center",
  },
  dotsImage: {
    width: 30,
    height: 30,
  },
  line: {
    height: 1,
    backgroundColor: "gray",
    marginTop: 10,
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: Colors.primaryColor,
    borderRadius: 10,
    padding: 20,
    alignItems: "flex-start",
  },
  modalContainerTerms: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentTerms: {
    width: "100%",
    height: "60%",
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  bottomSection: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: "black",
    marginBottom: 15,
  },
  checkboxText: {
    fontSize: 14,
    marginLeft: 10,
  },
  acceptButton: {
    marginTop: 20,
    marginBottom: 20,
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.white,
    marginBottom: 10,
  },
  input: {
    width: "100%",
    height: 40,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: Colors.white,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors.white,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: Colors.primaryColor,
    fontSize: 16,
  },
  registerLotteryContainer: {
    position: "absolute",
    flexDirection: "row",
    right: 10,
    bottom: 20,
  },
  lotteryNumber: {
    width: 45,
    height: 45,
    right: 40,
    bottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  lotteryNumberQr: {
    width: 45,
    height: 45,
    right: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateContainer: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.primaryColor,
    marginBottom: 8,
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  warning: {
    fontSize: 14,
    color: "red",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 5,
  },
  link: {
    color: "blue",
    textDecorationLine: "underline",
  },
});

export default HomeScreen;
