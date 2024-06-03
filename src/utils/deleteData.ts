import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../index";
import { Collection } from "../types";

export async function deleteData(collectionName: Collection, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
}
