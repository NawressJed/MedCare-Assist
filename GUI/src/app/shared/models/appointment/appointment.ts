import { v4 as uuidv4 } from 'uuid';
import { Doctor } from '../users/doctor/doctor';
import { Patient } from '../users/patient/patient';

export class Appointment {
    public id: string;
    date: string;
    time: string;
    appointmentStatus: string;
    doctor: Doctor
    patient: Patient

  constructor() {
    this.id = uuidv4();
  }
}
