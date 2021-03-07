import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    constructor() { }

    ngOnInit() {
    }

    @ViewChild('fileInput', {static: true}) fileInput;
    file: File | null = null;

    onClickFileInputButton(): void {
        this.fileInput.nativeElement.click();
    }

    onChangeFileInput(): void {
        const files: { [key: string]: File } = this.fileInput.nativeElement.files;
        this.file = files[0];
    }}
