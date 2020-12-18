import { AngularFireStorage } from '@angular/fire/storage';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, map, tap, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/auth/auth.service';
import { Collection } from '../../models/collection';


@Injectable({
    providedIn: 'root',
})
export class CollectionsService {
    private _collections = new BehaviorSubject<Collection[]>([]);
    //[
    // new Collection(
    //     'AY',
    //     'Alexander Yanai',
    //     'Developed and recorded by Dr. Feldenkrais in Israel between 1950-1970, the Alexander Yanai volumes contain the translation of 550 Awareness Through Movement® lessons originally taught in Hebrew. The complete set contains more than 4,000 pages of original teachings. This collection is a must have for any teacher or trainee of the Feldenkrais Method®.',
    //     '../../assets/pics/ay-collection.png'
    // ),

    // new Collection(
    //     'Esalen',
    //     'Easalen Workshop 1972',
    //     'These 46 audio files are a remarkable document of Dr Feldenkrais’ teaching in his prime. They are clear, concise and powerful. Lessons vary widely from simple and elegant to complex and challenging. They are both a rewarding introduction to the Feldenkrais Method® created by Moshe Feldenkrais, as well as a rich resource for practitioners seeking to enhance their understanding of Awareness Through Movement. Lesson titles available in the Contents tab below.',
    //     '../../assets/pics/easalen-1972-workshop.png'
    // )
    //]

    private collectionsUrl = 'https://atm-notes.firebaseio.com/collections';

    constructor(
        private authService: AuthService,
        private http: HttpClient,
        private fireStorage: AngularFireStorage) { }

    get collections() {
        // return [...this._collections];
        return this._collections.asObservable();
    }

    fetchCollections() {
        return this.authService.token.pipe(
            take(1),
            switchMap(token => {
                return this.http
                    .get<{ [key: string]: Collection }>(`${this.collectionsUrl}.json?auth=${token}`)
                    .pipe(
                        take(1),
                        map(resData => {

                            const collections = [];
                            let urlRef: Promise<string>;
                            for (const key in resData) {
                                if (resData.hasOwnProperty(key)) {
                                    urlRef = this.fireStorage.ref("pictures")
                                        .child(resData[key].imageUrl.toString())
                                        .getDownloadURL().toPromise();
                                    // console.log("URL: ", urlRef);
                                    collections.push(new Collection(
                                        resData[key].collectionId,
                                        resData[key].title,
                                        resData[key].description,
                                        // resData[key].imageUrl
                                        urlRef
                                    ));

                                }
                            }
                            return collections;
                        }),
                        tap(collections => {
                            this._collections.next(collections);
                        })
                    );
            })
        );
    }


    getCollectionById(id: string) {
        return this.collections.pipe(
            take(1),
            map(collections => {
                // console.log("GET COLLECTIONS BY ID: ", this.collections);
                return { ...collections.find(col => col.collectionId === id) };
            }));
        // return {...this._collections.find(collection => collection.id === id)};
    }
}