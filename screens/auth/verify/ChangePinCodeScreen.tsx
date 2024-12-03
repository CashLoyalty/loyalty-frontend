import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { router } from "expo-router";
import { OtpInput } from 'react-native-otp-entry';
import Colors from "@/constants/Colors";
import Ionicons from 'react-native-vector-icons/Ionicons';


export default function ChangePinCodeScreen() {

    const [pinCode, setPinCode] = useState<string>('');
    const navigation = useNavigation();
    
    useEffect(() => {
        if (pinCode.length === 4) {
            handleHook(pinCode);
        }
    }, [pinCode]);
    
    const handleBack = () => {
        navigation.goBack();
    };

    const handleHook = (pinCode: string) => {
        router.push(`/changeNewPinCode?nowPinCode=${encodeURIComponent(pinCode)}`);
        setPinCode('');
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.createPinCodeContainer}>
                <Text style={styles.headerText}>Пин код</Text>
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
    inputBox: {
        width: 50,
        height: 50,
        borderWidth: 1,
        borderColor: '#1E1E1E',
        color: Colors.white,
        textAlign: "center",
        marginRight: 10,
        borderRadius: 10,
    },
    inputBoxFilled: {
        width: 54,
        height: 54,
        borderWidth: 2,
        borderColor: Colors.primaryColor,
        color: Colors.white,
        textAlign: "center",
        marginRight: 10,
        borderRadius: 10,
        fontSize: 32,
    },
    footer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: '100%',
        marginTop: '30%',
        paddingHorizontal: 10,
    },
    footerButton: {
        flex: 1,
        marginHorizontal: 5,
        backgroundColor: Colors.primaryColor,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    resendButton: {
        borderWidth: 1,
        borderColor: Colors.primaryColor, 
        backgroundColor: Colors.white
    },
    confirmButton: {
        borderWidth: 1,
        borderColor: Colors.white, 
        backgroundColor: Colors.primaryColor
    },
    resentButtonText: {
        color: "#A1A1A1",
        fontSize: 16,
    },
    confirmButtonText: {
        color: Colors.white,
        fontSize: 16,
    },
});
