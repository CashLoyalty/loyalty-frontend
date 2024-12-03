import { StyleSheet } from 'react-native';
import {
  responsiveWidth,
  responsiveHeight,
} from 'react-native-responsive-dimensions';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    height: hp('30%'), // Adjust based on your needs
    marginHorizontal: wp('4%'), // Adjust based on your needs
  },
  swiper: {
    flex: 1, // Make sure Swiper takes full space within container
  },
  slide: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%', // Adjust based on your needs
    resizeMode: 'stretch',
    zIndex: 1,
  },
  dot: {
    backgroundColor: '#C6C7CC',
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    marginHorizontal: wp('1%'),
  },
  activeDot: {
    backgroundColor: '#2467EC',
    width: wp('2.5%'),
    height: wp('2.5%'),
    borderRadius: wp('1.25%'),
    marginHorizontal: wp('1%'),
  },
});
