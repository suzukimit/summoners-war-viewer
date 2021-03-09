import { Component } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent extends AbstractComponent {
    constructor() {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
