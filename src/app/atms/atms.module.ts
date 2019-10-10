import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { AtmsPage } from './atms.page';
import { AtmsRoutingModule } from './atms-routing.module';

@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        AtmsRoutingModule
    ],
    declarations: [AtmsPage]
})
export class AtmsPageModule { }
