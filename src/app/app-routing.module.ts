import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
    { path: '', redirectTo: '/auth', pathMatch: 'full', },
    // { path: '', redirectTo: 'atms', pathMatch: 'full', },
    { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
    // { path: 'atms', loadChildren: '../app/atms/collections/collections.module#CollectionsPageModule', canLoad: [AuthGuard] },
    { path: 'atms', loadChildren: './atms/atms.module#AtmsPageModule', canLoad: [AuthGuard] },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
