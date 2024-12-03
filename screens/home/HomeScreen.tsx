import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, FlatList, Text, TouchableOpacity, Modal, TextInput, ActivityIndicator, Platform, Keyboard } from 'react-native';
import Header from '@/components/header/header';
import HeaderSecond from '@/components/headerSecond/headerSecond';
import HomeBannerSlider from '@/components/home/home.banner.slider';
import Colors from '@/constants/Colors';
import { useToast } from 'react-native-toast-notifications';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import usePointDetails from '@/hooks/usePointDetials';
import { SERVER_URI } from '@/utils/uri';
import { format } from 'date-fns';

const HomeScreen: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const toast = useToast();
    const [token, setToken] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [buttonSpinner, setButtonSpinner] = useState(false);

    const { pointDetails, loading: loadingPoints, fetchPointDetails } = usePointDetails(SERVER_URI);

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
            }
        };
        fetchToken();
    }, []);
    
    if (inputValue.length === 8) {
        Keyboard.dismiss();
    }

    const handleRegLotteryNum = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setInputValue('');
    };

    const handleChangeText = (text: string) => {
        const upperCaseText = text.toUpperCase(); 
        if (upperCaseText.length <= 8) {
            setInputValue(upperCaseText);
        }
    };

    const handleSave = async () => {
        setButtonSpinner(true);
        if (inputValue.length < 8) {
            toast.show(`Бөглөөний код буруу байна`, {
                type: 'info',
                placement: 'center',
                duration: 4000,
                animationType: 'slide-in',
                style: {
                    backgroundColor: Colors.primaryColor,
                },
            });
            return;
        }
        
        try {
            const response = await axios.post(
                `${SERVER_URI}/api/user/collectLotteryCode`,
                { code: inputValue },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.data.title === 'This code already registered.') {
                toast.show(`Бүртгэгдсэн бөглөө код байна`, {
                    type: 'warning',
                    placement: 'center',
                    duration: 4000,
                    animationType: 'slide-in',
                });
            }

            console.log("response title : " + response.data.title);
            if (response.data.code === 0) {
                toast.show(`Бөглөө код амжилттай бүртгэгдлээ`, {
                    type: 'success',
                    placement: 'center',
                    duration: 4000,
                    animationType: 'slide-in',
                });

                await fetchPointDetails();
            }
        } catch (error) {
            toast.show(`Код илгээхэд алдаа гарлаа`, {
                type: 'danger',
                placement: 'center',
                duration: 4000,
                animationType: 'slide-in',
                style: {
                    backgroundColor: Colors.primaryColor,
                },
            });
        } finally {
            setModalVisible(false); 
            setInputValue('');
            setButtonSpinner(false); 
        }
    };

    interface PointDetail {
        imgUrl: string;
        phoneNumber: string;
        eventCode: string;
        point: number;
        brandName: string; 
        lotteryCode: string;
        createdAt: string;
    }

    const renderPointDetail = ({ item }: { item: PointDetail }) => {
        let imageSource = require('@/assets/icons/pepsiIcon.png');
         
        switch (item.brandName) {
            case 'sevenup':
                imageSource = require('@/assets/icons/sevenupIcon.png');
                break;
            case 'pepsi':
                imageSource = require('@/assets/icons/pepsiIcon.png');
                break;
            case 'mountaindew':
                imageSource = require('@/assets/icons/mountaindewIcon.png');
                break;
            case 'lipton':
                imageSource = require('@/assets/icons/liptonIcon.png');
                break;
            case 'mirinda':
                imageSource = require('@/assets/icons/mirindaIcon.png');
                break;
            case 'sting':
                imageSource = require('@/assets/icons/stingIcon.png');
                break;
        }
        
        return (
            <View style={styles.lotteryItem}>
                <View style={styles.lotteryItemColumns}>
                    <View style={styles.imageContainer}>
                        <Image source={imageSource} style={styles.image} />
                    </View>
                    <View style={styles.infoContainer}>
                        <Text style={styles.codeText}>{item.lotteryCode || "N/A"}</Text>
                        <Text style={styles.typeText}>СУГАЛАА</Text>
                        <Text style={styles.dateText}>{item.createdAt ? format(new Date(item.createdAt), 'yyyy-MM-dd HH:mm:ss') : "No Date"}</Text>
                    </View>
                    <View style={styles.scoreContainer}>
                        <View style={styles.scoreBox}>
                            <Text style={styles.scoreText}>{item.point || 0}</Text>
                        </View>
                        <Text style={{ fontSize: 12 }}>ОНОО</Text>
                    </View>
                    <View style={styles.dotsContainer}>
                        <Image source={require('@/assets/icons/dots.png')} style={styles.dotsImage} />
                    </View>
                </View>
                <View style={styles.line} />
            </View>
        );
    };

    const filteredPointDetails = pointDetails.filter(
        (detail) => detail.eventCode === "COLLECT"
    );

    return (
        <View style={styles.container}>
            <Header />
            <HeaderSecond />
            <View style={styles.content}>
                <HomeBannerSlider />
            </View>
            {loadingPoints ? (
                <View style={styles.loaderContainer}>
                    <ActivityIndicator size="small" color={Colors.primaryColor} />
                </View>
            ) : (
                <FlatList
                    style={styles.lotteryList}
                    data={filteredPointDetails}
                    renderItem={renderPointDetail}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
            <View style={styles.registerLotteryContainer}>
                <View style={styles.lotteryNumber}>
                    <TouchableOpacity onPress={handleRegLotteryNum} accessibilityLabel="Register Lottery Number">
                        <Image source={require('@/assets/icons/lotteryNumber.png')} />
                    </TouchableOpacity>
                </View>
                <View style={styles.lotteryNumberQr}>
                    <TouchableOpacity onPress={() => {}} accessibilityLabel="Scan Lottery QR Code">
                        <Image source={require('@/assets/icons/lotteryNumberQR.png')} />
                    </TouchableOpacity>
                </View>
            </View>
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Код бүртгүүлэх</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Бөглөөний дугаар"
                            placeholderTextColor="#A1A1A1"
                            value={inputValue}
                            onChangeText={handleChangeText}
                        />
                        <View style={styles.modalButtonsContainer}>
                            <TouchableOpacity style={styles.modalButton} onPress={handleSave}>
                                {buttonSpinner ? (
                                    <ActivityIndicator size="small" color={Colors.primaryColor} />
                                ) : (
                                    <Text style={styles.modalButtonText}>Илгээх</Text>
                                )}
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.modalButton} onPress={handleModalClose}>
                                <Text style={styles.modalButtonText}>Буцах</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    content: {
        flex: 1,
        marginTop: 10,
    },
    lotteryList: {
        backgroundColor: Colors.white,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        marginTop: 155,
        height: '50%',
        padding: 10,
        marginHorizontal: 10,
    },
    lotteryItem: {
        flex: 1,
    },
    lotteryItemColumns: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    imageContainer: {
        alignItems: 'center',
        marginRight: 5,
    },
    image: {
        width: 40,
        height: 40,
    },
    infoContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    codeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    typeText: {
        fontSize: 12,
    },
    dateText: {
        fontSize: 12,
    },
    scoreContainer: {
        alignItems: 'center',
        marginRight: 15,
    },
    scoreBox: {
        backgroundColor: Colors.primaryColor,
        alignItems: 'center',
        borderRadius: 6,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    scoreText: {
        color: Colors.white,
        fontWeight: 'bold',
        fontSize: 12,
    },
    dotsContainer: {
        alignItems: 'center',
    },
    dotsImage: {
        width: 30,
        height: 30,
    },
    line: {
        height: 1,
        backgroundColor: 'gray',
        marginTop: 10,
        marginBottom: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
        padding: 20,
        alignItems: 'flex-start',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.white,
        marginBottom: 10,
    },
    input: {
        width: '100%',
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: Colors.white,
        paddingHorizontal: 10,
        marginBottom: 20,
    },
    modalButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor: Colors.white,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    modalButtonText: {
        color: Colors.primaryColor,
        fontSize: 16,
    },
    registerLotteryContainer: {
        position: 'absolute',
        flexDirection: 'row',
        right: 10,
        bottom: 20,
    },
    lotteryNumber: {
        width: 45,
        height: 45,
        right: 20,
        bottom: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    lotteryNumberQr: {
        width: 45,
        height: 45,
        right: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.3,
                shadowRadius: 4,
            },
            android: {
                elevation: 4,
            },
        }),
    },
    loaderContainer: {
        flex: 1, // Take full height
        justifyContent: 'center', // Center vertically
        alignItems: 'center', // Center horizontally
        backgroundColor: Colors.white, // Optional: to ensure a consistent background
    },
    loaderImage: {
        width: 130, 
        height: 130,
        transform: [{ scale: 1.2 }], 
    },
});

export default HomeScreen;
