import { Component, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FuseConfigService } from '@fuse/services/config';
import { AppConfig } from 'app/core/config/app.config';
import { AnimationOptions } from 'ngx-lottie';
import { Subject, takeUntil } from 'rxjs';
import * as robotAnimationData from 'assets/robot.json';
import { ChatbotService } from 'app/shared/services/chatbotService/chatbot.service';

@Component({
  selector: 'chatbot',
  templateUrl: './chatbot.component.html',
  styles: [
    `
        chatbot {
            position: static;
            display: block;
            flex: none;
            width: auto;
        }

        .chatbot-drawer {
          background-color: #0017d6;
          background-image: linear-gradient(0deg, #0B63CB 0%, #08032b 60%);
        }

        .quick-chat-header {
            background-color: #0d47a1;
        }

        .robot-bg {
        background-color: #05174c;
        background-image: linear-gradient(0deg, #05174c 12%, #08AEEA 95%);
        }

        .tail-container {
         position: absolute;
         bottom: -6px; 
         left: 90%;
         transform: translateX(-50%) rotate(-35deg);
         height: 15px; 
         width: 15px; 
         }
    `
],
encapsulation: ViewEncapsulation.None
})
export class ChatbotComponent implements OnInit, OnDestroy {
    @ViewChild('chatbotDrawer') chatbotDrawer: any;
    config: AppConfig;
    showChat: boolean = false;
    chat: any = {
        messages: [] // Start with an empty message array
    };
    private _unsubscribeAll: Subject<any> = new Subject<any>();
  
    lottieOptions: AnimationOptions = {
      animationData: robotAnimationData
    };
  
    constructor(
        private _fuseConfigService: FuseConfigService,
        private chatbotService: ChatbotService
    ) {
    }
  
    ngOnInit(): void {
        this._fuseConfigService.config$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config: AppConfig) => {
                this.config = config;
            });
    }
  
    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }
  
    toggleChat(): void {
        this.showChat = !this.showChat;
        this.chatbotDrawer.toggle();
    }
  
    sendMessage(message: string): void {
      if (message.trim()) {
        this.chat.messages.push({ value: message, isMine: true });
        this.chatbotService.sendMessage(message).subscribe({
          next: (response) => {
            this.chat.messages.push({ value: response.response, isMine: false });
          },
          error: (error) => {
            console.error('Error sending message to chatbot:', error);
          }
        });
      }
    }
  
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
  }
  
