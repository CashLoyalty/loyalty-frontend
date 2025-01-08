import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { router } from "expo-router";
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { SERVER_URI } from '@/utils/uri';
import { Feather } from "@expo/vector-icons";
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BlurView } from 'expo-blur';
import { screenDimensions } from '@/constants/constans';
import { StatusBar } from 'expo-status-bar';

const { width, height } = screenDimensions;

export default function LoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const requiredLength = 8;
    const toast = useToast();

    useEffect(() => {
        if (phoneNumber.length === requiredLength) {
            Keyboard.dismiss();
        }
    }, [phoneNumber]);

    const handleLogin = async () => {
        const verifiedPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
        
        if (verifiedPhoneNumber.length === 0) {
            toast.show(`Утасны дугаар оруулна уу...`, {
                type: 'danger',
                placement: 'top',
                duration: 4000,
                animationType: 'slide-in',
            });
            return;
        }

        if (verifiedPhoneNumber.length !== requiredLength) {
            toast.show(`Утасны дугаар буруу...`, {
                type: 'danger',
                placement: 'top',
                duration: 4000,
                animationType: 'slide-in',
            });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${SERVER_URI}/api/user/getOtp`, {
                phoneNumber: verifiedPhoneNumber,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
        
            if (data.title === 'Success') { 
                router.push(`/verifyOtp?phoneNumber=${encodeURIComponent(verifiedPhoneNumber)}`);
            } else if (data.title === 'Phone number Duplicated') {
                router.push(`/loginPinCode?phoneNumber=${encodeURIComponent(verifiedPhoneNumber)}`);
            } else {
                toast.show(`Алдаа: ${data.title}`, {
                    type: 'danger',
                    placement: 'top',
                    duration: 4000,
                    animationType: 'slide-in',
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.show(`Алдаа гарлаа (axios): ${error.response?.data?.message || error.message}`, {
                    type: 'danger',
                    placement: 'top',
                    duration: 4000,
                    animationType: 'slide-in',
                });
            } else {
                toast.show(`Алдаа гарлаа: ${String(error)}`, {
                    type: 'danger',
                    placement: 'top',
                    duration: 4000,
                    animationType: 'slide-in',
                });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="light" backgroundColor="black" />
            <Image
                style={styles.loginImage}
                source={require('@/assets/sign-in/sign_in.png')}
            />
            <View style={styles.inputContainer}>
                <Text style={styles.labelText}>Утасны дугаар</Text>
                <View style={styles.inputWrapper}>
                    <Feather
                        style={styles.icon}
                        name="phone"
                        size={25}
                        color="#A0A4B0"
                    />
                    <View style={styles.verticalLine} />
                    <TextInput 
                        style={styles.input}
                        placeholder="Утасны дугаар"
                        placeholderTextColor="#A0A4B0"
                        keyboardType="numeric"
                        maxLength={requiredLength}
                        value={phoneNumber}
                        onChangeText={text => {
                            if (text.length <= requiredLength) {
                                setPhoneNumber(text);
                            }
                        }} 
                    />  
                </View>
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.buttonSignText}>Нэвтрэх</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>#Илүүд тэмүүл</Text>
            </View>
            {loading && (
                <View style={styles.loaderContainer}>
                    <BlurView
                        intensity={0}
                        style={styles.loaderBackground}
                        tint="dark"
                    />
                    <Image 
                        source={require('@/assets/images/loading2.gif')} 
                        style={styles.loaderImage}
                    />
                </View>
            )}
        </SafeAreaView>   
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
        alignItems: 'center',
    },
    loginImage: {
        width: width * 1, 
        height: height * 0.4, 
        borderRadius: 120, 
        marginBottom: 20, 
    },
    inputContainer: {
        width: '100%', 
        alignItems: 'center',
    },
    labelText: {
        width: '90%',
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'Inter',
        marginBottom: 10,
    },
    inputWrapper: {
        width: '90%', 
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        height: 48,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: "white",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: Colors.black,
    },
    icon: {
        marginRight: 10, 
    },
    verticalLine: {
        width: 1,
        height: 31, 
        backgroundColor: '#A1A1A1',
        marginRight: 10, 
    },
    button: {
        height: 51,
        borderRadius: 10,
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        marginTop: 20,
        width: '90%', 
    },
    buttonSignText: {
        color: '#EFF6FF',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Inter',
    },
    footer: {
        marginTop: height / 100 * 23,
        alignItems: 'center',
    },
    footerText: {
        color: '#EFF6FF',
        fontSize: 16,
    },
    loaderContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.black,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    loaderBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: Colors.black,
        opacity: 1, 
    },
    loaderImage: {
        width: 300, 
        height: 300,
        transform: [{ scale: 1.2 }], 
    },
});
