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
    height: hp('30%'),
    marginHorizontal: wp('4%'),
  },
  swiper: {
    flex: 1,
  },
  slide: {
    flex: 1,
  },
  background: {
    width: '100%',
    height: '100%',
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
