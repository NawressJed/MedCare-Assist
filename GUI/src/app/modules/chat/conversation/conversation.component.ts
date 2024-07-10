import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'app/shared/services/chatService/chat.service';
import { UserService } from 'app/shared/services/userService/user.service';
import { CookieService } from 'ngx-cookie-service';
import { User } from 'app/shared/models/users/user';
import { FuseMediaWatcherService } from '@fuse/services/media-watcher';
import { WebSocketService } from 'app/shared/services/webSocketService/web-socket.service';
import { Patient } from 'app/shared/models/users/patient/patient';
import { Doctor } from 'app/shared/models/users/doctor/doctor';

@Component({
    selector: 'chat-conversation',
    templateUrl: './conversation.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConversationComponent implements OnInit, OnDestroy {
    @ViewChild('messageInput') messageInput: ElementRef;
    chat: any = { messages: [], recipient: null };
    drawerMode: 'over' | 'side' = 'side';
    drawerOpened: boolean = false;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    authenticatedUser: User;
    recipient: User;

    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _chatService: ChatService,
        private _ngZone: NgZone,
        private _fuseMediaWatcherService: FuseMediaWatcherService,
        private _route: ActivatedRoute,
        private _userService: UserService,
        private _cookieService: CookieService,
        private _webSocketService: WebSocketService
    ) { }

    @HostListener('input')
    @HostListener('ngModelChange')
    private _resizeMessageInput(): void {
        this._ngZone.runOutsideAngular(() => {
            setTimeout(() => {
                this.messageInput.nativeElement.style.height = 'auto';
                this._changeDetectorRef.detectChanges();
                this.messageInput.nativeElement.style.height = `${this.messageInput.nativeElement.scrollHeight}px`;
                this._changeDetectorRef.markForCheck();
            });
        });
    }

    ngOnInit(): void {
        
        const userId = this._cookieService.get("id");

        this.getAuthenticatedUser(userId);
        this._webSocketService.authenticatedUserId = userId;

        this._route.params
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(params => {
                const recipientId = params['id'];
                if (recipientId) {
                    this.loadConversation(userId, recipientId);
                }
            });

        this._fuseMediaWatcherService.onMediaChange$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(({ matchingAliases }) => {
                this.drawerMode = matchingAliases.includes('lg') ? 'side' : 'over';
                this._changeDetectorRef.markForCheck();
            });

            this._webSocketService.chatMessageReceived.pipe(
                takeUntil(this._unsubscribeAll)
              ).subscribe(message => {
                this.chat.messages.push(message);
                this._changeDetectorRef.markForCheck();
              });
    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    getAuthenticatedUser(id: string): void {
        this._userService.getUser(id).subscribe({
            next: (result) => {
                this.authenticatedUser = result;
            },
            error: (err) => {
                console.error('Failed to fetch authenticated user details', err);
            }
        });
    }

    openContactInfo(): void {
        this.drawerOpened = true;
        this._changeDetectorRef.markForCheck();
    }

    resetChat(): void {
        this.drawerOpened = false;
        this._changeDetectorRef.markForCheck();
    }

    toggleMuteNotifications(): void {
        this.chat.muted = !this.chat.muted;
    }

    loadConversation(senderId: string, recipientId: string): void {
        this._chatService.getChats(senderId, recipientId).pipe(takeUntil(this._unsubscribeAll)).subscribe({
            next: (messages) => {
                this.chat.messages = this.sortMessagesByTimestamp(messages.map(msg => ({
                    ...msg,
                    isMine: msg.senderId === this.authenticatedUser.id,
                    timestamp: new Date(msg.timestamp)
                })));
                this.loadRecipientDetails(recipientId);
                this._changeDetectorRef.markForCheck();
            },
            error: (err) => console.error('Failed to load conversation messages', err)
        });
    }

    loadRecipientDetails(recipientId: string): void {
        this._userService.getUser(recipientId).pipe(takeUntil(this._unsubscribeAll)).subscribe({
            next: (user) => {
                this.recipient = user;
    
                if (isPatient(this.recipient)) {
                    this._userService.getPatient(this.recipient.id).subscribe({
                        next: (patientDetails) => {
                            Object.assign(this.recipient, patientDetails);
                            this._changeDetectorRef.markForCheck();
                        },
                        error: (err) => {
                            console.error('Failed to fetch patient details', err);
                        }
                    });
                } else if (isDoctor(this.recipient)) {
                    this._userService.getDoctor(this.recipient.id).subscribe({
                        next: (doctorDetails) => {
                            Object.assign(this.recipient, doctorDetails);
                            this._changeDetectorRef.markForCheck();
                        },
                        error: (err) => {
                            console.error('Failed to fetch doctor details', err);
                        }
                    });
                }
            },
            error: (err) => {
                console.error('Failed to fetch recipient details', err);
            }
        });
    }
    
    sortMessagesByTimestamp(messages: any[]): any[] {
        return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    sendMessage(): void {
        const messageContent = this.messageInput.nativeElement.value;
        if (!messageContent.trim()) {
            return;
        }
        const message = {
            senderId: this.authenticatedUser.id,
            recipientId: this.recipient.id,
            content: messageContent,
            timestamp: new Date().toISOString()
        };
        this._webSocketService.sendMessage('/app/chat.send', message);
        this.messageInput.nativeElement.value = '';
        this.chat.messages.push(message);
        this._changeDetectorRef.markForCheck();
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
    
}


function isPatient(user: User): user is Patient {
    return user.role === 'ROLE_PATIENT';
}

function isDoctor(user: User): user is Doctor {
    return user.role === 'ROLE_DOCTOR';
}