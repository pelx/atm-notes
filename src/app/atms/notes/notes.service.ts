import { Injectable } from '@angular/core';
import { Note } from 'src/app/models/note';
import { AuthService } from '../../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

interface NoteData {
    collectionId: string;
    createdOn: string;
    lessonId: string;
    lessonTitle: string;
    level: string;
    note: string;
    rating: string;
    status: string;
    updatedOn: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    private notesUrl: 'https://atm-notes.firebaseio.com/notes';
    private _notes = new BehaviorSubject<Note[]>([]);

    // private _notes = new BehaviorSubject<Note[]>([
    //     new Note(
    //         '1',
    //         'AY 001',
    //         'Bending the head to the side while sitting',
    //         'AY',
    //         1,
    //         'Y',
    //         3,
    //         'Bending the head to the side while sitting',
    //         new Date('2019-01-01'),
    //         new Date('2019-10-01'),
    //         '1'

    //     ),
    //     new Note(
    //         '2',
    //         'AY 002',
    //         'Seeing the heels',
    //         'AY',
    //         1,
    //         'Y',
    //         3,
    //         'Seeing the heels',
    //         new Date('2019-01-01'),
    //         new Date('2019-10-01'),
    //         '1'
    //     )
    // ]);
    // private _notes: Note[] = [
    // ];

    constructor(
        private authService: AuthService,
        private http: HttpClient
    ) {

    }

    get notes() {
        return this._notes.asObservable();
        // return [...this._notes];
    }

    fetchNotesByUser() {
        return this.http
            .get<{ [key: string]: NoteData }>(`https://atm-notes.firebaseio.com/notes.json?orderBy="userId"&&equalTo="${this.authService.userId}"`
            ).pipe(map(resData => {
                const notes: any = [];
                for (const key in resData) {
                    if (resData.hasOwnProperty(key)) {
                        notes.push(new Note(
                            key,
                            resData[key].lessonId,
                            resData[key].lessonTitle,
                            resData[key].collectionId,
                            resData[key].rating,
                            resData[key].status,
                            resData[key].level,
                            resData[key].note,
                            new Date(resData[key].createdOn),
                            new Date(resData[key].updatedOn),
                            resData[key].userId
                        )
                        );
                    }
                }
                return notes;
            }),
                tap(notes => {
                    this._notes.next(notes);
                })
            );
    }


    fetchNotes() {
        // GET
        return this.http
            .get<{ [key: string]: NoteData }>('https://atm-notes.firebaseio.com/notes.json')
            .pipe(
                map(resData => {
                    const notes = [];
                    for (const key in resData) {
                        if (resData.hasOwnProperty(key)) {
                            notes.push(new Note(
                                key,
                                resData[key].lessonId,
                                resData[key].lessonTitle,
                                resData[key].collectionId,
                                +resData[key].rating,
                                resData[key].status,
                                +resData[key].level,
                                resData[key].note,
                                new Date(resData[key].createdOn),
                                new Date(resData[key].updatedOn),
                                resData[key].userId
                            ))
                        }
                    }
                    // return [];
                    return notes;
                }),
                tap(notes => {
                    this._notes.next(notes);
                })
            );
    }

    getNote(noteId: string) {
        return this.http.get<NoteData>(`https://atm-notes.firebaseio.com/notes/${noteId}.json`)
            .pipe(
                map(noteData => {
                    return new Note(noteId,
                        noteData.lessonTitle,
                        noteData.lessonId,
                        noteData.collectionId,
                        noteData.rating,
                        noteData.status,
                        noteData.level,
                        noteData.note,
                        new Date(noteData.createdOn),
                        new Date(noteData.updatedOn),
                        noteData.userId)
                }))
    }

    // getNote(noteId: string) {
    //     return this.notes.pipe(
    //         take(1),
    //         map(notes => {
    //             return { ...notes.find(n => n.noteId === noteId) };
    //         }));
    // }

    addNote(
        lessonTitle: string,
        lessonId: string,
        collectionId: string,
        rating: string,
        status: string,
        level: string,
        note: string
    ) {
        let generatedId: string;
        const newNote = new Note(
            Math.random().toString(),
            lessonTitle,
            lessonId,
            collectionId,
            rating,
            status,
            level,
            note,
            new Date(),
            new Date(),
            this.authService.userId
        );
        // POST
        return this.http.post<{ name: string }>('https://atm-notes.firebaseio.com/notes.json', {
            ...newNote, noteId: null
        })
            .pipe(
                switchMap(resData => {
                    generatedId = resData.name; //id generated by Firebase
                    return this.notes
                }),
                take(1),
                tap(notes => {
                    newNote.noteId = generatedId;
                    this._notes.next(notes.concat(newNote));
                })

            );
        // return this.notes.pipe(
        //     take(1),
        //     delay(1500),
        //     tap(notes => {
        //         this._notes.next(notes.concat(newNote));
        //     })
        // );
        // this._notes.push(newNote);
    }

    updateNote(
        noteId: string,
        rating: string,
        status: string,
        level: string,
        note: string
    ) {
        let updNotes: Note[];
        return this.notes.pipe(
            take(1),
            switchMap(notes => {
                // ensure notes were fetched
                if (!notes || notes.length <= 0) {
                    return this.fetchNotes();
                } else {
                    return of(notes);
                }

            }),
            switchMap((notes) => {
                const updNoteIndex = notes.findIndex(n => n.noteId === noteId);
                updNotes = [...notes];
                const oldNote = updNotes[updNoteIndex];
                console.log("OldNote:", oldNote);
                updNotes[updNoteIndex] = new Note(
                    oldNote.noteId,
                    oldNote.lessonId,
                    oldNote.lessonTitle,
                    oldNote.collectionId,
                    rating,
                    status,
                    level,
                    note,
                    oldNote.createdOn,
                    new Date(),
                    oldNote.userId
                );
                return this
                    .http
                    .put(`https://atm-notes.firebaseio.com/notes/${noteId}.json`,
                        { ...updNotes[updNoteIndex], id: null });

            }),
            tap(resData => {
                console.log(resData);
                this._notes.next(updNotes);
            }))
        // return this.notes.pipe(
        //     take(1),
        //     delay(1500),
        //     tap(notes => {
        //         const updNoteIndex = notes.findIndex(n => n.noteId === noteId);
        //         const updNotes = [...notes];
        //         const oldNote = updNotes[updNoteIndex];
        //         updNotes[updNoteIndex] = new Note(
        //             oldNote.noteId,
        //             lessonId,
        //             oldNote.lessonTitle,
        //             oldNote.collectionId,
        //             oldNote.rating,
        //             oldNote.status,
        //             oldNote.level,
        //             note,
        //             oldNote.createdOn,
        //             new Date(),
        //             oldNote.userId
        //         );
        //         this._notes.next(updNotes);
        //     })
        // );
    }

    deleteNote(noteId: string) {
        return this.http.delete<NoteData>(`https://atm-notes.firebaseio.com/notes/${noteId}.json`)
            .pipe(
                switchMap(() => {
                    return this.notes;
                }),
                take(1),
                tap(notes => {
                    this._notes.next(notes.filter(note => note.noteId !== noteId));
                })
            );
    }

    // deleteNote(noteId: string) {
    //     return this.notes.pipe(
    //         take(1),
    //         delay(1500),
    //         tap(notes => {
    //             this._notes.next(notes.filter(note => note.noteId !== noteId));
    //         })
    //     );
    // }
}