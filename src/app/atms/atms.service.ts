import { Injectable } from '@angular/core';
import { Collection } from '../models/collection';
import { Lesson } from '../models/lesson';
import { Note } from '../models/note';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AtmsService {
    private _lessons = new BehaviorSubject<Lesson[]>([
        new Lesson(
            'AY 001',
            'AY',
            'Bending the head to the side while sitting'
        ),
        new Lesson(
            'AY 002',
            'AY',
            'Seeing the heels'
        )
    ])
    // private _lessons: Lesson[] = []

    constructor() { }

    get lessons() {
        // return [...this._lessons];
        return this._lessons.asObservable();
    }

    getLessonsByCollectionId(id: string) {
        return this.lessons.pipe(
            take(1),
            map(lessons => {
                return lessons.find(l => l.collectionId === id);
            }));
        //  return {...this._lessons.filter(lesson => lesson.collectionId === id)};
    }
}
