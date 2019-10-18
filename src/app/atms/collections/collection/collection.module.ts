import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { CollectionPage } from './collection.page';
import { LessonComponent } from './lesson/lesson.component';

const routes: Routes = [
    {
        path: '',
        component: CollectionPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes)
    ],
    declarations: [CollectionPage, LessonComponent],
    entryComponents: [LessonComponent]
})
export class CollectionPageModule { }
