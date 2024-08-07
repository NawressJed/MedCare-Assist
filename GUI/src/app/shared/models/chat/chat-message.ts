import { v4 as uuidv4 } from 'uuid';

export class ChatMessage {
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: Date;

    constructor() {
        this.recipientId = uuidv4();
        this.senderId = uuidv4();
      }
}
