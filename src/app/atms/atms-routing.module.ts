import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AtmsPage } from './atms.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: AtmsPage,
        children: [
            {
                path: 'collections',
                children: [
                    {
                        path: '',
                        loadChildren: './collections/collections.module#CollectionsPageModule'
                    },
                    {
                        path: ':id',
                        loadChildren: './collections/collection/collection.module#CollectionPageModule'

                    }
                ]
            },
            {
                path: 'notes',
                children: [
                    {
                        path: '',
                        loadChildren: './notes/notes.module#NotesPageModule'
                    },
                    {
                        path: 'new',
                        loadChildren: './notes/new-note/new-note.module#NewNotePageModule'
                    },
                    {
                        path: 'edit/:noteId',
                        loadChildren: './notes/edit-note/edit-note.module#EditNotePageModule'
                    },
                ]
            },
            {
                path: '',
                redirectTo: '/atms/tabs/collections',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/atms/tabs/collections',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule]
})
export class AtmsRoutingModule { }
