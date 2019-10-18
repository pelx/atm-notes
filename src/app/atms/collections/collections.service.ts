import { Injectable } from '@angular/core';
import { Collection } from 'src/app/models/collection';
import { BehaviorSubject } from 'rxjs';
import { take, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';

@Injectable({
    providedIn: 'root'
})
export class CollectionsService {
    private _collections = new BehaviorSubject<Collection[]>([
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
    ])
    // private _collections: Collection[] = [    ]

    constructor(
        private authService: AuthService,
        private http: HttpClient) { }

    get collections() {
        // return [...this._collections];
        return this._collections.asObservable();
    }

    getCollectionById(id: string) {
        return this.collections.pipe(
            take(1),
            map(collections => {
                return collections.find(col => col.id === id);
            }));
        // return {...this._collections.find(collection => collection.id === id)};
    }
}