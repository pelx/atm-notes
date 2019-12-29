import { Component, OnInit, OnDestroy } from '@angular/core';
import { Collection } from '../../models/collection';
import { CollectionsService } from './collections.service';
// import { MenuController } from '@ionic/angular';
import { SegmentChangeEventDetail } from '@ionic/core';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { PopoverController } from '@ionic/angular';
import { PopupTextPage } from 'src/app/shared/pages/popup-text/popup-text.page';
import { AuthService } from '../../auth/auth.service';
import { User } from '../../models/user';

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
    user;

    constructor(
        private collectionsService: CollectionsService,
        private popoverCtrl: PopoverController,
        private auth: AuthService
    ) { }

    ngOnInit() {
        this.user = this.auth.userName;
        // console.log("NAME: ", this.user);
        this.isLoading = true;
        this.subs = this.collectionsService.fetchCollections().subscribe(cols => {
            this.loadedCollections = cols;
            this.relevantCollections = this.loadedCollections;
            this.listedCollections = this.loadedCollections.slice(1);
            this.isLoading = false;
            // console.log("COLLECTIONS", this.loadedCollections);
        });

    }

    ionViewWillEnter() {
        // this.isLoading = true;
        // this.subs = this.collectionsService.fetchCollections().subscribe(cols => {
        //     this.loadedCollections = cols;
        //     this.relevantCollections = this.loadedCollections;
        //     this.listedCollections = this.loadedCollections.slice(1);
        //     this.isLoading = false;
        // });
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

    async showDescription(text: any) {
        const popover = await this.popoverCtrl.create({
            component: PopupTextPage,
            componentProps: { text },
            backdropDismiss: true,
        });
        await popover.present();
        // popover.onDidDismiss((remove: false) => { });
    }

    ngOnDestroy() {
        if (this.subs) this.subs.unsubscribe();
    }

}
