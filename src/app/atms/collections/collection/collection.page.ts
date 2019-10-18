import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, ModalController } from '@ionic/angular';
import { Lesson } from 'src/app/models/lesson';
import { AtmsService } from '../../atms.service';
import { Collection } from '../../../models/collection';
import { LessonComponent } from './lesson/lesson.component';
import { CollectionsService } from '../collections.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.page.html',
    styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit, OnDestroy {
    lessons: Lesson[];
    collection: Collection;
    private lessonsSub: Subscription;
    private collectionSub: Subscription;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private atmsService: AtmsService,
        private collectionsService: CollectionsService,
        private modalCtrl: ModalController
    ) { }

    ngOnInit() {
        // this.lessons = this.atmsService.lessons;
        this.lessonsSub = this.atmsService.lessons
            .subscribe(lessons => {
                this.lessons = lessons
            });

        this.route.paramMap.subscribe(param => {
            if (!param.has('id')) {
                this.navCtrl.navigateBack('/atms/tabs/collections');
                return;
            }

            this.collectionSub = this.collectionsService.getCollectionById(param.get('id'))
                .subscribe(collection => this.collection = collection);

            // this.collection = this.collectionsService.getCollectionById(param.get('id'));
        })
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
