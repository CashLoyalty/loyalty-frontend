import React from 'react';
import { Tabs } from 'expo-router';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from '@/constants/Colors';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={({ route }) => ({
                tabBarIcon: ({ color, focused }) => {
                    let iconName;
                    if (route.name === "index") {
                        iconName = require("@/assets/icons/home.png");
                    } else if (route.name === "award/index") {
                        iconName = require("@/assets/icons/award.png");
                    } else if (route.name === "task/index") {
                        iconName = require("@/assets/icons/task.png");
                    } else if (route.name === "research/index") {
                        iconName = require("@/assets/icons/research.png");
                    }

                    const tintColor = focused ? Colors.primaryColor : color;

                    return (
                        <Image
                            style={[styles.icon, { tintColor }]}
                            source={iconName}
                        />
                    );
                },
                tabBarLabel: ({ focused, color }) => {
                    let label;
                    if (route.name === "index") {
                        label = "Нүүр";
                    } else if (route.name === "award/index") {
                        label = "Шагнал";
                    } else if (route.name === "task/index") {
                        label = "Даалгавар";
                    } else if (route.name === "research/index") {
                        label = "Судалгаа";
                    }
                    
                    const tintColorLabel = focused ? Colors.primaryColor : color;

                    return (
                        <View style={styles.labelContainer}>
                            <Text style={[styles.label, { color: tintColorLabel }]}>
                                {label}
                            </Text>
                        </View>
                    );
                },
                headerShown: false,
                tabBarShowLabel: true, 
                tabBarStyle: styles.tabBar, 
            })}
        >
            <Tabs.Screen name='index'/>
            <Tabs.Screen name='award/index'/>
            <Tabs.Screen name='task/index'/>
            <Tabs.Screen name='research/index'/>
        </Tabs>
    );
}

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
    tabBar: {
        height: 80, 
        paddingBottom: 20, 
    },
    labelContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        fontSize: 12,
        fontWeight: 'bold',
    },
});
