import { v4 as uuidv4 } from 'uuid';
import { Doctor } from '../users/doctor/doctor';
import { Patient } from '../users/patient/patient';

export class Review {
    id?: string;
    rating: number;
    reviewText: string;
    timestamp: Date;
    appointmentId: string;
    doctor: Doctor;
    patient: Patient;

    constructor() {
        this.id = uuidv4();
    }
}
