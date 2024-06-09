import * as XLSX from "xlsx";

export const createExcelFile = <T, >(cards: T[]): Blob => {
    const worksheet = XLSX.utils.json_to_sheet(cards);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Cards");

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    return new Blob([excelBuffer], { type: 'application/octet-stream' });
};
