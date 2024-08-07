import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseDrawerModule } from '@fuse/components/drawer';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ChatbotComponent } from './chatbot.component';
import { FormsModule } from '@angular/forms';
import { LottieModule } from 'ngx-lottie';
import player from 'lottie-web';

export function playerFactory() {
    return player;
  }

@NgModule({
    declarations: [
        ChatbotComponent
    ],
    imports     : [
        CommonModule,
        FormsModule,
        RouterModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatTooltipModule,
        FuseDrawerModule,
        MatButtonModule,
        LottieModule.forRoot({ player: playerFactory })
    ],
    exports     : [
        ChatbotComponent
    ]
})
export class ChatbotModule
{
}
