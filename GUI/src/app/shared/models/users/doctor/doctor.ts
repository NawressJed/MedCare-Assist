import { Patient } from "../patient/patient";
import { User } from "../user";

export class Doctor extends User{
    workPhoneNumber: string;
    consultationPrice: number;
    specialty: string;
    myPatients: string[];
}
