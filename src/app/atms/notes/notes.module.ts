import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatTableExporterModule } from 'mat-table-exporter';

import { IonicModule } from '@ionic/angular';

import { NotesPage } from './notes.page';
import { MatPaginatorModule } from '@angular/material';

const routes: Routes = [
    {
        path: '',
        component: NotesPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        MatTableModule,
        MatTableExporterModule,
        MatPaginatorModule,
        FormsModule,
        ReactiveFormsModule,
        IonicModule,
        RouterModule.forChild(routes),
    ],
    declarations: [NotesPage]
})
export class NotesPageModule { }
