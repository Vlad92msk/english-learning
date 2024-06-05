import { collection, getDocs, query, QueryConstraint, where } from "firebase/firestore";
import { db } from "../index";
import { Collection } from "../types";

export async function getData<T>(
    collectionName: Collection,
    params?: Partial<T>
): Promise<T[]> {
    const constraints: QueryConstraint[] = [];

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            constraints.push(where(key, '==', value));
        });
    }

    const q = query(collection(db, collectionName), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as T[];
}
