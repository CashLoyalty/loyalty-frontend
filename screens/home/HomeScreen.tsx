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
import Header from "@/components/header/header";
import HeaderSecond from "@/components/headerSecond/headerSecond";
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
  } = usePointDetails(SERVER_URI);
  const { terms } = useLocalSearchParams();
  const [modalVisibleTerms, setModalVisibleTerms] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const showTerms = String(terms).toLowerCase() === "true";
  const [permission, requestPermission] = useCameraPermissions();

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
      console.error("Failed to fetch token: ", error);
    }
  };

  useEffect(() => {
    fetchToken();
  }, []);

  if (inputValue.length === 8) {
    Keyboard.dismiss();
  }

  const handleRegLotteryNum = () => {
    setModalVisible(true);
  };

  const handleQRLotteryNum = async () => {
    console.log("Permission object:", permission);

    if (permission === null) {
      // Permissions state not yet loaded
      console.log("Permission not loaded yet");
      return;
    }

    if (!permission.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        console.log("Camera permission denied");
        Alert.alert(
          "Permission required",
          "We need permission to access your camera to scan a QR code."
        );
        return;
      }
    }

    router.push("/qrcodeReader"); // navigate if permission granted
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
        type: "info",
        placement: "center",
        duration: 4000,
        animationType: "slide-in",
        style: {
          backgroundColor: Colors.primaryColor,
        },
      });
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
      console.log(response.data);

      if (response.data.title === "This code already registered.") {
        toast.show(`Бүртгэгдсэн бөглөө код байна`, {
          type: "warning",
          placement: "center",
          duration: 4000,
          animationType: "slide-in",
        });
      }

      if (response.data.code === 0) {
        toast.show(`Бөглөө код амжилттай бүртгэгдлээ`, {
          type: "success",
          placement: "center",
          duration: 4000,
          animationType: "slide-in",
        });

        await fetchPointDetails();
      }
    } catch (error) {
      toast.show(`Код илгээхэд алдаа гарлаа`, {
        type: "danger",
        placement: "center",
        duration: 4000,
        animationType: "slide-in",
        style: {
          backgroundColor: Colors.primaryColor,
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
            <Text style={styles.typeText}>СУГАЛАА</Text>
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
          <View style={styles.dotsContainer}>
            <Image
              source={require("@/assets/icons/dots.png")}
              style={styles.dotsImage}
            />
          </View>
        </View>
        <View style={styles.line} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header />
      <HeaderSecond />
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
          />
        )}
      </View>

      <View style={styles.registerLotteryContainer}>
        <View style={styles.lotteryNumber}>
          <TouchableOpacity
            onPress={handleRegLotteryNum}
            accessibilityLabel="Register Lottery Number"
          >
            <Image source={require("@/assets/icons/lotteryNumber.png")} />
          </TouchableOpacity>
        </View>
        <View style={styles.lotteryNumberQr}>
          <TouchableOpacity
            onPress={handleQRLotteryNum}
            accessibilityLabel="Scan Lottery QR Code"
          >
            <Image source={require("@/assets/icons/lotteryNumberQR.png")} />
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
              <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                {buttonSpinner ? (
                  <ActivityIndicator size="small" color={Colors.primaryColor} />
                ) : (
                  <Text style={styles.modalButtonText}>Илгээх</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleModalClose}
              >
                <Text style={styles.modalButtonText}>Буцах</Text>
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
                  “PEPSI PLUS ЛОЯАЛТИ ХӨТӨЛБӨР”-ИЙН ХЭРЭГЛЭГЧИЙН ГЭРЭЭ
                </Text>
                <Text style={styles.text}>
                  Тодорхойлолт: "PEPSI PLUS лояалти хөтөлбөр" гэдэг нь
                  “PepsiCO”-гийн албан ёсны онцгой эрхт монгол дахь савлан
                  үйлдвэрлэгч Жи эн Бевережис ХХК үнэнч хэрэглэгчээ урамшуулах
                  зорилгоор хэрэгжүүлж буй ЛОЯАЛТИ ХӨТӨЛБӨР юм.
                </Text>
                <Text style={styles.text}>
                  “Хэрэглэгч” гэж "PEPSI PLUS" хөтөлбөрийг хүлээн зөвшөөрсөн
                  болон үйлчилгээний нөхцөл, хэрэглэгчийн гэрээг хүлээн зөвшөөрч
                  аппликейшнд бүртгүүлсэн иргэнийг хэлнэ.
                </Text>
                <Text style={styles.warning}>
                  САНАМЖ: "Хэрэглэгч" гэж "PEPSI PLUS"-ыг хүлээн авсан болон
                  үйлчилгээний нөхцөл, хэрэглэгчийн гэрээг хүлээн зөвшөөрч
                  аппликейшн бүртгүүлсэн иргэнийг хэлнэ.
                </Text>
                <Text style={styles.text}>
                  Гэрээний хувилбар: 0.1 /2024.12.01/
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>
                  1. PEPSI PLUS цуглуулах, зарцуулах эрхийн талаар
                </Text>
                <Text style={styles.text}>
                  1.1 "PEPSI PLUS лояалти хөтөлбөр"-ийн PEPSI PLUS аппликейшн
                  болон www.pepsi.mn вэб сайт, "PEPSI PLUS" аппликейшн нь Жи Эн
                  Бевережис" ХХК -ийн өмч бөгөөд "Хэрэглэгч" нь "PEPSI PLUS"-ын
                  эзэмшигч байна.
                </Text>
                <Text style={styles.text}>
                  1.2 "PEPSI PLUS" худалдан авах болон PEPSI PLUS аппликейшнээр
                  нэвтрэн үйлчилгээний нөхцөл, хэрэглэгчийн гэрээтэй уншиж
                  танилцан хүлээн зөвшөөрснөөр гэрээ байгуулсанд тооцно.
                </Text>
                <Text style={styles.text}>
                  1.3 Хэрэглэгч лояалти хөтөлбөрт PEPSI PLUS оноо хэрэглэхдээ
                  доорх аргуудаар PEPSI PLUS оноо цуглуулах, зарцуулах боломжтой
                  байна.
                </Text>
                <Text style={styles.text}>1.3.1 Pepsi.mn вебсайт</Text>
                <Text style={styles.text}>1.3.2 PEPSI PLUS аппликейшн</Text>
                <Text style={styles.text}>
                  1.4 Хэрэглэгч PEPSI PLUS аппликейшнд нэвтэрснээр PEPSI PLUS
                  оноогоо цуглуулах, зарцуулах, гүйлгээний түүхээ харах,
                  үлдэгдэл оноогоо шалгах, урамшуулалт хөтөлбөрүүдэд хамрагдах,
                  бүтээгдэхүүн үйлчилгээний талаар мэдээлэл авах боломжтой
                  болно.
                </Text>
                <Text style={styles.text}>
                  1.5 Хэрэглэгч PEPSI PLUS оноогоо цуглуулах, зарцуулахдаа пин
                  код ашиглана. Пин код нь 4 оронтой тоо байна. PEPSI PLUS
                  аппликейшнд бүртгүүлэх тохиолдолд хэрэглэгч өөрийн хүссэн пин
                  кодоо үүсгэнэ.
                </Text>
                <Text style={styles.text}>
                  1.6 Хэрэглэгч худалдан авалт хийх үедээ 1 PEPSI PLUS оноо = 1
                  төгрөг зарчмаар PEPSI PLUS оноогоо зарцуулан, тухайн
                  бүтээгдэхүүн үйлчилгээний үнийн дүнгийн 100% хүртэлх дүнд
                  хөнгөлөлт эдлэх боломжтой.
                </Text>
              </View>
              <View style={styles.section}>
                <Text style={styles.subtitle}>2. Хэрэглэгчийн мэдээлэл:</Text>
                <Text style={styles.text}>
                  2.1 PEPSI PLUS аппликейшнд бүртгүүлэхэд таны дараах хувийн
                  мэдээллүүд шаардлагатай. Үүнд: Овог, нэр, регистрийн дугаар
                  болон гэрийн хаяг.
                </Text>
                <Text style={styles.text}>
                  2.2 "PEPSI PLUS лояалти хөтөлбөр"- үйлчлүүлэх боломжийг
                  нэмэгдүүлэх, бүтээгдэхүүн, үйлчилгээг сайжруулах, хөгжүүлэлт
                  хийх, урамшуулал санал болгох зорилгоор бид таны хувийн
                  мэдээллийг PEPSI PLUS -н данс эзэмшигч байх хугацаанд
                  цуглуулах, боловсруулах, ашиглах хамтрагч дамжуулж болно.
                </Text>
                <Text style={styles.text}>
                  2.3 PEPSI PLUS -н данс эзэмшигч байх эрхээ PEPSI PLUS -н
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
                  эсвэл эзэмших эрхийг бусдад шилжүүлсэн тохиолдолд PEPSI PLUS
                  аппликейшнд өөрийн эрхээр нэвтрэн бүртгэлтэй утасны дугаарын
                  мэдээллээ шинэчлэх үүрэгтэй.
                </Text>
                <Text style={styles.text}>
                  3.5 Хэрэглэгч PEPSI PLUS бүртгэлээ бусдад ашиглуулахгүй,
                  дамжуулахгүй байх үүрэгтэй.
                </Text>
                <Text style={styles.text}>
                  3.6 Хэрэглэгч PEPSI PLUS нэвтрэх пин мартсан эсвэл гар утсаа
                  бусдад алдан PEPSI PLUS аппликейшн руу хандах боломжгүй болсон
                  тохиолдолд 7575 0000 лавлах төвд холбогдон PEPSI PLUS оноогоо
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
                  5.1 PEPSI PLUS зөвхөн өөрийн хувийн хэрэгцээнд ашиглах ёстой
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
                  PEPSI PLUS аппликейшн: Гомдол санал илгээх хэсэг
                </Text>
                <Text style={styles.text}>
                  “PEPSI PLUS ЛОЯАЛТИ ХӨТӨЛБӨР”-ИЙН ҮЙЛЧИЛГЭЭНИЙ НӨХЦӨЛ,
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
  checkbox: {
    marginRight: 10,
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
  closeButton: {
    marginTop: 10,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "lightgray",
    alignItems: "center",
    justifyContent: "center",
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
    right: 20,
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
  loaderImage: {
    width: 130,
    height: 130,
    transform: [{ scale: 1.2 }],
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
