import { Response } from "express";
import ExcelJS from "exceljs";
interface ColumnType {
    header: string;
    key: string;
    width: number;
}
class GenerateFileExcel {
    private name: string;
    private worksheet: ExcelJS.Worksheet;
    private workbook: ExcelJS.Workbook;
    constructor(name: string) {
        this.workbook = new ExcelJS.Workbook();
        this.workbook.created = new Date();
        this.workbook.modified = new Date();
        this.worksheet = this.workbook.addWorksheet(name);
        this.name = name;
    }

    setupColumns = (columns: ColumnType[]) => {
        this.worksheet.columns = columns;
    };
    setupData = <T>(data: T) => {
        this.worksheet.addRows(data as any[]);
    };

    setHeader = (res: Response) => {
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename=" + `${this.name}.xlsx`);
    };

    execute = async (res: Response) => {
        return await this.workbook.xlsx.write(res);
    };
}
export default GenerateFileExcel;
