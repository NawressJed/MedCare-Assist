import { v4 as uuidv4 } from 'uuid';

export class ChatRoom {
    public id: string;
    recipientId: string;
    senderId: string;
    createdDate: Date;

    constructor() {
        this.id = uuidv4();
        this.recipientId = uuidv4();
        this.senderId = uuidv4();
      }
}
