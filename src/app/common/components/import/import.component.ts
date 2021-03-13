import { Component, ViewChild } from '@angular/core';
import { AbstractComponent } from 'src/app/common/components/base/abstract.component';
import { ImportService } from 'src/app/common/services/import/import.service';
import { SubjectManager } from 'src/app/common/services/sabject-manager/subject.manager';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-import',
    templateUrl: './import.component.html',
    styleUrls: ['./import.component.scss']
})
export class ImportComponent extends AbstractComponent {

    constructor(public importService: ImportService, public subjectManager: SubjectManager) {
        super();
    }

    ngOnInit() {
        this.subscriptions.push(
            this.subjectManager.importFileName.pipe(filter(e => e !== null)).subscribe(e => {
                this.importFileName = e;
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
                this.subjectManager.importFileName.next('demo.json');
            }),
        );
    }
}
