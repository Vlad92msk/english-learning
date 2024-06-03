import { readExcel } from "./readExcel";

export const uploadExcelData = async <T, >(file: File, onAdd: (data: T) => Promise<void>) => {
    try {
        const cards = await readExcel<T>(file);
        for (const card of cards) {
            await onAdd(card);
        }
        // alert('Data successfully uploaded.');
    } catch (error: any) {
        // alert('Error uploading data: ' + error.message);
    }
};
