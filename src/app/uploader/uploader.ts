import {
    Component, OnInit, ContentChild, AfterContentInit,
    ChangeDetectionStrategy, ChangeDetectorRef, Input,
    ViewChild, ElementRef
} from '@angular/core';

import { UploaderLoaderService } from '../loader';
import { UploaderService } from '../uploader.service';

@Component({
    selector: 'uploader',
    templateUrl: 'uploader.html',
    providers: [
        UploaderService
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: [
        './uploader.scss'
    ]
})
export class UploaderComponent implements OnInit {
    @Input() width: number = 320;
    @Input() height: number = 320;
    @Input() quality: number = 90;
    @Input() auto: boolean = true;
    @Input() max: number = 9;
    @ViewChild('fileSelecter') fileSelecter: ElementRef;
    plupload: any;
    files: any[] = [];
    constructor(
        public loader: UploaderLoaderService,
        public uploader: UploaderService,
        public cd: ChangeDetectorRef
    ) {
        console.log('this.uploader.time', this.uploader.time);
        this.loader.load$.subscribe(plupload => {
            this.plupload = plupload;
            console.log('uploader loaded');
            this.init();
        });
        // 添加文件
        this.uploader.fileAdd$.subscribe(files => {
            this.files = files;
            console.log('add file', this.files);
            if (this.auto) {
                this.start();
            }
            this.cd.markForCheck();
        });
        // 上传中
        this.uploader.fileProgress$.subscribe(file => {
            this.files.map(res => {
                if (res.id === file.id) {
                    res = file;
                }
            });
            this.cd.detectChanges();
        });
        // 上传完成
        this.uploader.fileLoaded$.subscribe(file => {
            this.files.map(res => {
                if (res.id === file.id) {
                    res = file;
                }
            });
            this.cd.detectChanges();
        });
        this.uploader.filesRemoved$.subscribe(files => {
            this.files = files;
            this.cd.detectChanges();
        });
    }

    init() {
        this.uploader.init(this.plupload, this.fileSelecter.nativeElement);
    }

    start() {
        this.uploader.start();
    }

    reload(file) {
        this.uploader.reload(file);
    }

    remove(file) {
        this.uploader.remove(file);
    }

    ngOnInit() { }

    ngAfterContentInit() {
        this.loader.init();
    }
}