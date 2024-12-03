import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
import { router } from "expo-router";
import { OtpInput } from 'react-native-otp-entry';
import Colors from "@/constants/Colors";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CreatePinCodeScreen() {
    
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber } = route.params as { phoneNumber?: string };
    const [pinCode, setPinCode] = useState<string>('');
    
    useEffect(() => {
        if (phoneNumber?.length === 8 && pinCode.length === 4) {
            handleHook(phoneNumber, pinCode);
        }
    }, [phoneNumber, pinCode]);
    
    const handleBack = () => {
        navigation.goBack();
    };

    const handleHook = (phoneNumber: any, pinCode: string) => {

        console.log("phoneNumber : " + phoneNumber);
        console.log("pinCode : " + pinCode);

        router.push(`/checkPinCode?phoneNumber=${encodeURIComponent(phoneNumber)}&pinCode=${encodeURIComponent(pinCode)}`);
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.createPinCodeContainer}>
                <Text style={styles.headerText}>Пин код үүсгэх</Text>
            </View>
            <View style={styles.inputContainer}>
                <OtpInput
                    numberOfDigits={4}
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
    createPinCodeContainer: {
        top: 153,
        alignItems: 'center'
    },
    headerText: {
        fontSize: 32,
        fontWeight: "bold",
        color: Colors.white,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        top: 170,
        justifyContent: 'center',
        marginHorizontal: 70,
    },
});
