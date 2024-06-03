import { doc, updateDoc } from "firebase/firestore";
import { db } from "../index";
import { Collection } from "../types";

export async function updateData<T>(collectionName: Collection, id: string, data: Partial<T>): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, data);
}
