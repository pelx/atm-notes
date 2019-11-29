import { Injectable } from '@angular/core';
import { Note } from 'src/app/models/note';
import { AuthService } from '../../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export interface NoteData {
    collectionId: string;
    createdOn: string;
    lessonId: string;
    lessonTitle: string;
    level: string;
    note: string;
    position: string;
    status: string;
    updatedOn: string;
    userId: string;
}

@Injectable({
    providedIn: 'root'
})
export class NotesService {
    private notesUrl = 'https://atm-notes.firebaseio.com/notes';
    private _notes = new BehaviorSubject<Note[]>([]);


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
        return this.authService.token.pipe(
            take(1),
            switchMap(token => {
                return this.http
                    .get<{ [key: string]: NoteData }>(`${this.notesUrl}.json?auth=${token}orderBy="userId"&&equalTo="${this.authService.userId}"`
                    );
            }),
            map(resData => {
                const notes: any = [];
                for (const key in resData) {
                    if (resData.hasOwnProperty(key)) {
                        notes.push(new Note(
                            key,
                            resData[key].lessonId,
                            resData[key].lessonTitle,
                            resData[key].collectionId,
                            resData[key].position,
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
        //return this.authService.token.pipe(
        let userId: string;
        return this.authService.userId.pipe(
            take(1),
            switchMap(id => {
                if (!id) {
                    throw new Error('No User Id found');
                }
                userId = id;
                return this.authService.token;
            }),
            take(1),
            switchMap(token => {
                // GET
                console.log(`${this.notesUrl}.json?auth=${token}`)
                return this.http
                    .get<{ [key: string]: NoteData }>(`${this.notesUrl}.json?orderBy="userId"&equalTo="${userId}"&auth=${token}`)
            }),
            map(resData => {
                const notes = [];
                for (const key in resData) {
                    if (resData.hasOwnProperty(key)) {
                        notes.push(new Note(
                            key,
                            resData[key].lessonId,
                            resData[key].lessonTitle,
                            resData[key].collectionId,
                            resData[key].position,
                            resData[key].status,
                            resData[key].level,
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
        return this.authService.token.pipe(
            take(1),
            switchMap(token => {
                return this.http.get<NoteData>(`${this.notesUrl}/${noteId}.json?auth=${token}`)
            }),
            map(noteData => {
                // const note = new Note(
                //     noteId,
                //     noteData.lessonId,
                //     noteData.lessonTitle,
                //     noteData.collectionId,
                //     noteData.position,
                //     noteData.status,
                //     noteData.level,
                //     noteData.note,
                //     new Date(noteData.createdOn),
                //     new Date(noteData.updatedOn),
                //     noteData.userId
                // );
                // console.log("NOTEDATA: ", note);
                // return note;

                return new Note(noteId,
                    noteData.lessonId,
                    noteData.lessonTitle,
                    noteData.collectionId,
                    noteData.position,
                    noteData.status,
                    noteData.level,
                    noteData.note,
                    new Date(noteData.createdOn),
                    new Date(noteData.updatedOn),
                    noteData.userId)
            }))
    }

    // return this.http
    //                 .get<{ [key: string]: NoteData }>(`${this.notesUrl}.json?auth=${token}orderBy="userId"&&equalTo="${this.authService.userId}"`
    //                 );
    //         }),
    //         map(resData => {
    //             const notes: any = [];
    //             for (const key in resData) {
    //                 if (resData.hasOwnProperty(key)) {
    //                     notes.push(new Note(
    //                         key,
    //                         resData[key].lessonId,
    //                         resData[key].lessonTitle,
    //                         resData[key].collectionId,
    //                         resData[key].position,
    //                         resData[key].status,
    //                         resData[key].level,
    //                         resData[key].note,
    //                         new Date(resData[key].createdOn),
    //                         new Date(resData[key].updatedOn),
    //                         resData[key].userId
    //                     )
    //                     );
    //                 }
    //     collectionId: "Esalen"
    // createdOn: "2019-11-28T10:22:16.551Z"
    // lessonId: "ES 4"
    // lessonTitle: "Four Cardinal Points of Support on Hands & Feet, Sitting to the Right and Left"
    // level: "4"
    // note: "Esalen: Lifting head, legs, arms. Aeroplane like lesson with lifting of  head with chick on the hand in variations combinations and the legs... Love these movements. When in sphinx allow the elbows to move and notice see-saw movement of the shoulders."
    // position: "2"
    // status: "Done"
    // updatedOn: "2019-11-28T10:22:16.551Z"
    // userId: "FAsj0SXyfNfVmDTokHCNswGxpeu1"

    //             }

    addNote(
        lessonTitle: string,
        lessonId: string,
        collectionId: string,
        position: string,
        status: string,
        level: string,
        note: string
    ) {
        let generatedId: string;
        let fetchedUserId: string;
        let newNote: Note;
        return this.authService.userId.pipe(
            take(1),
            switchMap(userId => {
                if (!userId) {
                    throw new Error('No User Id found');
                }
                fetchedUserId = userId;
                return this.authService.token;
            }),
            take(1),
            switchMap(token => {
                newNote = new Note(
                    Math.random().toString(),
                    lessonTitle,
                    lessonId,
                    collectionId,
                    position,
                    status,
                    level,
                    note,
                    new Date(),
                    new Date(),
                    fetchedUserId
                );
                // console.log(`${this.notesUrl}.json?auth=${token}`);
                return this.http
                    .post<{ name: string }>(
                        `${this.notesUrl}.json?auth=${token}`,
                        { ...newNote, noteId: null }
                    );
            }),
            switchMap(resData => {
                generatedId = resData.name; //id generated by Firebase
                return this.notes;
            }),
            take(1),
            tap(notes => {
                newNote.noteId = generatedId;
                this._notes.next(notes.concat(newNote));
            }))

    }

    updateNote(
        noteId: string,
        position: string,
        status: string,
        level: string,
        note: string
    ) {
        let updNotes: Note[];
        let fetchedToken: string;
        return this.authService.token.pipe(
            take(1),
            switchMap(token => {
                fetchedToken = token;
                return this.notes;
            }),
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
                updNotes[updNoteIndex] = new Note(
                    oldNote.noteId,
                    oldNote.collectionId,
                    oldNote.lessonId,
                    oldNote.lessonTitle,
                    position,
                    status,
                    level,
                    note,
                    oldNote.createdOn,
                    new Date(),
                    oldNote.userId
                );
                return this
                    .http
                    .put(`${this.notesUrl}/${noteId}.json?auth=${fetchedToken}`,
                        { ...updNotes[updNoteIndex], id: null });

            }),
            tap(resData => {
                // console.log(resData);
                this._notes.next(updNotes);
            }))
    }

    deleteNote(noteId: string) {
        return this.authService.token.pipe(
            take(1),
            switchMap(token => {
                return this.http
                    .delete<NoteData>(`${this.notesUrl}/${noteId}.json?auth=${token}`)
            }),
            switchMap(() => {
                return this.notes;
            }),
            take(1),
            tap(notes => {
                this._notes.next(notes.filter(note => note.noteId !== noteId));
            })
        );
    }

}