import { useState, useEffect } from "react";
import { ApiResponseGiftDetailSpin, GiftItemDetailSpin } from "@/types/global";

const useFetchGiftDetailSpin = (url: string, token: string) => {
  const [data, setData] = useState<GiftItemDetailSpin | null>(null);
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

        const result: ApiResponseGiftDetailSpin = await response.json();
        console.log("response : ", result.response);

        if (result.code === 0) {
          setData(result.response);
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

export default useFetchGiftDetailSpin;
