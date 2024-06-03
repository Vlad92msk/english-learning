import * as XLSX from "xlsx";

export const readExcel = <T, >(file: File): Promise<T[]> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, {type: 'array'});
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json: any[] = XLSX.utils.sheet_to_json(worksheet);

            const cards = json.map((card) => ({
                ...card,
                isLearning: card.isLearning === 'true',
                isIdiom: card.isIdiom === 'true',
                isPhrasalVerb: card.isPhrasalVerb === 'true',
            }))


            resolve(cards);
        };
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};
