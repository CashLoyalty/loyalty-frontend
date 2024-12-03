import React from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native'; // Import Platform here
import Colors from '@/constants/Colors';

export default function Header() {
    
    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('@/assets/images/header-pepsi-logo.png')} style={styles.logo}/>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 79,
        width: "100%",
        alignItems: "center",
        marginBottom: 16,
        backgroundColor: Colors.primaryColor,
        zIndex: 1, 
    },
    logoContainer: {
        position: 'absolute',
        top: 36, 
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center', 
        zIndex: 2,
        // Shadow styles
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
    logo: {
        width: 90, 
        height: 90, 
    }
});
