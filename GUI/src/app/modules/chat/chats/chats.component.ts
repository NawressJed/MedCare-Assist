import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { User } from 'app/shared/models/users/user';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
import { Subject, forkJoin } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';
import { ChatService } from 'app/shared/services/chatService/chat.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChatMessage } from 'app/shared/models/chat/chat-message';

@Component({
    selector: 'chat-chats',
    templateUrl: './chats.component.html',
    styleUrls: ['./chats.component.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatsComponent implements OnInit, OnDestroy {
    chats: any[] = [];
    drawerComponent: 'new-chat';
    drawerOpened: boolean = false;
    filteredChats: any[];

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
        private _router: Router,
        private _route: ActivatedRoute
    ) {}

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

    openNewChat(): void {
        this.drawerComponent = 'new-chat';
        this.drawerOpened = true;
        this._changeDetectorRef.markForCheck();
    }

    getAuthenticatedUser(id: string): void {
        this._userService.getUser(id).subscribe({
            next: (result) => {
                this.authenticatedUser = result;
                this.fetchChats(); // Fetch chats after authenticated user is set
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

        this._chatService.getChatHistory().pipe(
            takeUntil(this._unsubscribeAll),
            switchMap(chats => {
                const chatRequests = chats.map(chat => {
                    const partnerId = chat.senderId === this.authenticatedUser.id ? chat.recipientId : chat.senderId;
                    return this._userService.getUser(partnerId).pipe(
                        map(user => ({
                            ...chat,
                            partnerId,
                            name: `${user.firstname} ${user.lastname}`,
                            lastMessage: chat.content,
                            lastMessageDate: new Date(chat.timestamp).toLocaleDateString(),
                            unreadCount: 0 // Assuming you have a way to get the unread count
                        }))
                    );
                });
                return forkJoin(chatRequests);
            })
        ).subscribe({
            next: (chats) => {
                this.chats = chats;
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
