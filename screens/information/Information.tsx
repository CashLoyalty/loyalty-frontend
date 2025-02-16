import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, TextInput, ActivityIndicator, ScrollView, Platform, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserResponse } from '@/types/global';
import useFetchUser from '@/hooks/useFetchUser';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SERVER_URI } from '@/utils/uri';
import { useToast } from 'react-native-toast-notifications';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import axios from 'axios';

interface ImageType {
    uri: string;
    type?: string;
    fileName: string;
}

export default function InformationScreen() {
    const [token, setToken] = useState<string>('');
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [birthOfDate, setBirthOfDate] = useState('');
    const [sex, setSex] = useState('');
    const [gender, setGender] = useState('male');
    const [errorLastName, setErrorLastName] = useState('');
    const [errorFirstName, setErrorFirstName] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorBirthOfDate, setErrorBirthOfDate] = useState('');
    const [genderTextColor, setGenderTextColor] = useState(Colors.primaryColor);
    const toast = useToast();
    const [buttonSpinner, setButtonSpinner] = useState(false);
    const [image, setImage] = useState<ImageType | null>(null);
    const [profileImage, setProfileImage] = useState<string>('');

    useEffect(() => {
        const getToken = async () => {
            const storedToken = await AsyncStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            } else {
                console.warn("No token found in AsyncStorage");
            }
        };
        getToken();
    }, []);

    const { data, error: userErrorFetched } = useFetchUser(`${SERVER_URI}/api/user`, token);

    useEffect(() => {
        if (data) {
            setUserData(data);
        }
        if (userErrorFetched) {
            console.error(userErrorFetched);
        }
    }, [data, userErrorFetched]);

    useEffect(() => {
        if (!userData) return;
    
        const { lastName, firstName, email, birthOfDate, sex, imageUrl } = userData;
    
        lastName && setLastName(lastName);
        firstName && setFirstName(firstName);
        email && setEmail(email);
        
        birthOfDate && setBirthOfDate(new Date(birthOfDate).toISOString().split('T')[0]);
        
        if (sex) {
            setSex(sex);
            setGender(sex.toLowerCase());
        }
    
        if (imageUrl) {
            console.log("imageUrl : " + imageUrl);
            checkImageUrl(imageUrl);
            setProfileImage(imageUrl);
        }
    }, [userData]);
    

    React.useEffect(() => {
        requestPermission();
    }, []);

    const requestPermission = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission required', 'We need permission to access your photo library.');
            }
        }
    };
    
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets.length > 0) {
            const asset = result.assets[0];
            const image: ImageType = {
                uri: asset.uri,
                type: asset.type || 'image/jpeg',  
                fileName: asset.fileName || 'image.jpg',  
            };
            setImage(image);
            setProfileImage(image.uri);
        }
    };

    const compressImage = async (uri: string) => {
        try {
            const result = await ImageManipulator.manipulateAsync(uri, [], {
                compress: 0.1,  
                format: ImageManipulator.SaveFormat.JPEG,
            });
            return result.uri;
        } catch (error) {
            console.error("Error compressing image:", error);
            return uri;  
        }
    };

    const checkImageUrl = async (url: string) => {
        try {
          const response = await axios.head(url);
          if (response.status === 200) {
            console.log('Image is accessible');
          } else {
            console.log('Image is not accessible');
          }
        } catch (error: unknown) {
            if (error instanceof Error) {
              setProfileImage('');
            } else {
              console.error('Unknown error occurred');
            }
        }
    };

    const handleBackPress = () => {
        router.back();
    };

    const handleBirthday = () => {
        setDatePickerVisibility(true);
    };

    const handleGender = (selectedGender: string) => {
        setGender(selectedGender);
        if (selectedGender === 'male') {
            setSex(selectedGender);
            setGenderTextColor(Colors.primaryColor); 
        } else {
            setSex(selectedGender);
            setGenderTextColor(Colors.black); 
        }
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date: Date) => {
        const formattedDate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        setBirthOfDate(formattedDate);
        hideDatePicker();
    };
        
    const handleSave = async () => {
        
        setButtonSpinner(true);
        
        if (image) {

            const compressedUri = await compressImage(image.uri);
            const { type, fileName} = image;
            const formData = new FormData();
        
            formData.append('image', {
                uri: compressedUri, 
                type,
                name: fileName,
            } as unknown as Blob);
            
            try {
                const response = await fetch(`${SERVER_URI}/api/user/image`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const errorText = await response.text(); 
                    throw new Error(`Upload failed with status: ${response.status}`);
                }

                const result = await response.json();
                console.log("Image upload result:", result);

            } catch (error) {
                console.error("Error during image upload:", error);
            } 
        } else {
            console.log("No image selected");
        }
    
        const userDataToUpdate = { firstName, lastName, email, birthOfDate, sex: gender.toUpperCase() };
    
        try {
            const userResponse = await fetch(`${SERVER_URI}/api/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userDataToUpdate),
            });
    
            if (!userResponse.ok) {
                throw new Error(`User update failed: ${userResponse.statusText}`);
            }
    
            const result = await userResponse.json();
            if (result.code === 400) {
                handleValidationErrors(result);
                toast.show('Амжилтгүй', {
                    type: 'danger',
                    placement: 'top',
                    duration: 4000,
                });
            } else if (result.code === 0 && result.title === "Success") {
                toast.show('Мэдээлэл амжилттай шинэчлэгдлээ', {
                    type: 'success',
                    placement: 'top',
                    duration: 4000,
                });
                clearFormErrors();
            }
        } catch (error) {
            console.error('Error saving user data:', error);
        } finally {
            setButtonSpinner(false);
        }
    };

    const handleValidationErrors = (result: { title: string }) => {
        const errors: Record<string, (message: string) => void> = {
            lastName: setErrorLastName,
            firstName: setErrorFirstName,
            email: setErrorEmail,
            birthOfDate: setErrorBirthOfDate
        };
    
        (Object.keys(errors) as Array<keyof typeof errors>).forEach(key => {
            if (result.title.includes(key)) errors[key](`Таны ${key} талбар буруу байна`);
        });
    };    

    const clearFormErrors = () => {
        setErrorLastName('');
        setErrorFirstName('');
        setErrorEmail('');
        setErrorBirthOfDate('');
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.back}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backContainer}>
                    <Ionicons name="arrow-back" size={24} color={Colors.primaryColor} />
                </TouchableOpacity>
                <Text style={{ fontFamily: 'Inter', fontSize: 17, marginLeft: 10, color: Colors.primaryColor }}>
                    Миний мэдээлэл
                </Text>
            </View>
            <View style={styles.card}>
                <View style={styles.content}>
                    <View style={styles.profileColumnContainer}>
                        <View style={styles.profileContainer}>
                            <Image source={profileImage ? { uri: profileImage } : require('@/assets/icons/profile.png')} style={styles.profileImage} />
                        </View>
                        <View style={styles.editImage}>
                            <Ionicons name="camera" size={18} color={Colors.white} />
                            <TouchableOpacity onPress={ pickImage }>
                                <Text style={{ fontFamily: 'Inter', fontSize: 14, color: Colors.white, marginLeft: 5 }}>Зураг солих</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.profileEdit}>
                <ScrollView style={{ marginBottom: 30 }}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Таны овог
                            <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            placeholderTextColor="transparent"
                            value={lastName}
                            onChangeText={setLastName}
                        />
                        <View style={styles.iconContainer}>
                            <Image source={require("@/assets/icons/editUser.png")} style={styles.icon} />
                        </View>
                    </View>
                    {errorLastName ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorLastName}</Text>
                        </View>
                    ) : null}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Таны нэр
                            <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            placeholderTextColor="transparent"
                            value={firstName}
                            onChangeText={setFirstName}
                        />
                        <View style={styles.iconContainer}>
                            <Image source={require("@/assets/icons/editUser.png")} style={styles.icon} />
                        </View>
                    </View>
                    {errorFirstName ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorFirstName}</Text>
                        </View>
                    ) : null}
                    {/*<View style={styles.inputContainer}>
                        <Text style={styles.label}>Утас
                            <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            placeholderTextColor="transparent"
                        />
                        <View style={styles.iconContainer}>
                            <Image source={require("@/assets/icons/editPhone.png")} style={styles.icon} />
                        </View>
                    </View>*/}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>И-Mэйл
                            <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <TextInput
                            style={styles.input}
                            placeholder=""
                            placeholderTextColor="transparent"
                            value={email}
                            onChangeText={setEmail}
                        />
                        <TouchableOpacity style={styles.iconContainer}>
                            <Image source={require("@/assets/icons/editEmail.png")} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                    {errorEmail ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorEmail}</Text>
                        </View>
                    ) : null}    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>
                            Төрсөн өдөр
                        </Text>
                        <TouchableOpacity onPress={handleBirthday} style={[styles.input, styles.dateInput]}>
                            <Text style={{ color: birthOfDate ? Colors.black : '#808080', textAlign: 'center' }}>
                                {birthOfDate || "MM/DD/YYYY"}
                            </Text>
                        </TouchableOpacity>
                        <View style={styles.iconContainer}>
                            <Image source={require("@/assets/icons/editBirthday.png")} style={styles.icon} />
                        </View>
                    </View>
                    {errorBirthOfDate ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{errorBirthOfDate}</Text>
                        </View>
                    ) : null}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Хүйс
                            <Text style={styles.asterisk}>*</Text>
                        </Text>
                        <View style={styles.genderContainer}>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'male' && styles.selectedGender]}
                                onPress={() => handleGender('male')}>
                                <Text style={[styles.genderText, { color: gender === 'male' ? Colors.white : Colors.primaryColor }]}>Эрэгтэй</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.genderButton, gender === 'female' && styles.selectedGender]}
                                onPress={() => handleGender('female')}>
                                <Text style={[styles.genderText, { color: gender === 'female' ? Colors.white : Colors.primaryColor }]}>Эмэгтэй</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={styles.save} onPress={handleSave}>
                            {buttonSpinner ? (
                                <ActivityIndicator size="small" color={Colors.white} />
                            ) : (
                                <Text style={styles.saveText}>ХАДГАЛАХ</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundColor,
    },
    backContainer: {
        marginLeft: 10,
    },
    editImage: {
        flexDirection: 'row',
        marginTop: 10,
    },
    save: {
        height: 52,
        marginTop: 30,
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveText: {
        color: Colors.white,
        fontSize: 14,
        fontFamily: 'Inter',
    },
    card: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
        height: 140,
        marginTop: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
    },
    back: {
        flexDirection: 'row',
    },
    content: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    profileColumnContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
    },
    profileImage: {
        width: 68,
        height: 68,
        borderRadius: 34,
    },
    profileEdit: {
        flex: 1,
        backgroundColor: Colors.white,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        marginHorizontal: 10,
        marginTop: 10,
        paddingTop: 10,
        paddingHorizontal: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        height: 48,
        marginTop: 20,
        borderColor: Colors.primaryColor,
    },
    label: {
        position: 'absolute',
        left: 15,
        top: -10,
        fontSize: 14,
        fontFamily: 'Inter',
        color: Colors.primaryColor,
        backgroundColor: Colors.white,
        paddingHorizontal: 5,
        zIndex: 2,
    },
    asterisk: {
        color: 'red',
        position: 'absolute',
        right: 15,
        top: -10,
    },
    input: {
        flex: 1,
        height: '100%',
        borderColor: Colors.primaryColor,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 0,
        backgroundColor: '#fff',
    },
    dateInput: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconContainer: {
        position: 'absolute',
        right: 10,
        top: '50%',
        transform: [{ translateY: -10 }],
    },
    icon: {
        width: 20,
        height: 20,
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: 50,
        marginTop: 20,
        width: '100%',
    },
    genderButton: {
        padding: 10,
        borderWidth: 1,
        borderColor: Colors.primaryColor,
        borderRadius: 10,
        width: 150,
        alignItems: 'center',
    },
    selectedGender: {
        backgroundColor: Colors.primaryColor,
    },
    genderText: {
        fontFamily: 'Inter',
        fontSize: 14,
    },
    errorContainer: {
        marginTop: 5,
        marginLeft: 15,
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        fontFamily: 'Inter',
    },
});
