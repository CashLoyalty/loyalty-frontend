import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'auth_token';

export const useAuthToken = () => {
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
                if (storedToken) {
                    setToken(storedToken);
                }
            } catch (error) {
                console.log('Failed to load token:', error);
            }
        };

        loadToken();
    }, []);

    const saveToken = async (newToken: string) => {
        try {
            await AsyncStorage.setItem(TOKEN_KEY, newToken);
            setToken(newToken);
        } catch (error) {
            console.log('Failed to save token:', error);
        }
    };

    const removeToken = async () => {
        try {
            await AsyncStorage.removeItem(TOKEN_KEY);
            setToken(null);
        } catch (error) {
            console.log('Failed to remove token:', error);
        }
    };

    return { token, saveToken, removeToken };
};
