import { User } from "../user";

export class Patient extends User{
    dateOfBirth: Date = new Date();
}
