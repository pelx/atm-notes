import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Note } from 'src/app/models/note';
import { NavController, LoadingController, AlertController } from '@ionic/angular';
import { NotesService } from '../notes.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-edit-note',
    templateUrl: './edit-note.page.html',
    styleUrls: ['./edit-note.page.scss'],
})
export class EditNotePage implements OnInit {
    note: Note;
    form: FormGroup;
    private subs: Subscription;
    isLoading = false;
    noteId: string;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private notesServise: NotesService,
        private router: Router,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            if (!param.has('noteId')) {
                this.navCtrl.navigateBack('/atms/tabs/notes');
                return;
            }
            this.noteId = param.get('noteId');
            this.isLoading = true;

            this.notesServise.getNote(this.noteId)
                .subscribe(note => {
                    console.log(note)
                    this.note = note;
                    this.form = new FormGroup({
                        lessonTitle: new FormControl(this.note.lessonTitle),
                        lessonId: new FormControl(this.note.lessonId),
                        collectionId: new FormControl(this.note.collectionId),
                        rating: new FormControl(this.note.rating, {
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
                            header: 'An error occured!',
                            message: 'Notes couldnot be fetched. Please try again later',
                            buttons: [{
                                text: 'Okay',
                                handler: () => {
                                    this.router.navigate(['/atms/tabs/notes']);
                                }
                            }]
                        }).then(alertEl => {
                            alertEl.present();
                        });
                    }
                );

        });
        // this.note = this.notesServise.getNote(param.get('noteId'));
    }

    onUpdateNote() {
        if (this.form.invalid) return;

        this.loadingCtrl.create({
            message: 'Updating Notes...'
        })
            .then(loadingEl => {
                loadingEl.present();
                this.notesServise.updateNote(
                    this.note.noteId,
                    this.form.value.rating,
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

}
