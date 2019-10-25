import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavController, ModalController, LoadingController } from '@ionic/angular';
import { Lesson } from 'src/app/models/lesson';
import { AtmsService } from '../../atms.service';
import { Collection } from '../../../models/collection';
import { LessonComponent } from './lesson/lesson.component';
import { CollectionsService } from '../collections.service';
import { Subscription } from 'rxjs';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.page.html',
    styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit, OnDestroy {
    lessons: Lesson[];
    collection: Collection;
    isLoading = false;
    private lessonsSub: Subscription;
    private collectionSub: Subscription;
    displayedColumns: string[] = ['lessonId', 'lessonTitle'];
    dataSource: any;

    @ViewChild(MatSort, { static: false }) sort: MatSort;
    @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private atmsService: AtmsService,
        private collectionsService: CollectionsService,
        private modalCtrl: ModalController,
        private loadingCtrl: LoadingController,
        private router: Router
    ) { }

    ngOnInit() {
        this.route.paramMap.subscribe(paramMap => {
            if (!paramMap.has('id')) {
                this.navCtrl.navigateBack('/atms/tabs/collections');
                return;
            }
            this.collectionSub = this.collectionsService
                .getCollectionById(paramMap.get('id'))
                .subscribe(collection => {
                    this.collection = collection;
                    // console.log(collection);
                })
        });
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
                this.atmsService.fetchLessons()
                    .subscribe(lessons => {
                        this.lessons = lessons;
                        this.isLoading = false;
                        loadingEl.dismiss();
                        this.dataSource = new MatTableDataSource<Lesson>(this.lessons);
                        this.dataSource.paginator = this.paginator;
                        this.dataSource.sort = this.sort;

                    });
            })

    }

    ionViewWillEnter() {

        // this.atmsService.fetchLessons().subscribe(res => {
        //     console.log(this.lessons);
        // });

    }

    onCollectionClick(lesson: Lesson) {
        // this.router.navigateByUrl('/atms/tabs/collections');
        //this.navCtrl.navigateBack('/atms/tabs/collections');
        // this.navCtrl.pop();
        this.modalCtrl.create({
            component: LessonComponent,
            componentProps: { selectedLesson: lesson }
        })
            .then(modalEl => {
                modalEl.present();
                return modalEl.onDidDismiss();
            })
            .then(resultData => {
                console.log(resultData.data, ' ', resultData.role);
            });

    }

    ngOnDestroy() {
        if (this.lessonsSub) this.lessonsSub.unsubscribe();
        if (this.collectionSub) this.collectionSub.unsubscribe();
    }

}
