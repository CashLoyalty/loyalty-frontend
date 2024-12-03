import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, TextInput, ActivityIndicator, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserResponse } from '@/types/global';
import useFetchUser from '@/hooks/useFetchUser';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { SERVER_URI } from '@/utils/uri';
import { useToast } from 'react-native-toast-notifications';

export default function InformationScreen() {
    const [token, setToken] = useState<string>('');
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [userError, setUserError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [lastName, setLastName] = useState('');
    const [firstName, setFirstName] = useState('');
    const [email, setEmail] = useState('');
    const [birthOfDate, setBirthOfDate] = useState('');
    const [sex, setSex] = useState('');
    const [gender, setGender] = useState('male'); 
    const [genderTextColor, setGenderTextColor] = useState(Colors.primaryColor);
    const toast = useToast();
    const [buttonSpinner, setButtonSpinner] = useState(false); 
    

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                if (storedToken) {
                    setToken(storedToken);
                } else {
                    console.warn("No token found in AsyncStorage");
                }
            } catch (error) {
                console.error("Failed to fetch token: ", error);
            } finally {
                setLoading(false);
            }
        };

        fetchToken();
    }, []);

    const { data, loading: userLoading, error: userErrorFetched } = useFetchUser(`${SERVER_URI}/api/user`, token);

    useEffect(() => {
        if (data) {
            setUserData(data);
        }
        if (userErrorFetched) {
            setUserError(userErrorFetched);
        }
    }, [data, userErrorFetched]);

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
        /*const formattedDate = `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getDate().toString().padStart(2, '0')}/${date.getFullYear()}`;*/
        const formattedDate = `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
        setBirthOfDate(formattedDate);
        hideDatePicker();
    };

    const handleSave = async () => {
        // Construct the user data object
        setButtonSpinner(true);
        const userDataToUpdate = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            birthOfDate: birthOfDate, // Ensure this is in the correct format
            sex: gender.toUpperCase(), // Assuming your API expects "MALE" or "FEMALE"
        };
        console.log(
            "LastName : " + userDataToUpdate.lastName,
            "FirstName : " + userDataToUpdate.firstName,
            "Email : " + userDataToUpdate.email,
            "BirthOfDate : " + userDataToUpdate.birthOfDate,
            "Sex : " + userDataToUpdate.sex
        );
        try {
            const response = await fetch(`${SERVER_URI}/api/user`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(userDataToUpdate),
            });
            
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
    
            const result = await response.json();
            console.log('User data updated successfully:', result);

            if(result.code === 0 && result.title === "Success") {
                toast.show(`Мэдээлэл амжилттай шинэчлэгдлээ`, {
                    type: 'success',
                    placement: 'top',
                    duration: 4000,
                    animationType: 'slide-in',
                });
            }
            // Optionally navigate or show a success message here
    
        } catch (error) {
            console.error('Failed to update user data:', error);
            // Handle error (e.g., show an alert or a message to the user)
        } finally {
            setButtonSpinner(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
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
                            <Image
                                source={require("@/assets/icons/profile.png")}
                                style={styles.profileImage}
                            />
                        </View>
                        <View style={styles.editImage}>
                            <Ionicons name="camera" size={18} color={Colors.white} />
                            <TouchableOpacity>
                                <Text style={{ fontFamily: 'Inter', fontSize: 14, color: Colors.white, marginLeft: 5 }}>Зураг солих</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
            <View style={styles.profileEdit}>
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
                <View style={styles.inputContainer}>
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
                </View>
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
            </View>
            <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="date"
                onConfirm={handleConfirm}
                onCancel={hideDatePicker}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        top: 50,
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
});
