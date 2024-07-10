import { Appointment } from "../appointment/appointment";
import { User } from "../users/user";
import { v4 as uuidv4 } from 'uuid';

export class Notification {
    public id: string;
    notificationStatus: 'READ' | 'UNREAD';
    sender: User;
    recipient: User;
    title: string;
    message: string;
    sentAt: Date;
    appointment: Appointment;
    read: boolean = false;

    constructor() {
        this.id = uuidv4();
      }
}
