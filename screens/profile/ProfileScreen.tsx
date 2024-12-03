import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Text, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserResponse } from '@/types/global';
import useFetchUser from '@/hooks/useFetchUser';

interface ProgressBarProps {
    progress: number;
    total: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total }) => {
    const progressPercent = (progress / total) * 100;

    return (
        <View style={styles.proccessBarcontainer}>
            <View style={styles.processBarInfo}>
                <Text style={styles.levelText}>ТҮВШИН 1</Text>
                <Text style={styles.progressText}>{`${progress}/${total}`}</Text>
            </View>
            <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
            </View>
        </View>
    );
};

export default function ProfileScreen() {

    const [token, setToken] = useState<string>('');
    const [userData, setUserData] = useState<UserResponse | null>(null);
    const [userError, setUserError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem('token');
                console.log("Fetched Token: ", storedToken);
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

    const { data, loading: userLoading, error: userErrorFetched } = useFetchUser('https://server-w6thjpmvcq-uc.a.run.app/api/user', token);

    useEffect(() => {
        if (data) {
            console.log("User Data:", data);
            setUserData(data);
        }
        if (userErrorFetched) {
            console.error("Error fetching user data:", userErrorFetched);
            setUserError(userErrorFetched);
        }
    }, [data, userErrorFetched]);

    const handleBackPress = () => {
        router.back();
    };

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token'); 
            console.log("Token removed successfully");
        } catch (error) {
            console.error("Failed to remove token: ", error);
        } finally {
            router.navigate("/(routes)/login"); 
        }
    };
    
    const handleInformation = () => {
        console.log("handleInformation");
        router.navigate("/(routes)/information");
    };

    const handleChangePinCode = () => {
        console.log("handleChangePinCode");
        router.navigate("/(routes)/changePinCode");
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
            <TouchableOpacity onPress={handleBackPress} style={styles.backContainer}>
                    <Ionicons name="arrow-back" size={24} color={Colors.primaryColor} />
            </TouchableOpacity>    
            <View style={styles.card}>
                <View style={styles.content}>
                    <View style={styles.profileRowContainer}>
                        <View style={styles.profileContainer}>
                            <Image 
                                source={require("@/assets/icons/profile.png")}
                                style={styles.profileImage}
                            />
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.memberTypeText}>NEWBIE ГИШҮҮН</Text>
                            <View style={styles.scoreRowContainer}>
                                <Image 
                                    source={require("@/assets/images/header-pepsi-logo.png")}
                                    style={styles.logoImage}
                                />
                                <Text style={styles.scoreText}>
                                    {userData?.point !== undefined ? userData.point : "*"} 
                                </Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View>
                    <ProgressBar progress={3} total={10} />
                </View>
            </View>
            <View style={styles.info}>
                <View style={styles.imagesContainer}>
                    <View style={styles.imageWithText}>
                        <Image
                            source={require("@/assets/icons/stoppleInfo.png")} 
                            style={styles.infoImage} 
                        />
                        <Text style={styles.historyText}>Бүртгүүлсэн</Text>
                        <Text style={styles.historyText}>бөглөө</Text>
                    </View>
                    <View style={styles.imageWithText}>
                        <Image
                            source={require("@/assets/icons/taskInfo.png")} 
                            style={styles.infoImage} 
                        />
                        <Text style={styles.historyText}>Биелэсэн</Text>
                        <Text style={styles.historyText}>даалгавар</Text>
                    </View>
                    <View style={styles.imageWithText}>
                        <Image
                            source={require("@/assets/icons/researchInfo.png")} 
                            style={styles.infoImage} 
                        />
                        <Text style={styles.historyText}>Судалгаанд</Text>
                        <Text style={styles.historyText}>оролцсон</Text>
                    </View>
                </View>
                <View style={styles.countsContainer}>
                    <View style={styles.countColumn}>
                        <Text style={styles.countText}>{userData?.lottoCount !== undefined ? userData.lottoCount : "*"}</Text>
                    </View>
                    <View style={styles.countColumn}>
                        <Text style={styles.countText}>0</Text>
                    </View>
                    <View style={styles.countColumn}>
                        <Text style={styles.countText}>0</Text>
                    </View>
                </View>
            </View>
            <View style={styles.menu}>
                <TouchableOpacity style={styles.menuItem} onPress={handleInformation}>
                    <View style={styles.menuItemContent}>
                        <Ionicons name="person" size={26} color={Colors.primaryColor} />
                        <Text style={styles.menuItemText}>Миний мэдээлэл</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Colors.primaryColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleChangePinCode}>
                    <View style={styles.menuItemContent}>
                        <Ionicons name="lock-closed" size={26} color={Colors.primaryColor} />
                        <Text style={styles.menuItemText}>Пин код өөрчлөх</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Colors.primaryColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuItemContent}>
                        <Ionicons name="pricetags" size={26} color={Colors.primaryColor} />
                        <Text style={styles.menuItemText}>Миний хөнгөлөлт</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Colors.primaryColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuItemContent}>
                        <Ionicons name="help-circle" size={26} color={Colors.primaryColor} />
                        <Text style={styles.menuItemText}>Асуулт, хариулт</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Colors.primaryColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <View style={styles.menuItemContent}>
                        <Ionicons name="alert-circle" size={26} color={Colors.primaryColor} />
                        <Text style={styles.menuItemText}>Үйлчилгээний нөхцөл</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Colors.primaryColor} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                    <View style={styles.menuItemContent}>
                        <Ionicons name="log-out" size={26} color={Colors.red} />
                        <Text style={styles.menuItemLogoutText}>Системээс гарах</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Colors.red} />
                </TouchableOpacity>
            </View>
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
    processBarInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        bottom: 5,
    },
    proccessBarcontainer: {
        paddingHorizontal: 10,
    },
    card: {
        backgroundColor: Colors.primaryColor,
        borderRadius: 10,
        height: 140,
        marginTop: 10,
        marginHorizontal: 10,
        justifyContent: 'center',
    },
    content: {
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    profileRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileContainer: {
        flexDirection: 'column',
        alignItems: 'center',
        marginRight: 10,
    },
    infoContainer: {
        flex: 1,
        marginLeft: 10,
    },
    profileImage: {
        width: 68,
        height: 68,
        borderRadius: 34,
    },
    levelText: {
        color: Colors.white,
        fontSize: 13,
        fontWeight: "600",
        fontFamily: 'Inter',
        marginTop: 5,
    },
    memberTypeText: {
        color: Colors.white,
        fontSize: 13,
        fontWeight: "600",
        fontFamily: 'Inter',
        marginBottom: 5,
    },
    logoImage: {
        width: 30,
        height: 30,
    },
    scoreText: {
        color: Colors.white,
        fontSize: 23,
        fontWeight: "bold",
    },
    scoreRowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    info: {
        backgroundColor: Colors.white,
        borderRadius: 10,
        height: 150,
        marginTop: 10,
        marginHorizontal: 10,
    },
    imagesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '60%',
        marginBottom: 20,
        marginTop: 5,
    },
    imageWithText: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        marginHorizontal: 10,
    },
    infoImage: {
        width: 40,
        height: 40,
    },
    historyText: {
        fontSize: 16,
        textAlign: 'center',
        color: Colors.primaryColor,
        fontWeight: '600',
    },
    countsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    countColumn: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    countText: {
        fontSize: 18,
        textAlign: 'center',
        color: Colors.black,
        fontWeight: 'bold',
    },
    menu: {
        backgroundColor: Colors.white,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        marginTop: 10,
        height: '100%',
        padding: 30,
    },
    menuItem: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 30,
    },
    menuItemContent: {
        flexDirection: "row",
        alignItems: "center",
        columnGap: 30,
    },
    menuItemText: {
        fontSize: 16,
        color: Colors.primaryColor,
        fontWeight: '600',
    },
    menuItemLogoutText: {
        fontSize: 16,
        color: Colors.red,
        fontWeight: '600',
    },
    progressText: {
        color: Colors.white,
        fontSize: 16,
        fontFamily: 'Inter',
        marginBottom: 5,
    },
    progressBar: {
        height: 10,
        width: '100%',
        backgroundColor: '#e0e0e0', 
        borderRadius: 5,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#3b5998', 
        borderRadius: 5,
    },
});
