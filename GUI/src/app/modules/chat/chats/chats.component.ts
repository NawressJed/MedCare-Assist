import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'app/shared/models/users/user';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import { ChatService } from 'app/shared/services/chatService/chat.service';
import { Router } from '@angular/router';
import { WebSocketService } from 'app/shared/services/webSocketService/web-socket.service';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'chat-chats',
    templateUrl: './chats.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit, OnDestroy {
    chats: any[] = [];
    drawerComponent: 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: any[] = [];

    name: string;
    lastname: string;

    authenticatedUser: User;
    selectedChat: any;

    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _cookieService: CookieService,
        private _userService: UserService,
        private _chatService: ChatService,
        private _webSocketService: WebSocketService,
        private _router: Router,
        private _datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.name = this._cookieService.get('name');
        this.lastname = this._cookieService.get('lastname');

        this.getAuthenticatedUser(this._cookieService.get('id'));
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    filterChats(query: string): void {
        if (!query) {
            this.filteredChats = this.chats;
            return;
        }
        this.filteredChats = this.chats.filter(chat => chat.name.toLowerCase().includes(query.toLowerCase()));
    }

    onContactSelected(contactId: string): void {
        console.log('Contact selected:', contactId);
        this.drawerOpened = false;
        this._router.navigate(['chat', contactId]).then(success => {
            console.log('Navigation success:', success);
        }).catch(error => {
            console.error('Navigation error:', error);
        });
    }    

    openNewChat(): void {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;
        this._changeDetectorRef.markForCheck();
    }

    getAuthenticatedUser(id: string): void {
        this._userService.getUser(id).subscribe({
            next: (result) => {
                this.authenticatedUser = result;
                this._webSocketService.setAuthenticatedUserId(id); 

                this._webSocketService.chatMessageReceived
                    .pipe(takeUntil(this._unsubscribeAll))
                    .subscribe(message => {
                        this.fetchChats(); 
                    });

                this.fetchChats();
                this._changeDetectorRef.markForCheck();
            },
            error: (error) => {
                console.error('Error fetching authenticated user:', error);
            }
        });
    }

    fetchChats(): void {
        if (!this.authenticatedUser) {
            console.error('Authenticated user is not set');
            return;
        }
    
        const chatbotId = '123e4567-e89b-12d3-a456-426614174000'; // Replace with the actual chatbot ID
    
        this._chatService.getChatHistory().pipe(
            takeUntil(this._unsubscribeAll),
            switchMap(chats => {
                const filteredChats = chats.filter(chat => chat.senderId !== chatbotId && chat.recipientId !== chatbotId);
                const chatRequests = filteredChats.map(chat => {
                    const partnerId = chat.senderId === this.authenticatedUser.id ? chat.recipientId : chat.senderId;
                    return this._userService.getUser(partnerId).pipe(
                        map(user => {
                            if (user) {
                                return {
                                    ...chat,
                                    partnerId,
                                    name: `${user.firstname} ${user.lastname}`,
                                    lastMessage: chat.content,
                                    lastMessageDate: new Date(chat.timestamp),
                                    formattedDate: this._datePipe.transform(new Date(chat.timestamp), 'dd/MM/yyyy'),
                                    unreadCount: 0 
                                };
                            } else {
                                console.warn(`User with id ${partnerId} not found`);
                                return {
                                    ...chat,
                                    partnerId,
                                    name: 'Unknown User',
                                    lastMessage: chat.content,
                                    lastMessageDate: new Date(chat.timestamp),
                                    formattedDate: this._datePipe.transform(new Date(chat.timestamp), 'dd/MM/yyyy'),
                                    unreadCount: 0 
                                };
                            }
                        })
                    );
                });
                return forkJoin(chatRequests);
            })
        ).subscribe({
            next: (chats) => {
                this.chats = chats.sort((a, b) => b.lastMessageDate.getTime() - a.lastMessageDate.getTime());
                this.filteredChats = this.chats;
                this._changeDetectorRef.markForCheck();
            },
            error: (error) => {
                console.error('Error fetching chat history:', error);
            }
        });
    }
  
    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
