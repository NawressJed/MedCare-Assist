import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { UserService } from 'app/shared/services/userService/user.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'chat-new-chat',
    templateUrl: './new-chat.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewChatComponent implements OnInit, OnDestroy {
    @Input() drawer: MatDrawer;
    @Output() contactSelected = new EventEmitter<string>();
    contacts: any[] = [];
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    constructor(
        private _userService: UserService,
        private _changeDetectorRef: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.fetchContacts();

    }

    ngOnDestroy(): void {
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    fetchContacts(): void {
        this._userService.getDoctorsList()
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((doctors) => {
                this.contacts = doctors.map(doctor => ({
                    id: doctor.id,
                    firstname: doctor.firstname,
                    lastname: doctor.lastname
                }));
                this._changeDetectorRef.markForCheck();
            });
    }

    openConversation(contact: any): void {
        this.drawer.close().then(() => {
            this.contactSelected.emit(contact.id);
        });
    }

    trackByFn(index: number, item: any): any {
        return item.id || index;
    }
}
