import { useState, useEffect } from "react";
import { ApiResponseGiftsHistory, GiftHistoryItem } from "@/types/global";

const useFetchGiftsHistory = (url: string, token: string) => {
  const [data, setData] = useState<GiftHistoryItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Error response:", errorText);
          throw new Error("Network response was not ok");
        }

        const result: ApiResponseGiftsHistory = await response.json();

        if (result.code === 0) {
          const filteredData = result.response.filter(
            (item) => item.giftName !== "THANK YOU"
          );
          setData(filteredData);
        } else {
          console.error("API returned error code:", result.code);
          throw new Error(result.title);
        }
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unknown error occurred");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, token]);

  return { data, loading, error };
};

export default useFetchGiftsHistory;
