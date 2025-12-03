export type ErrorsType = Record<
    string,
    {
        msg: string;
        [key: string]: any;
    }
>;

export class ErrorWithStatus {
    message: string;
    status: number;
    constructor({ message, status }: { message: string; status: number }) {
        this.message = message;
        this.status = status;
    }
}
