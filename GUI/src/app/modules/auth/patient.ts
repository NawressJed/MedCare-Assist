import { User } from "./user";

export class Patient extends User{
    address: string;
    birthDate: Date = new Date();
}
