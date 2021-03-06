import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { NotesService } from './notes.service';
import { Note } from 'src/app/models/note';
import { IonItemSliding, LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
// import { MAT_TABLE_EXPORTER } from 'mat-table-exporter';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.page.html',
    styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit, OnDestroy {

    loadedNotes: Note[];
    private subs: Subscription;
    isLoading = false;
    displayedColumns: string[] = ['lessonId', 'lessonTitle', 'actions'];
    dataSource: MatTableDataSource<Note>;

    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private notesService: NotesService,
        private router: Router,
        private loadingCtrl: LoadingController,

    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.subs = this.notesService.fetchNotes()
            .subscribe((notes) => {
                this.loadedNotes = notes;
                this.isLoading = false;
                this.dataSource = new MatTableDataSource<Note>(this.loadedNotes);
                this.dataSource.paginator = this.paginator;
                this.dataSource.sort = this.sort;
            });

        // this.subs = this.notesService.notes.subscribe(notes => {
        //     this.loadedNotes = notes;
        // });
    }

    ionViewWillEnter() {
    }

    // onDelete(noteId: string, slidingItem: IonItemSliding) {
    //     slidingItem.close();
    //     this.loadingCtrl.create({
    //         message: 'Deleting...'
    //     }).then(loadingEl => {
    //         loadingEl.present();
    //         this.notesService.deleteNote(noteId).subscribe(() => {
    //             loadingEl.dismiss();
    //         });
    //     })

    // }

    onDelete(noteId: string) {
        this.loadingCtrl.create({
            message: 'Deleting...'
        }).then(loadingEl => {
            loadingEl.present();
            this.notesService.deleteNote(noteId).subscribe((notes) => {
                loadingEl.dismiss();
                this.loadedNotes = notes;
                // console.log("DELETE:", notes);
                this.isLoading = false;
                this.dataSource = new MatTableDataSource<Note>(this.loadedNotes.filter(note => note.noteId !== noteId));
            });
        })
    }

    onClick(noteId: string) {
        this.router.navigate(['/', 'atms', 'tabs', 'notes', 'edit', noteId]);
    }

    exportTable() {
        // exporter.exportTable('csv');
        this.loadedNotes.forEach(note => {
            console.log(note.lessonId, ',', note.lessonTitle, ',', note.createdOn.toISOString().substr(0, 10), ',', note.note);
        });

    }

    applyFilter(filterVal: string) {
        this.dataSource.filter = filterVal.trim().toLocaleLowerCase();
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }
}
