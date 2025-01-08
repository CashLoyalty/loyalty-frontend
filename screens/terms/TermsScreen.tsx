import React from 'react';
import { ScrollView, Text, View, StyleSheet, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { router } from 'expo-router';
import Colors from '@/constants/Colors';



const TermsScreen = () => {
  const handleBackPress = () => {
    router.back();
  };
  return (
    <SafeAreaView style={styles.saveAreaView}>
      <View style={styles.back}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backContainer}>
          <Ionicons name="arrow-back" size={24} color={Colors.primaryColor} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'Inter', fontSize: 17, marginLeft: 10, color: Colors.primaryColor }}>
          Үйлчилгээний нөхцөл
        </Text>
      </View>
      <ScrollView style={styles.container}>
        <View style={styles.section}>
          <Text style={styles.title}>Үйлчилгээний нөхцөл</Text>
          <Text style={styles.subTitle}>“PEPSI PLUS ЛОЯАЛТИ ХӨТӨЛБӨР”-ИЙН ХЭРЭГЛЭГЧИЙН ГЭРЭЭ</Text>
          <Text style={styles.text}>Тодорхойлолт: "PEPSI PLUS лояалти хөтөлбөр" гэдэг нь “PepsiCO”-гийн албан ёсны онцгой эрхт монгол дахь савлан үйлдвэрлэгч Жи эн Бевережис ХХК үнэнч хэрэглэгчээ урамшуулах зорилгоор хэрэгжүүлж буй ЛОЯАЛТИ ХӨТӨЛБӨР юм.</Text>
          <Text style={styles.text}>“Хэрэглэгч” гэж "PEPSI PLUS" хөтөлбөрийг хүлээн зөвшөөрсөн болон үйлчилгээний нөхцөл, хэрэглэгчийн гэрээг хүлээн зөвшөөрч аппликейшнд бүртгүүлсэн иргэнийг хэлнэ.</Text>
          <Text style={styles.warning}>САНАМЖ: "Хэрэглэгч" гэж "PEPSI PLUS"-ыг хүлээн авсан болон үйлчилгээний нөхцөл, хэрэглэгчийн гэрээг хүлээн зөвшөөрч аппликейшн бүртгүүлсэн иргэнийг хэлнэ.</Text>
          <Text style={styles.text}>Гэрээний хувилбар: 0.1 /2024.12.01/</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>1. PEPSI PLUS цуглуулах, зарцуулах эрхийн талаар</Text>
          <Text style={styles.text}>1.1 "PEPSI PLUS лояалти хөтөлбөр"-ийн PEPSI PLUS аппликейшн болон www.pepsi.mn вэб сайт, "PEPSI PLUS" аппликейшн нь Жи Эн Бевережис" ХХК -ийн өмч бөгөөд "Хэрэглэгч" нь "PEPSI PLUS"-ын эзэмшигч байна.</Text>
          <Text style={styles.text}>1.2 "PEPSI PLUS" худалдан авах болон PEPSI PLUS аппликейшнээр нэвтрэн үйлчилгээний нөхцөл, хэрэглэгчийн гэрээтэй уншиж танилцан хүлээн зөвшөөрснөөр гэрээ байгуулсанд тооцно.</Text>
          <Text style={styles.text}>1.3 Хэрэглэгч лояалти хөтөлбөрт PEPSI PLUS оноо хэрэглэхдээ доорх аргуудаар PEPSI PLUS оноо цуглуулах, зарцуулах боломжтой байна.</Text>
          <Text style={styles.text}>1.3.1 Pepsi.mn вебсайт</Text>
          <Text style={styles.text}>1.3.2 PEPSI PLUS аппликейшн</Text>
          <Text style={styles.text}>1.4 Хэрэглэгч PEPSI PLUS аппликейшнд нэвтэрснээр PEPSI PLUS оноогоо цуглуулах, зарцуулах, гүйлгээний түүхээ харах, үлдэгдэл оноогоо шалгах, урамшуулалт хөтөлбөрүүдэд хамрагдах, бүтээгдэхүүн үйлчилгээний талаар мэдээлэл авах боломжтой болно.</Text>
          <Text style={styles.text}>1.5 Хэрэглэгч PEPSI PLUS оноогоо цуглуулах, зарцуулахдаа пин код ашиглана. Пин код нь 4 оронтой тоо байна. PEPSI PLUS аппликейшнд бүртгүүлэх тохиолдолд хэрэглэгч өөрийн хүссэн пин кодоо үүсгэнэ.</Text>
          <Text style={styles.text}>1.6 Хэрэглэгч худалдан авалт хийх үедээ 1 PEPSI PLUS оноо = 1 төгрөг зарчмаар PEPSI PLUS оноогоо зарцуулан, тухайн бүтээгдэхүүн үйлчилгээний үнийн дүнгийн 100% хүртэлх дүнд хөнгөлөлт эдлэх боломжтой.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>2. Хэрэглэгчийн мэдээлэл:</Text>
          <Text style={styles.text}>2.1 PEPSI PLUS аппликейшнд бүртгүүлэхэд таны дараах хувийн мэдээллүүд шаардлагатай. Үүнд: Овог, нэр, регистрийн дугаар болон гэрийн хаяг.</Text>
          <Text style={styles.text}>2.2 "PEPSI PLUS лояалти хөтөлбөр"- үйлчлүүлэх боломжийг нэмэгдүүлэх, бүтээгдэхүүн, үйлчилгээг сайжруулах, хөгжүүлэлт хийх, урамшуулал санал болгох зорилгоор бид таны хувийн мэдээллийг PEPSI PLUS -н данс эзэмшигч байх хугацаанд цуглуулах, боловсруулах, ашиглах хамтрагч дамжуулж болно.</Text>
          <Text style={styles.text}>2.3 PEPSI PLUS -н данс эзэмшигч байх эрхээ PEPSI PLUS -н лавлах төвд холбогдон цуцлуулах боломжтой.</Text>
          <Text style={styles.text}>2.4 Бид таны хувийн мэдээллийг нийтэд ил болгохгүй.</Text>
          <Text style={styles.text}>2.5 Гэмт хэрэг, зөрчил шалган шийдвэрлэх ажиллагааны явцад хууль сахиулах болон шүүх эрх мэдлийн байгууллагаас албан ёсоор шаардсан тохиолдолд таны мэдээлэл, бүтээгдэхүүн үйлчилгээ, хөнгөлөлт, урамшууллын түүхийн талаарх мэдээллийг өгөх болно.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>3. Мэдээллийн аюулгүй байдал, нууцлалтай холбоотой үүрэг:</Text>
          <Text style={styles.text}>3.1 Жи Эн Бевережис" ХХК нь лояалти системийн аюулгүй, найдвартай хэвийн ажиллагааг хангах, мэдээллийн нууцлалыг хамгаалах бүх талын арга хэмжээг авч ажиллана.</Text>
          <Text style={styles.text}>3.2 Хэрэглэгч өөрийн мэдээллийн аюулгүй байдлыг хангах үүрэгтэй ба хангаагүйн улмаас үүсэх эрсдэлийг Жи Эн Бевережис" ХХК ХХК хариуцахгүй.</Text>
          <Text style={styles.text}>3.3 Хэрэглэгч гүйлгээний пин кодоо бусдад алдахгүй байх, дамжуулахгүй байх үүрэгтэй.</Text>
          <Text style={styles.text}>3.4 Хэрэглэгч бүртгүүлсэн утасны дугаараа ашиглахаа больсон эсвэл эзэмших эрхийг бусдад шилжүүлсэн тохиолдолд PEPSI PLUS аппликейшнд өөрийн эрхээр нэвтрэн бүртгэлтэй утасны дугаарын мэдээллээ шинэчлэх үүрэгтэй.</Text>
          <Text style={styles.text}>3.5 Хэрэглэгч PEPSI PLUS бүртгэлээ бусдад ашиглуулахгүй, дамжуулахгүй байх үүрэгтэй.</Text>
          <Text style={styles.text}>3.6 Хэрэглэгч PEPSI PLUS нэвтрэх пин мартсан эсвэл гар утсаа бусдад алдан PEPSI PLUS аппликейшн руу хандах боломжгүй болсон тохиолдолд 7575 0000 лавлах төвд холбогдон PEPSI PLUS оноогоо зарцуулах эрхийг түр хаалган бусдад зүй бусаар ашиглуулахаас сэргийлэх үүрэгтэй.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>4. Баталгаа өгөхгүй зүйлс:</Text>
          <Text style={styles.text}>4.1 Хэрэглэгчийн бүртгүүлсэн мэдээллийн үнэн зөв байдал.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>5. Хэрэглэгчид хориглох зүйл:</Text>
          <Text style={styles.text}>5.1 PEPSI PLUS зөвхөн өөрийн хувийн хэрэгцээнд ашиглах ёстой ба бусдад дамжуулан худалдах, бусдад хэрэглүүлж мөнгө авах зэрэг үйлчилгээний нөхцөлийг зөрчсөн үйлдэл хийхийг хориглоно.</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.subtitle}>Холбоо барих:</Text>
          <Text style={styles.text}>
            "Жи Эн Бевережис" ХХК Хан-Уул, 3-хороо, Чингисийн өргөн чөлөө-14, Пепси төв байр \17060\ Монгол Улс
          </Text>
          <Text style={styles.text}>
            ГОМДОЛ, ХҮСЭЛТ ХҮЛЭЭН АВАХ: И-мэйл: 
            <Text style={styles.link} onPress={() => Linking.openURL('mailto:hello@pepsi.mn')}>hello@pepsi.mn</Text>
          </Text>
          <Text style={styles.text}>Утас: 7575 0000</Text>
          <Text style={styles.text}>PEPSI PLUS аппликейшн: Гомдол санал илгээх хэсэг</Text>
          <Text style={styles.text}>“PEPSI PLUS ЛОЯАЛТИ ХӨТӨЛБӨР”-ИЙН ҮЙЛЧИЛГЭЭНИЙ НӨХЦӨЛ, ХЭРЭГЛЭГЧИЙН ГЭРЭЭГ УНШИЖ ТАНИЛЦАН ХҮЛЭЭН ЗӨВШӨӨРЧ БАЙНА.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  backContainer: {
    marginLeft: 10,
  },
  back: {
    flexDirection: 'row',
  },
  saveAreaView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: Colors.backgroundColor,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 5,
  },
  warning: {
    fontSize: 14,
    color: 'red',
    marginBottom: 5,
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default TermsScreen;
