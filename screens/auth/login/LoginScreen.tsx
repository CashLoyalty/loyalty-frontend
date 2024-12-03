import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { router } from "expo-router";
import axios from 'axios';
import { useToast } from 'react-native-toast-notifications';
import { SERVER_URI } from '@/utils/uri';
import { Feather } from "@expo/vector-icons";
import Colors from '@/constants/Colors';

export default function LoginScreen() {

    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const requiredLength = 8;
    const toast = useToast();

    useEffect(() => {
        if (phoneNumber?.length === 8) {
            Keyboard.dismiss();
        }
    }, [phoneNumber]);
    
    const handleSignIn = async () => {

        const numericValue = phoneNumber.replace(/[^0-9]/g, '');

        Keyboard.dismiss();
        
        if (numericValue.length === 0) {
            toast.show(`Утасны дугаар оруулна уу...`, {
                type: 'danger',
                placement: 'top',
                duration: 4000,
                animationType: 'slide-in',
            });
            return;
        }

        if (numericValue.length !== requiredLength) {
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
                phoneNumber: numericValue,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;
        
            if (data.title === 'Success') {

                router.push(`/verifyOtp?phoneNumber=${encodeURIComponent(numericValue)}`);

            } else if (data.title === 'Phone number Duplicated') { 
                router.push(`/loginPinCode?phoneNumber=${encodeURIComponent(numericValue)}`);
            } else {
                toast.show(`Алдаа: ${data.title}`, {
                    type: 'danger',
                    placement: 'top',
                    duration: 4000,
                    animationType: 'slide-in',
                });
            }
        } catch (error) {
            let errorMessage = 'Unknown error occurred';

            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.message || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            } else if (typeof error === 'string') {
                errorMessage = error;
            } else if (error && typeof error === 'object' && 'message' in error) {
                errorMessage = (error as { message?: string }).message || 'Unknown error occurred';
            }

            toast.show(`Алдаа гарлаа: ${errorMessage}`, {
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
            <Image
                style={styles.signInImage}
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
                <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                    <Text style={styles.buttonSignText}>Нэвтрэх</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.footer}>
                <Text style={styles.footerText}>#Илүүд тэмүүл</Text>
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
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black,
    },
    signInImage: {
        position: 'absolute',
        top: 29,
        left: 8,
        width: 385,
        height: 355,
        borderRadius: 120, 
    },
    inputContainer: {
        top: 392,
    },
    labelText: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'Inter',
        left: 16,
    },
    inputWrapper: {
        marginTop: 20,
        marginHorizontal: 16,
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
        paddingLeft: 0,
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
        marginHorizontal: 16,
    },
    buttonSignText: {
        color: '#EFF6FF',
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Inter',
    },
    footer: {
        position: 'absolute',
        top: 796,
        bottom: 0,
        left: 0,
        right: 0,
        alignItems: 'center'
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
