import React, { useState, useEffect } from "react";
import { View, StyleSheet, Text, TouchableOpacity, Image } from "react-native";
import { router } from "expo-router";
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import { OtpInput } from 'react-native-otp-entry';
import { useToast } from 'react-native-toast-notifications';
import Colors from "@/constants/Colors";
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function CheckPinCodeScreen() {

    const [code, setCode] = useState<string>('');
    const navigation = useNavigation();
    const route = useRoute();
    const { phoneNumber } = route.params as { phoneNumber?: string };
    const { pinCode } = route.params as { pinCode?: string };
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [sound, setSound] = useState<Audio.Sound | undefined>(undefined); 

    const loadSound = async () => {
        const { sound: loadedSound } = await Audio.Sound.createAsync(
            require('@/assets/sounds/login.mp3') 
        );
        setSound(loadedSound);
    };

    useEffect(() => {
        loadSound();
        return () => {
            if (sound) {
                sound.unloadAsync(); 
            }
        };
    }, []);

    const playSound = async () => {
        if (sound) {
            try {
                await sound.replayAsync(); 
            } catch (error) {
                console.log('Error playing sound:', error);
            }
        } else {
            console.log('Sound is not loaded yet');
        }
    };

    useEffect(() => {
        if (phoneNumber?.length === 8 && code.length === 4) {
            handleConfirm(phoneNumber, code);
        }
    }, [phoneNumber, code]);
    
    const handleBack = () => {
        navigation.goBack();
    };

    const handleConfirm = async (phoneNumber: any, againPinCode: string) => {
        
        const enteredCode = againPinCode; 
        
        if (enteredCode === pinCode) {
            
            setLoading(true);

            try {
                const response = await axios.post('https://server-w6thjpmvcq-uc.a.run.app/api/user/register', {
                    phoneNumber: phoneNumber,
                    passCode: enteredCode,
                });

                if (response.data.code === 0) {
                    const accessToken = response.data.response.access_token;
                    await AsyncStorage.setItem('token', accessToken);
                    playSound();
                    router.push("/(tabs)");
                } else {
                    toast.show("Баталгаажуулалт амжилтгүй!", {
                        type: 'danger',
                        placement: 'top',
                        duration: 4000,
                        animationType: 'slide-in',
                    });
                }
            } catch (error) {
                console.error(error);
                toast.show("Алдаа гарлаа, дахин оролдоно уу...", {
                    type: 'danger',
                    placement: 'top',
                    duration: 4000,
                    animationType: 'slide-in',
                });
            } finally {
                setLoading(false);
            };
                
        } else {
            toast.show("Кодууд тохирохгүй байна!", {
                type: 'danger',
                placement: 'top',
                duration: 4000,
                animationType: 'slide-in',
            });
            return;
        }
    };

    return (
            <View style={styles.container}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={Colors.white} />
                </TouchableOpacity>
                <View style={styles.confirmPinCodeContainer}>
                    <Text style={styles.headerText}>Дахин оруулна уу</Text>
                </View>
                <View style={styles.inputContainer}>
                    <OtpInput
                        numberOfDigits={4}
                        onTextChange={setCode}
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
    confirmPinCodeContainer: {
        top: 153,
        alignItems: 'center'
    },
    headerText: {
        fontSize: 22,
        fontWeight: "bold",
        color: Colors.white,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: "row",
        marginTop: 170,
        justifyContent: 'center',
        marginHorizontal: 70,
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
