import * as XLSX from "xlsx";

export const readExcel = <T,>(file: File): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                if (!worksheet) {
                    throw new Error("Worksheet is missing or empty");
                }
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);

                resolve(json);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};

// Функция для генерации уникального идентификатора
const generateId = () => {
    return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + new Date().getTime();
};


export const readLocalFileWithMeta = async <T,>(filePath: string): Promise<T[]> => {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`Failed to fetch file at ${filePath}: ${response.statusText}`);
        }
        const blob = await response.blob();
        const file = new File([blob], filePath);
        const data = await readExcel<T>(file);

        return data.map(item => ({
            ...item,
            id: generateId(),
            dateAdded: new Date().toISOString(),
            // @ts-ignore
            isLearning: item?.isLearning === 'true',
            // @ts-ignore
            isIdiom: item?.isIdiom === 'true',
            // @ts-ignore
            isPhrasalVerb: item?.isPhrasalVerb === 'true',
        }));
    } catch (error) {
        console.error(`Error reading local file at ${filePath}:`, error);
        throw error;
    }
};
