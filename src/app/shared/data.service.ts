import { Injectable } from "@angular/core";
import { Subject, BehaviorSubject } from 'rxjs';
import { Lesson } from '../models/lesson';
import { Collection } from '../models/collection';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    changedLesson = new BehaviorSubject<Lesson>(null);
    selectedCollection = new BehaviorSubject<Collection>(null);
    private _lesson: Lesson;
    private _collection: Collection;

    get lesson() {
        return this._lesson;
    }

    get collection() {
        return this._collection;
    }


    set lesson(lesson: Lesson) {
        this._lesson = lesson;
    }

    set collection(collection: Collection) {
        this._collection = collection;
    }


    constructor() { }

    changeLesson(selectedLesson: Lesson) {
        this.lesson = selectedLesson;
        this.changedLesson.next(selectedLesson);
    }

    setCollection(selectedCollection: Collection) {
        this.collection = selectedCollection;
        this.selectedCollection.next(selectedCollection);
    }

}