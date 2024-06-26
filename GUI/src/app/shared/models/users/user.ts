import { v4 as uuidv4 } from 'uuid';

export class User {
  public id: string;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  address: string;
  zipCode: string;
  phoneNumber: string;
  gender: string;
  role: string;

  constructor() {
    this.id = uuidv4();
  }
}