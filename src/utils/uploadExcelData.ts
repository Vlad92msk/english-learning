import { readExcel } from "./readExcel";
import { addData } from "./addData";
import { Collection } from "../types";

const splitIntoChunks = <T>(array: T[], chunkSize: number): T[][] => {
    const chunks = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}

export const uploadExcelData = async <T extends { enValue: string }>(file: File, collectionName:  Collection, currentCards: T[], chunkSize: number = 50) => {
    try {
        const cards = await readExcel<T>(file);
        const filteredCards = cards.filter(card => !currentCards.some(currentCard => currentCard.enValue.trim().toLowerCase() === card.enValue.trim().toLowerCase()));
        const chunks = splitIntoChunks(filteredCards, chunkSize);

        for (const chunk of chunks) {
            await Promise.all(chunk.map(async (card) => {
                const newCard = {
                    ...card,
                    dateAdded: new Date(),
                }
                await addData(collectionName, newCard);
            })).finally(() => console.log(`Final, Загружено: ${filteredCards?.length || 0} файлов, Порций: ${chunks?.length || 0}`));
        }
        // alert('Data successfully uploaded.');
    } catch (error: any) {
        // alert('Error uploading data: ' + error.message);
    }
};
