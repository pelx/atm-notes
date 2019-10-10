import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Lesson } from 'src/app/models/lesson';
import { AtmsService } from '../../atms.service';
import { Collection } from '../../../models/collection';

@Component({
    selector: 'app-collection',
    templateUrl: './collection.page.html',
    styleUrls: ['./collection.page.scss'],
})
export class CollectionPage implements OnInit {
    lessons: Lesson[];
    collection: Collection;

    constructor(
        private route: ActivatedRoute,
        private navCtrl: NavController,
        private atmsService: AtmsService
    ) { }

    ngOnInit() {
        this.lessons = this.atmsService.lessons;
        this.route.paramMap.subscribe(param => {
            if (!param.has('id')) {
                this.navCtrl.navigateBack('/atms/tabs/collections');
                return;
            }
            this.collection = this.atmsService.getCollectionById(param.get('id'));
        })
    }

    onCollectionClick() {
        // this.router.navigateByUrl('/atms/tabs/collections');
        this.navCtrl.navigateBack('/atms/tabs/collections');
    }

}
