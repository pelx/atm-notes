import { Component, OnInit } from '@angular/core';
import { AtmsService } from '../atms.service';
import { Note } from 'src/app/models/note';

@Component({
    selector: 'app-notes',
    templateUrl: './notes.page.html',
    styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
    notes: Note[];

    constructor(private atmsService: AtmsService) { }

    ngOnInit() {
        this.notes = this.atmsService.notes;
    }

}
