import { Component, OnInit, Input } from '@angular/core';
import { Lesson } from 'src/app/models/lesson';
import { ModalController } from '@ionic/angular';

@Component({
    selector: 'app-lesson',
    templateUrl: './lesson.component.html',
    styleUrls: ['./lesson.component.scss'],
})
export class LessonComponent implements OnInit {
    @Input() selectedLesson: Lesson;

    constructor(
        private modalCtrl: ModalController
    ) { }

    ngOnInit() { }

    onPlay() {
        this.modalCtrl.dismiss({ message: 'Message from Modal' }, 'confirm');

    }

    onCancel() {
        this.modalCtrl.dismiss(null, 'cancel');
    }

}
