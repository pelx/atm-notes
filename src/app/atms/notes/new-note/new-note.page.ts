import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotesService } from '../notes.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { DataService } from '../../../shared/data.service';
import { Lesson } from 'src/app/models/lesson';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'app-new-note',
    templateUrl: './new-note.page.html',
    styleUrls: ['./new-note.page.scss'],
})
export class NewNotePage implements OnInit, OnDestroy {
    selectedLesson: Lesson;
    form: FormGroup;
    private subs: Subscription;
    isLoading = false;
    positions: any = [];

    constructor(
        private dataService: DataService,
        private notesService: NotesService,
        private loadingCtrl: LoadingController,
        private alertCtrl: AlertController,
        private router: Router
    ) { }

    ngOnInit() {
        this.positions = this.notesService.getPositions();
        this.subs = this.dataService.changedLesson.subscribe(lesson => {
            this.selectedLesson = lesson;
            // console.log("New Note", lesson);
            this.isLoading = true;

            // console.log("New Note", this.selectedLesson);

            const title = this.selectedLesson ? this.selectedLesson.lessonTitle : 'Test Lesson';
            const lessonId = this.selectedLesson ? this.selectedLesson.lessonId : '000';
            const collectionId = this.selectedLesson ? this.selectedLesson.collectionId : 'Not in Collection';

            this.form = new FormGroup({
                lessonTitle: new FormControl(title),
                lessonId: new FormControl(lessonId),
                collectionId: new FormControl(collectionId),
                position: new FormControl(null, {
                    updateOn: 'blur',
                    validators: [Validators.required]
                }),
                status: new FormControl(null, {
                    updateOn: 'blur',
                    validators: [Validators.required]
                }),
                level: new FormControl(null, {
                    updateOn: 'blur',
                    validators: [Validators.required, Validators.min(1)]
                }),
                note: new FormControl(null, {
                    updateOn: 'blur',
                    validators: [Validators.required]
                })

            });
            this.isLoading = false;

        });

    }

    ionViewWillEnter() {
        // this.isLoading = true;
    }
    ionDidLeave() {
        this.form.reset();
    }

    onCreateNote() {
        if (this.form.invalid) return;
        this.loadingCtrl
            .create({
                keyboardClose: true,
                message: 'Loading...',
                spinner: "lines"
            })
            .then(loadingEl => {
                loadingEl.present();
                this.notesService
                    .addNote(
                        this.form.value.lessonId,
                        this.form.value.lessonTitle,
                        this.form.value.collectionId,
                        this.form.value.position,
                        this.form.value.status,
                        this.form.value.level,
                        this.form.value.note
                    )
                    .subscribe(() => {
                        loadingEl.dismiss();
                        this.form.reset();
                        // this.location.back();
                        this.router.navigate(['/atms/tabs/notes']);
                    },
                        error => {
                            this.alertCtrl.create({
                                header: 'An error occured!',
                                message: 'Note could not be saved. Please try again later',
                                buttons: [{
                                    text: 'Okay',
                                    handler: () => {
                                        this.router.navigate(['/atms/tabs/notes']);
                                        // this.location.back();
                                    }
                                }]
                            }).then(alertEl => {
                                alertEl.present();
                            });
                        }

                    );

            });
    }

    ngOnDestroy() {
        if (this.subs) {
            this.subs.unsubscribe();
        }
    }

}
