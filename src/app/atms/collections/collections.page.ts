import { Component, OnInit, OnDestroy } from '@angular/core';
import { Collection } from '../../models/collection';
import { CollectionsService } from './collections.service';
// import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-collections',
    templateUrl: './collections.page.html',
    styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit, OnDestroy {
    private subs: Subscription;
    isLoading = false;
    loadedCollections: Collection[];
    relevantCollections: Collection[];
    listedCollections: Collection[];

    constructor(
        private collectionsService: CollectionsService,
    ) { }

    ngOnInit() {
        // this.isLoading = true;
        // this.subs = this.collectionsService.collections
        //     .subscribe(cols => {
        //         this.loadedCollections = cols;
        //         this.relevantCollections = this.loadedCollections;
        //         this.listedCollections = this.loadedCollections.slice(1);
        //         this.isLoading = false;
        //     });

    }

    ionViewWillEnter() {
        this.isLoading = true;
        this.subs = this.collectionsService.fetchCollections().subscribe(cols => {
            this.loadedCollections = cols;
            this.relevantCollections = this.loadedCollections;
            this.listedCollections = this.loadedCollections.slice(1);
            this.isLoading = false;
        });
    }

    onOpenMenu() {
        // this.menuCtrl.toggle();
    }

    onFilterUpdate(event: CustomEvent<SegmentChangeEventDetail>) {
        if (event.detail.value === 'all') {
            this.relevantCollections = this.loadedCollections;
        } else {
            this.relevantCollections = [];
            // TODO: .filter(collection => false}
        }
        // console.log(event.detail);
    }
    ngOnDestroy() {
        if (this.subs) this.subs.unsubscribe();
    }

}
