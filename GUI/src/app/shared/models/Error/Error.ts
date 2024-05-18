export class Error {
    constructor(field: string, message: string) {
        this.field = field;
        this.message = message;
    }
    // eslint-disable-next-line @typescript-eslint/member-ordering
    field: string;
    // eslint-disable-next-line @typescript-eslint/member-ordering
    message: string;
}