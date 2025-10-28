import { useState, useEffect } from "react";
import { ApiResponseGifts, GiftItem } from "@/types/global";

const useFetchActiveGifts = (url: string, token: string) => {
  const [data, setData] = useState<GiftItem[] | null>(null);
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
          console.log("Error response:", errorText);
          throw new Error("Network response was not ok");
        }

        const result: ApiResponseGifts = await response.json();

        if (result.code === 0) {
          // Sort by expiration date (sooner expiring first) or by name if no expiration date
          const sortedData = result.response.sort((a, b) => {
            if (a.expiresAt && b.expiresAt) {
              return (
                new Date(a.expiresAt).getTime() -
                new Date(b.expiresAt).getTime()
              );
            }
            if (a.expiresAt && !b.expiresAt) return -1;
            if (!a.expiresAt && b.expiresAt) return 1;
            return 0;
          });

          setData(sortedData);
        } else {
          console.log("API returned error code:", result.code);
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

export default useFetchActiveGifts;
