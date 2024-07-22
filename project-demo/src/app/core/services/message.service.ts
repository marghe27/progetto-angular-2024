import { Injectable } from '@angular/core';
import { Message } from '../models/message';
import { MOCK_MESSAGES } from '../mocks/mock-messages';



@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: Message[] = [];
 
  constructor() {  
  }

  
 
}
