import { addDoc, collection } from "firebase/firestore";
import { db } from "../index";
import { Collection } from "../types";

export async function addData<T>(collectionName: Collection, data: T): Promise<void> {
    console.log('collectionName', collectionName)
    console.log('data', data)
    // @ts-ignore
    const docRef = await addDoc(collection(db, collectionName), data);
    console.log("Document written with ID: ", docRef.id);
}
