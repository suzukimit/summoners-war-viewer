import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportService } from 'src/app/common/components/services/import/import.service';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { SubjectManager } from 'src/app/common/subject.manager';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent extends AbstractComponent {
    constructor(public importService: ImportService, public subjectManager: SubjectManager) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this.subjectManager.importFileName.pipe(filter(e => e !== null)).subscribe(fileName => {
                this.importFileName = fileName;
            }),
        );
    }

    @ViewChild('fileInput', {static: true}) fileInput;
    importFileName = '';

    onClickFileInputButton(): void {
        this.fileInput.nativeElement.click();
    }

    onChangeFileInput(): void {
        const files: { [key: string]: File } = this.fileInput.nativeElement.files;
        const reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = (_) => {
            this.importService.next(JSON.parse(reader.result.toString()));
            this.subjectManager.importFileName.next(files[0].name);
        };
    }

    useSample(): void {
        this.subscriptions.push(
            this.importService.importSample().subscribe(e => {
                this.importService.next(e);
                this.subjectManager.importFileName.next('sample.json');
            }),
        );
    }
}
