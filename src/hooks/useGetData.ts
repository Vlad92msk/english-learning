import { useCallback, useEffect, useState } from "react";
import { Collection } from "../types";
import { getData } from "../utils/getData";
import { addData } from "../utils/addData";
import { updateData } from "../utils/updateData";
import { deleteData } from "../utils/deleteData";

export const useGetData = <T, >(
    collectionName: Collection,
    queryParams?: Partial<T>,
) => {
    const [data, setData] = useState<T[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await getData<T>(collectionName, queryParams);
                setData(result);
            } catch (err) {
                setError(err as Error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [collectionName, JSON.stringify(queryParams)]);

    const onAdd = useCallback(async (data: T) => {
        setIsLoading(true);
        setError(null);
        try {
            await addData(collectionName, data);
            const result = await getData<T>(collectionName, queryParams);
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [collectionName, JSON.stringify(queryParams)]);

    const onUpdate = useCallback(async (id: string, data: Partial<T>) => {
        setIsLoading(true);
        setError(null);
        try {
            await updateData(collectionName, id, data);
            const result = await getData<T>(collectionName, queryParams);
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [collectionName, JSON.stringify(queryParams)]);

    const onRemove = useCallback(async (id: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await deleteData(collectionName, id);
            const result = await getData<T>(collectionName, queryParams);
            setData(result);
        } catch (err) {
            setError(err as Error);
        } finally {
            setIsLoading(false);
        }
    }, [collectionName, JSON.stringify(queryParams)]);

    return { data, isLoading, error, onAdd, onUpdate, onRemove };
}
