import { User } from "../users/user";
import { v4 as uuidv4 } from 'uuid';

export class Notification {
    public id: string;
    notificationStatus: string;
    sender: User;
    recipient: User;
    title: string;
    message: string;
    sentAt: Date;

    constructor() {
        this.id = uuidv4();
      }
}
