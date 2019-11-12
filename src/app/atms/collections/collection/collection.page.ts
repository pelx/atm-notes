import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, LoadingController } from '@ionic/angular';
import { Lesson } from 'src/app/models/lesson';
import { AtmsService } from '../../atms.service';
import { Collection } from '../../../models/collection';
import { CollectionsService } from '../collections.service';
import { Subscription, Subject } from 'rxjs';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { DataService } from '../../../shared/data.service';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.page.html',
    styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit, OnDestroy {
    selectedLesson = new Subject<Lesson>();

    lessons: Lesson[];
    collection: Collection;
    collectionId: string;
    isLoading = false;
    private lessonsSub: Subscription;
    private collectionSub: Subscription;
    displayedColumns: string[] = ['lessonId', 'lessonTitle', 'action'];
    dataSource: any;

    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private dataService: DataService,
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private atmsService: AtmsService,
        private collectionsService: CollectionsService,
        private loadingCtrl: LoadingController,
        private router: Router
    ) { }

    ngOnInit() {
        this.dataService.changedLesson.subscribe();
        // LOAD LESSONS
        this.isLoading = true;
        this.loadingCtrl
            .create({
                keyboardClose: true,
                message: 'Loading...',
                spinner: "lines"
            })
            .then(loadingEl => {
                loadingEl.present();
                this.collectionSub = this.route.paramMap.subscribe(paramMap => {
                    if (!paramMap.has('id')) {
                        this.navCtrl.navigateBack('/atms/tabs/collections');
                        return;
                    }
                    this.collectionId = paramMap.get('id');
                    this.isLoading = true;
                    this.collectionsService
                        .getCollectionById(this.collectionId)
                        .subscribe(collection => {
                            this.collection = collection;
                            console.log("LOAD LESSONS: ", this.collectionId);
                        })
                });
                this.lessonsSub = this.atmsService.
                    fetchLessonsByCollectionId(this.collectionId)
                    .subscribe(lessons => {
                        this.lessons = lessons;
                        this.isLoading = false;
                        loadingEl.dismiss();
                        this.dataSource = new MatTableDataSource<Lesson>(this.lessons);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    });
                this.isLoading = false;
                loadingEl.dismiss();
            })

    }

    ionViewWillEnter() {
        // LOAD LESSONS
        this.isLoading = true;
        this.loadingCtrl
            .create({
                keyboardClose: true,
                message: 'Loading...',
                spinner: "lines"
            })
            .then(loadingEl => {
                loadingEl.present();
                this.collectionSub = this.route.paramMap.subscribe(paramMap => {
                    if (!paramMap.has('id')) {
                        this.navCtrl.navigateBack('/atms/tabs/collections');
                        return;
                    }
                    this.collectionId = paramMap.get('id');
                    this.isLoading = true;
                    this.collectionsService
                        .getCollectionById(this.collectionId)
                        .subscribe(collection => {
                            this.collection = collection;
                            console.log("LOAD LESSONS: ", this.collectionId);
                        })
                });
                this.lessonsSub = this.atmsService.
                    fetchLessonsByCollectionId(this.collectionId)
                    .subscribe(lessons => {
                        this.lessons = lessons;
                        this.isLoading = false;
                        loadingEl.dismiss();
                        this.dataSource = new MatTableDataSource<Lesson>(this.lessons);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;
                    });
                this.isLoading = false;
                loadingEl.dismiss();
            })
    }

    onCollectionClick(lesson: Lesson) {
        this.dataService.changeLesson(lesson);
        this.router.navigateByUrl('/atms/tabs/notes/new');
        // this.navCtrl.navigateBack('/atms/tabs/collections');
        // this.navCtrl.pop();
        // this.modalCtrl.create({
        //     component: LessonComponent,
        //     componentProps: { selectedLesson: lesson }
        // })
        //     .then(modalEl => {
        //         modalEl.present();
        //         return modalEl.onDidDismiss();
        //     })
        //     .then(resultData => {
        //         console.log(resultData.data, ' ', resultData.role);
        //     });

    }

    applyFilter(filterVal: string) {
        this.dataSource.filter = filterVal.trim().toLocaleLowerCase();
    }

    ngOnDestroy() {
        if (this.lessonsSub) this.lessonsSub.unsubscribe();
        if (this.collectionSub) this.collectionSub.unsubscribe();
    }

}
