import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotesService } from '../notes.service';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';

@Component({
    selector: 'app-new-note',
    templateUrl: './new-note.page.html',
    styleUrls: ['./new-note.page.scss'],
})
export class NewNotePage implements OnInit {
    form: FormGroup

    constructor(
        private notesService: NotesService,
        private router: Router,
        private loadingCtrl: LoadingController
    ) { }
    ngOnInit() {

        this.form = new FormGroup({
            lessonTitle: new FormControl('Test Lesson'),
            lessonId: new FormControl('TEST001'),
            collectionId: new FormControl('My Collection'),
            rating: new FormControl(null, {
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
    }

    onCreateNote() {
        if (this.form.invalid) return;
        console.log(this.form.value);

        this.loadingCtrl
            .create({
                keyboardClose: true,
                message: 'Loading...',
                spinner: "lines"
            })
            .then(loadingEl => {
                loadingEl.present();
                this.notesService.addNote(
                    this.form.value.lessonTitle,
                    this.form.value.lessonId,
                    this.form.value.collectionId,
                    this.form.value.rating,
                    this.form.value.status,
                    this.form.value.level,
                    this.form.value.note
                )
                    .subscribe(() => {
                        loadingEl.dismiss();
                        this.form.reset();
                        this.router.navigate(['/atms/tabs/notes']);
                    });

            });
    }

}
