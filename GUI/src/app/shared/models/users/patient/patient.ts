import { Doctor } from "../doctor/doctor";
import { User } from "../user";

export class Patient extends User{
    dateOfBirth: Date = new Date();
    
}
