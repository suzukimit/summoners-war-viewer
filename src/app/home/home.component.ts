import { Component, OnInit, ViewChild } from '@angular/core';
import { ImportService } from 'src/app/common/components/services/import/import.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    constructor(public importService: ImportService) { }

    ngOnInit() {
    }

    @ViewChild('fileInput', {static: true}) fileInput;

    onClickFileInputButton(): void {
        this.fileInput.nativeElement.click();
    }

    onChangeFileInput(): void {
        const files: { [key: string]: File } = this.fileInput.nativeElement.files;
        const reader = new FileReader();
        reader.readAsText(files[0]);
        reader.onload = (_) => {
            this.importService.next(JSON.parse(reader.result.toString()));
            this.importService.fileName = files[0].name;
        };
    }}
