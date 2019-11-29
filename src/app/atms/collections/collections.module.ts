import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';
// import { } from '@swimlane/ngx-datatable'

import { CollectionsPage } from './collections.page';
import { PopupTextPageModule } from '../../shared/pages/popup-text/popup-text.module';

const routes: Routes = [
    {
        path: '',
        component: CollectionsPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        PopupTextPageModule
    ],
    declarations: [CollectionsPage],
})
export class CollectionsPageModule { }
