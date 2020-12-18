import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
// tslint:disable-next-line: quotemark
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', redirectTo: '/auth', pathMatch: 'full' },
  // tslint:disable-next-line: quotemark
  { path: 'auth', loadChildren: './auth/auth.module#AuthPageModule' },
  {
    path: 'atms',
    loadChildren: './atms/atms.module#AtmsPageModule',
    canLoad: [AuthGuard]
  }
  // { path: 'notes', loadChildren: './notes/notes.module#NotesPageModule', canLoad: [AuthGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
