import { createExcelFile } from "./createExcel";

export const downloadExcel = <T, >(cards: T[]) => {
    const excelBlob = createExcelFile(cards);
    const url = URL.createObjectURL(excelBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cards.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};
