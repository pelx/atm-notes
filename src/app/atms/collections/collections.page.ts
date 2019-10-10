import { Component, OnInit } from '@angular/core';
import { AtmsService } from '../atms.service';
import { Collection } from '../../models/collection';

@Component({
    selector: 'app-collections',
    templateUrl: './collections.page.html',
    styleUrls: ['./collections.page.scss'],
})
export class CollectionsPage implements OnInit {

    loadedCollections: Collection[];

    constructor(private atmsService: AtmsService) { }

    ngOnInit() {
        this.loadedCollections = this.atmsService.collections;
    }

}
