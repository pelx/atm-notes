import { Component, OnInit, Input } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
    selector: 'app-popup-text',
    templateUrl: './popup-text.page.html',
    styleUrls: ['./popup-text.page.scss'],
})
export class PopupTextPage implements OnInit {
    @Input() text: any;
    constructor(private popoverCtrl: PopoverController) { }

    ngOnInit() {
    }

    async onClose() {
        await this.popoverCtrl.dismiss();
    }

}
