import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PointDetail {
    imgUrl: string;
    phoneNumber: string;
    eventCode: string;
    point: number;
    brandName: string;
    lotteryCode: string;
    createdAt: string;
}

const usePointDetails = (prodUrl: string) => {
    const [pointDetails, setPointDetails] = useState<PointDetail[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPointDetails = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = await AsyncStorage.getItem('token'); 

            if (!token) {
                setError('No authentication token found');
                return;
            }

            const response = await axios.get(`${prodUrl}/api/user/pointDetails`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            
            if (response.data.code === 0) {
                setPointDetails(response.data.response);
            } else {
                setError('Failed to fetch point details');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [prodUrl]);

    useEffect(() => {
        fetchPointDetails();
    }, [fetchPointDetails]);

    return { pointDetails, loading, error, fetchPointDetails }; // Expose the fetch function
};

export default usePointDetails;
