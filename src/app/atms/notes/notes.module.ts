import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from './../../material.module';

import { IonicModule } from '@ionic/angular';

import { NotesPage } from './notes.page';

const routes: Routes = [
    {
        path: '',
        component: NotesPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes),
    ],
    declarations: [NotesPage]
})
export class NotesPageModule { }
