import { use, useCallback, useEffect, useState, useTransition } from "react";
import apiFetch from "../utils/apiFetch";
import logger from "../utils/logger";
import SnackbarContext from "../contexts/snackbar";

const cache = {};

export default function useQuery(url, options = null) {
  const [data, setData] = useState(null);
  const [isPending, startTransition] = useTransition();

  const { enqueueSnackbar } = use(SnackbarContext);

  const optionsString = JSON.stringify(options);

  const loadData = useCallback(async () => {
    const cacheUrl = url;
    const cachePathname = url.split("?")[0];

    const addToCache = (newData) => {
      cache[cacheUrl] = newData;
      cache[cachePathname] = newData;
    };

    const deleteFromCache = () => {
      delete cache[cacheUrl];
      delete cache[cachePathname];
    };

    startTransition(async () => {
      try {
        if (options) {
          const cachedData = cache[options.cacheUrl];

          if (cachedData) {
            if (typeof cachedData === "object" && cachedData.data) {
              const foundData = cachedData.data.find(
                (item) => String(item.id) === String(options.id)
              );

              if (foundData) {
                setData(foundData);
              }
            }
          }
        } else {
          const cachedData = cache[cacheUrl];

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

        enqueueSnackbar("Failed to fetch data.", "danger");

        setData(null);
        deleteFromCache();
      }
    });
  }, [enqueueSnackbar, optionsString, url]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    data: data?.data ?? data,
    isLoading: isPending,
    refetch: () => loadData(),
    total: data?.total,
  };
}
