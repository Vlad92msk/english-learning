import { collection, getDocs, orderBy, query, QueryConstraint, where } from "firebase/firestore";
import { db } from "../index";
import { Collection } from "../types";

export async function getData<T>(
    collectionName: Collection,
    params?: Partial<T>,
    sortOptions?: { field: keyof T; direction: 'asc' | 'desc' }): Promise<T[]> {
    const constraints: QueryConstraint[] = [];

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            constraints.push(where(key, '==', value));
        });
    }
    if (sortOptions) {
        constraints.push(orderBy(sortOptions.field as string, sortOptions.direction));
    }

    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as T[];
}
