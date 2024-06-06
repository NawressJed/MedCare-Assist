import { v4 as uuidv4 } from 'uuid';

export class Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;

    constructor() {
        this.id = uuidv4();
    }
}
