import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SharedModule } from 'app/shared/shared.module';
import { ChatComponent } from './chat.component';
import { ChatsComponent } from './chats/chats.component';
import { NewChatComponent } from './new-chat/new-chat.component';
import { ConversationComponent } from './conversation/conversation.component';
import { ContactInfoComponent } from './contact-info/contact-info.component';

export const routes: Route[] = [
    {
        path     : '',
        component: ChatComponent,
        children: [
            {
                path: '',
                component: ChatsComponent,
                children : [
                    {
                        path: ':id',
                        component: ConversationComponent
                    }
                ]
            }
        ]
    }
];

@NgModule({
    declarations: [
        ChatComponent,
        ChatsComponent,
        NewChatComponent,
        ConversationComponent,
        ContactInfoComponent
    ],
    imports     : [
        RouterModule.forChild(routes),
        MatButtonModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatSidenavModule,
        SharedModule
    ],
    exports: [
        ChatComponent
    ],
})
export class ChatModule
{
}
