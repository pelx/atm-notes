import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Note } from 'src/app/models/note';
import { NavController } from '@ionic/angular';
import { AtmsService } from '../../atms.service';

@Component({
    selector: 'app-edit-note',
    templateUrl: './edit-note.page.html',
    styleUrls: ['./edit-note.page.scss'],
})
export class EditNotePage implements OnInit {
    note: Note;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private atmsServise: AtmsService
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(param => {
            if (!param.has('lessonId')) {
                this.navCtrl.navigateBack('/atms/tabs/notes');
                return;
            }
            this.note = this.atmsServise.getNote(param.get('lessonId'));
        })
    }

}
