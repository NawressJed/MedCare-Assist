import { v4 as uuidv4 } from 'uuid';
import { Doctor } from "../users/doctor/doctor";

export class Schedule {
    public id: string;
    date: string;
    startTime: string;
    endTime: string;
    available: boolean;
    doctorId: string;

    constructor() {
        this.id = uuidv4();
      }
}
