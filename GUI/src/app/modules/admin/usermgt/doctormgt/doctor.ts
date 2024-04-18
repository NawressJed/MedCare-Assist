import { User } from "../user";

export class Doctor extends User{
    officeAddress: string;
    consultationPrice: number;
    specialty: string;
}
