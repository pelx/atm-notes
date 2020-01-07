import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from 'src/app/models/note';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { NotesService } from '../notes.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';

@Component({
    selector: 'app-edit-note',
    templateUrl: './edit-note.page.html',
    styleUrls: ['./edit-note.page.scss'],
    providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class EditNotePage implements OnInit, OnDestroy {
    private subs: Subscription;
    note: Note;
    form: FormGroup;
    isLoading = false;
    noteId: string;
    positions: any = [];

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private notesService: NotesService,
        private router: Router,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private location: Location
    ) { }

    ngOnInit() {
        this.positions = this.notesService.getPositions();
        this.route.paramMap.subscribe(param => {
            if (!param.has('noteId')) {
                // this.navCtrl.navigateBack('/atms/tabs/notes');
                this.location.back();
                return;
            }
            this.noteId = param.get('noteId');
            this.isLoading = true;

            this.subs = this.notesService.getNote(this.noteId)
                .subscribe(note => {
                    // console.log(note)
                    this.note = note;
                    this.form = new FormGroup({
                        collectionId: new FormControl(this.note.collectionId),
                        lessonId: new FormControl(this.note.lessonId),
                        lessonTitle: new FormControl(this.note.lessonTitle),
                        position: new FormControl(this.note.position, {
                            updateOn: 'blur',
                            validators: [Validators.required]
                        }),
                        status: new FormControl(this.note.status, {
                            updateOn: 'blur',
                            validators: [Validators.required]
                        }),
                        level: new FormControl(this.note.level, {
                            updateOn: 'blur',
                            validators: [Validators.required, Validators.min(1)]
                        }),
                        note: new FormControl(this.note.note, {
                            updateOn: 'blur',
                            validators: [Validators.required]
                        })
                    });
                    this.isLoading = false;
                },
                    error => {
                        this.alertCtrl.create({
                            header: 'An error occurred!',
                            message: 'Note could not be fetched. Please try again later',
                            buttons: [{
                                text: 'Okay',
                                handler: () => {
                                    // this.router.navigate(['/atms/tabs/notes']);
                                    this.location.back();
                                }
                            }]
                        }).then(alertEl => {
                            alertEl.present();
                        });
                    }
                );

        });
        // this.note = this.notesService.getNote(param.get('noteId'));
    }

    onUpdateNote() {
        if (this.form.invalid) {
            return;
        }

        this.loadingCtrl.create({
            message: 'Updating Notes...'
        })
            .then(loadingEl => {
                loadingEl.present();
                this.notesService
                    .updateNote(
                        this.note.noteId,
                        this.form.value.position,
                        this.form.value.status,
                        this.form.value.level,
                        this.form.value.note)
                    .subscribe(() => {
                        loadingEl.dismiss();
                        this.form.reset();
                        this.router.navigate(['/atms/tabs/notes']);
                    });

            })
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

}
