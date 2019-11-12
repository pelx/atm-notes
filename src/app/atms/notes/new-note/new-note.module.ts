import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NewNotePage } from './new-note.page';
import { DataService } from '../../../shared/data.service';

const routes: Routes = [
    {
        path: '',
        component: NewNotePage
    }
];

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [NewNotePage],
    // providers: [DataService]

})
export class NewNotePageModule { }
