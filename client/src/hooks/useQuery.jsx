import { useCallback, useEffect, useState } from "react";
import apiFetch from "../utils/apiFetch";
import logger from "../utils/logger";

const cache = {};

export default function useQuery(url, dependencies = [], options = null) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadData = useCallback(async () => {
    const cacheUrlKey = url;
    const cachePathnameKey = url.split("?")[0];

    const addToCache = (newData) => {
      cache[cacheUrlKey] = newData;
      cache[cachePathnameKey] = newData;
    };

    const deleteFromCache = () => {
      delete cache[cacheUrlKey];
      delete cache[cachePathnameKey];
    };

    try {
      setIsLoading(true);

      if (options) {
        const cachedData = cache[options.cacheKey];

        if (cachedData) {
          if (typeof cachedData === "object" && cachedData.data) {
            const foundData = cachedData.data.find(
              (item) => String(item.id) === String(options.findId)
            );

            if (foundData) {
              setData(foundData);
            }
          }
        }
      } else {
        const cachedData = cache[cacheUrlKey];

        if (cachedData) {
          setData(cachedData);
        }
      }

      const response = await apiFetch(url);

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const newData = await response.json();

      if (newData) {
        setData(newData);
        addToCache(newData);
      } else {
        setData(null);
        deleteFromCache();
      }
    } catch (error) {
      logger.error("API fetch failed:", error);

      setData(null);
      deleteFromCache();
    } finally {
      setIsLoading(false);
    }
  }, [JSON.stringify(dependencies), JSON.stringify(options), url]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data: data?.data ?? data,
    isLoading,
    refetch: () => loadData(),
    total: data?.total,
  };
}
