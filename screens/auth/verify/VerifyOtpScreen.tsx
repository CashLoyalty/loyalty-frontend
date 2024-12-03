import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Keyboard, Image } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from "expo-router";
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { OtpInput } from 'react-native-otp-entry';
import Colors from "@/constants/Colors";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function VerifyOtpScreen() {

    const route = useRoute();
    const { phoneNumber } = route.params as { phoneNumber?: string };
    const [pinCode, setPinCode] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();
    const toast = useToast();
    
    useEffect(() => {
        if (phoneNumber?.length === 8 && pinCode.length === 6 && !loading) {
            handleConfirm(pinCode);
        }
    }, [phoneNumber, pinCode]);

    if (!phoneNumber) {
        return null; 
    }

    const formatPhoneNumber = (phoneNumber: string | undefined) => {
        if (!phoneNumber || phoneNumber.length < 6) return phoneNumber; 
        const start = phoneNumber.slice(0, 5);
        const end = phoneNumber.slice(-1);
        return `${start}**${end}`;
    };

    const handleBack = () => {
        navigation.goBack();
    };

    const handleConfirm = async (otpCode: string) => {

        if (otpCode.length !== 6) {
            toast.show(`OTP код 6 оронтой байх ёстой.`, {
                type: 'danger',
                placement: 'top',
                duration: 4000,
                animationType: 'slide-in',
            });
            return; 
        }

        Keyboard.dismiss(); 
        setLoading(true);

        try {
            const response = await axios.post('https://server-w6thjpmvcq-uc.a.run.app/api/user/checkOtp', {
                phoneNumber,
                otp: otpCode
            });

            if (response.data.code === 0) {
                router.push(`/createPinCode?phoneNumber=${encodeURIComponent(phoneNumber)}`);
            } else {
                toast.show(`Баталгаажуулах код буруу.`, {
                    type: 'danger',
                    placement: 'top',
                    duration: 4000,
                    animationType: 'slide-in',
                }); 
            }
        } catch (error) {
            const errorMessage = (error instanceof Error) ? error.message : String(error);
            toast.show(errorMessage, {
                type: 'danger',
                placement: 'top',
                duration: 4000,
                animationType: 'slide-in',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.verifyContainer}>
                <Text style={styles.headerText}>Баталгаажуулалт</Text>
                <Text style={styles.subText}>
                    Бид доорх дугаарт 6 оронтой код илгээлээ.
                </Text>
                <Text style={styles.subTextPhoneNumber}>
                    {formatPhoneNumber(phoneNumber)}
                </Text>
            </View>
            <View style={styles.inputContainer}>
                <OtpInput
                    numberOfDigits={6}
                    onTextChange={setPinCode}
                    focusColor={Colors.primaryColor}
                    focusStickBlinkingDuration={400}
                    theme={{
                        pinCodeContainerStyle: {
                            backgroundColor: Colors.white,
                            width: 50,
                            height: 50,
                            borderRadius: 10,
                            borderWidth: 4,
                        },
                        filledPinCodeContainerStyle: {
                            borderColor: Colors.primaryColor,
                            width: 55,
                            height: 55,
                        },
                        focusedPinCodeContainerStyle: {
                            width: 50,
                            height: 50,
                        },
                    }}           
                />        
            </View>
            {loading && (
                <View style={styles.loaderContainer}>
                    <Image 
                        source={require('@/assets/images/loading2.gif')} 
                        style={styles.loaderImage}
                    />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
    },
    verifyContainer: {
        top: 153,
        alignItems: 'center'
    },
    headerText: {
        color: Colors.white,
        fontSize: 32,
        fontFamily: 'Inter',
    },
    subText: {
        fontSize: 16,
        color: "#F5F5F5",
        marginBottom: 20,
        textAlign: "center",
    },
    subTextPhoneNumber: {
        fontSize: 18,
        color: Colors.white,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    inputContainer: {
        flexDirection: "row",
        top: 170,
        justifyContent: 'center',
        marginHorizontal: 20,
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loaderImage: {
        width: 300, 
        height: 300,
        transform: [{ scale: 1.2 }], 
    },
});
