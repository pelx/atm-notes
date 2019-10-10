import { Injectable } from '@angular/core';
import { Collection } from '../models/collection';
import { Lesson } from '../models/lesson';
import { Note } from '../models/note';

@Injectable({
    providedIn: 'root'
})
export class AtmsService {
    private _collections: Collection[] = [
        new Collection(
            'AY',
            'Alexander Yanai',
            'Developed and recorded by Dr. Feldenkrais in Israel between 1950-1970, the Alexander Yanai volumes contain the translation of 550 Awareness Through Movement® lessons originally taught in Hebrew. The complete set contains more than 4,000 pages of original teachings. This collection is a must have for any teacher or trainee of the Feldenkrais Method®.',
            '../../assets/pics/ay-collection.png'
        ),

        new Collection(
            'Esalen',
            'Easalen Workshop 1972',
            'These 46 audio files are a remarkable document of Dr Feldenkrais’ teaching in his prime. They are clear, concise and powerful. Lessons vary widely from simple and elegant to complex and challenging. They are both a rewarding introduction to the Feldenkrais Method® created by Moshe Feldenkrais, as well as a rich resource for practitioners seeking to enhance their understanding of Awareness Through Movement. Lesson titles available in the Contents tab below.',
            '../../assets/pics/easalen-1972-workshop.png'
        )
    ]

    private _lessons: Lesson[] = [
        new Lesson(
            'AY 001',
            'ay',
            'Bending the head to the side while sitting'
        ),
        new Lesson(
            'AY 002',
            'ay',
            'Seeing the heels'
        ),
    ]

    private _notes: Note[] = [
        new Note(
            'AY 001',
            1,
            'Y',
            3,
            'Bending the head to the side while sitting'
        ),
        new Note(
            'AY 002',
            1,
            'Y',
            3,
            'Seeing the heels'
        )
    ]

    constructor() { }

    get collections() {
        return [...this._collections];
    }

    get notes() {
        return [...this._notes];
    }

    get lessons() {
        return [...this._lessons];
    }

    getNote(lessonId: string) {
        return {
            ...this._notes
                .find(note => note.lessonId === lessonId)
        };
    }

    getCollectionById(id: string) {
        return {
            ...this._collections.find(collection => collection.id === id)
        };
    }

    getLessonsByCollectionId(id: string) {
        return {
            ...this._lessons
                .filter(lesson => lesson.collectionId === id)
        };
    }
}
