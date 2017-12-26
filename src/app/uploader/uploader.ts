import {
    Component, OnInit, ContentChild, AfterContentInit,
    ChangeDetectionStrategy, ChangeDetectorRef, Input,
    ViewChild, ElementRef
} from '@angular/core';

import { UploaderLoaderService } from '../loader';
import { UploaderService } from '../uploader.service';
import { AxiosService } from 'meepo-axios';
import { CoreService } from 'meepo-core';


@Component({
    selector: 'uploader',
    templateUrl: './uploader.html',
    providers: [UploaderService],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styleUrls: ['./uploader.scss']
})
export class UploaderComponent implements OnInit {
    @Input() width: number = 320;
    @Input() height: number = 320;
    @Input() quality: number = 90;
    @Input() auto: boolean = true;
    @Input() max: number = 9;
    @ViewChild('fileSelector') fileSelecter: ElementRef;
    plupload: any;
    files: any[] = [];
    constructor(
        public loader: UploaderLoaderService,
        public uploader: UploaderService,
        public cd: ChangeDetectorRef,
        public axios: AxiosService,
        public core: CoreService
    ) {
        this.loader.load$.subscribe(plupload => {
            this.plupload = plupload;
            this.init();
        });
        // 添加文件
        this.uploader.fileAdd$.debounceTime(300).subscribe(files => {
            this.files = files;
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

    remove(file: any) {
        this.uploader.remove(file);
        if (file.url) {

        }
    }

    ngOnInit() { }

    ngAfterContentInit() {
        this.loader.init();
    }

    choosePhoto(e: any) {
        e.preventDefault();
        let files: any[] = [];
        if (e.dataTransfer) {
            files = e.dataTransfer.files;
        } else if (e.target) {
            files = e.target.files;
        }
        for (let i = 0; i < files.length; i++) {
            let file = files[i];
            const reader = new FileReader();
            reader.onload = () => {
                file.imgSrc = reader.result;
                this.uploader.addFile(file);
            };
            reader.readAsDataURL(files[0]);
        }
    }

    test(e: any) {
        let url = this.core.murl('entry//upload', { m: 'imeepos_runner' }, false);
        this.axios.post(url, { text: 1 }).then(res => {
            console.log(res);
        });
        this.start();
    }
}