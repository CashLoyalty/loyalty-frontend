import { useState, useEffect } from 'react';
import { ApiResponse, UserResponse } from '@/types/global';

const useFetchUser = (url: string, token: string) => {
    const [data, setData] = useState<UserResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            return; // Skip fetching if no token
        }

        const fetchData = async () => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text(); 
                    console.error("Error response:", errorText);
                    throw new Error('Network response was not ok');
                }

                const result: ApiResponse = await response.json();
                console.log("API Response:", result); 

                if (result.code === 0) {
                    setData(result.response);
                } else {
                    console.error("Error code from API:", result.code);
                    throw new Error(result.title);
                }
            } catch (err: unknown) {
                if (err instanceof Error) {
                    setError(err.message); 
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [url, token]);

    return { data, loading, error };
};

export default useFetchUser;
