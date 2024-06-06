import { v4 as uuidv4 } from 'uuid';
import { Medication } from '../medication/medication';
import { Patient } from '../users/patient/patient';
import { Doctor } from '../users/doctor/doctor';

export class MedicalFile {
    id: string;
    description: string;
    disease: string;
    date: Date = new Date;
    severity: string;
    patient: Patient;
    doctor: Doctor;
    medications: Medication[] = [];
    

    constructor() {
        this.id = uuidv4();
      }
}
