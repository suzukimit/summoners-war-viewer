import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends AbstractComponent {
    constructor() {
        super();
    }

    ngOnInit() {
    }
}
