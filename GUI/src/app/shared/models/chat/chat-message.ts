import { v4 as uuidv4 } from 'uuid';

export class ChatMessage {
    public id: string;
    chatRoomId: string;
    recipientId: string;
    senderId: string;
    content: string;
    timestamp: Date;

    constructor() {
        this.id = uuidv4();
        this.chatRoomId = uuidv4();
        this.recipientId = uuidv4();
        this.senderId = uuidv4();
      }
}
