import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { PopupTextPage } from './popup-text.page';

@NgModule({
    imports: [
        CommonModule,
        IonicModule
    ],
    declarations: [PopupTextPage],
    entryComponents: [PopupTextPage],
    exports: [PopupTextPage]
})
export class PopupTextPageModule { }
