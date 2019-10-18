import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotesService } from './notes.service';
import { Note } from 'src/app/models/note';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.page.html',
    styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit, OnDestroy {
    loadedNotes: Note[];
    private subs: Subscription;
    isLoading = false;

    constructor(
        private notesService: NotesService,
        private router: Router,
        private loadingCtrl: LoadingController
    ) { }

    ngOnInit() {
        this.subs = this.notesService.notes.subscribe(notes => {
            this.loadedNotes = notes;
        });
        // this.loadedNotes = this.notesService.notes;
    }

    ionViewWillEnter() {
        this.isLoading = true;
        this.notesService.fetchNotes()
            .subscribe(() => {
                this.isLoading = false;
            });
    }

    onDelete(noteId: string, slidingItem: IonItemSliding) {
        slidingItem.close();
        this.loadingCtrl.create({
            message: 'Deleting...'
        }).then(loadingEl => {
            loadingEl.present();
            this.notesService.deleteNote(noteId).subscribe(() => {
                loadingEl.dismiss();
            });
        })

    }

    onClick(noteId: string) {
        this.router.navigate(['/', 'atms', 'tabs', 'notes', 'edit', noteId]);
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }
}
