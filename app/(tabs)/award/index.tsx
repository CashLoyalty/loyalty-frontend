import React from 'react';
import { View, Image, Text, StyleSheet, ListRenderItem, FlatList, TouchableOpacity } from 'react-native';
import Colors from '@/constants/Colors';
import Header from '@/components/header/header';
import HeaderSecond from '@/components/headerSecond/headerSecond';
import { screenDimensions } from '@/constants/constans';

const { width, height } = screenDimensions;

interface AwardItem {
  id: string;
  imgUrl: any; 
  awardTitle: string;
  date: string;
  lottery: string;
}

const AwardInfoData: AwardItem[] = [
  { id: '1', imgUrl: require('@/assets/icons/awardItem1.png'), awardTitle: 'AirPod MAX Win Big хөтөлбөр', date: '2024-07-17', lottery: '6 оролцох эрх' },
  { id: '2', imgUrl: require('@/assets/icons/awardItem2.png'), awardTitle: 'PlayStation 5 Win Big хөтөлбөр', date: '2024-08-25', lottery: '2 оролцох эрх' },
  { id: '3', imgUrl: require('@/assets/icons/awardItem3.png'), awardTitle: 'Scooter PRO Win Big хөтөлбөр', date: '2024-09-27', lottery: '5 оролцох эрх' },
];

const Award: React.FC = () => {

  console.log("width : " + width + " height : " + height);

  const renderItem: ListRenderItem<AwardItem> = ({ item }) => (
    <View style={styles.awardItem}>
      <View style={styles.awardRowContainer}>
        <View style={styles.awardImgContainer}>
          <Image source={item.imgUrl} />
        </View>
        <View style={styles.awardInfoContainer}>
          <View style={styles.infoSection1} />
          <View style={styles.infoSection2}>
            <Text style={styles.awardInfoTitle}>{item.awardTitle}</Text>
            <View style={styles.dateContainer}>
              <Image source={require("@/assets/icons/date.png")} />
              <Text style={{ fontSize: 14, color: Colors.primaryColor, marginLeft: 10 }}>{item.date}</Text>
            </View>
            <View style={styles.lotteryContainer}>
              <Image source={require("@/assets/icons/lottery.png")} />
              <Text style={{ fontSize: 14, color: Colors.primaryColor, marginLeft: 10 }}>{item.lottery}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header />
      <HeaderSecond />

      <View style={styles.rowContainer}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Шагнал</Text>
        </View>  
      </View>
      <View style={styles.emptyImageContainer}>
        <Image source={require('@/assets/images/emptyAward.png')} style={styles.emptyImage}/>
        <Text style={styles.text}>Шагнал олдсонгүй</Text>  
      </View>
      {/* Uncomment if you want to display the award list */}
      {/*<FlatList
        data={AwardInfoData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    marginHorizontal: 10,
  },
  titleContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
  },
  titleText: {
    color: Colors.primaryColor,
    fontSize: 20,
    fontFamily: 'Inter',
  },
  emptyImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  emptyImage: {
    width: width / 100 * 62.5, 
    height: height / 100 * 41,  
    opacity: 0.5,
  },
  text: {
    color: '#0E0E96',
    fontFamily: 'Inter',
    fontWeight: '600',
    fontSize: 14,
    opacity: 0.5, 
  },
  awardItem: {
    flex: 1,
  },
  awardRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  awardImgContainer: {
    flex: 1,
    zIndex: 2,
  },
  awardInfoContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 150,
    backgroundColor: Colors.white,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primaryColor,
    justifyContent: 'center',
    zIndex: 1,
    padding: 10,
  },
  infoSection1: {
    flex: 4, 
    backgroundColor: Colors.white,
  },
  infoSection2: {
    flex: 5, 
    backgroundColor: Colors.white,
  },
  awardInfoTitle: {
    textAlign: 'left', 
    fontSize: 23,
    fontWeight: '600', 
    color: Colors.primaryColor,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 20,
  },
  lotteryContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  }, 
});

export default Award;
