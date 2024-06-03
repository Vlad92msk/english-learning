import { useEffect, useState } from "react";
import { collection, onSnapshot, orderBy, query, QueryConstraint, where } from "firebase/firestore";
import { db } from "../index";
import { Collection, SortOptions } from "../types";

export const useWatch = <T, >(
    collectionName: Collection,
    queryParams?: Partial<T>, sortOptions?: SortOptions<T>
) => {
    const [data, setData] = useState<T[]>([]);

    useEffect(() => {
        const collectionRef = collection(db, collectionName);
        const constraints: QueryConstraint[] = [];

        if (queryParams) {
            Object.entries(queryParams).forEach(([key, value]) => {
                constraints.push(where(key, '==', value));
            });
        }

        if (sortOptions) {
            constraints.push(orderBy(sortOptions.field as string, sortOptions.direction));
        }
        const q =  query(collectionRef, ...constraints);

        const unSubscribe = onSnapshot(q, (snapshot) => {
            const result = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as T[];

            setData(result);
        });

        return () => {
            unSubscribe();
        };
    }, [collectionName, JSON.stringify(queryParams), JSON.stringify(sortOptions)]);

    return data;
};
