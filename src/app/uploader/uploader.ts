import {
    Component, OnInit, ContentChild, AfterContentInit,
    ChangeDetectionStrategy, ChangeDetectorRef, Input,
    ViewChild, ElementRef
} from '@angular/core';

import { UploaderLoaderService } from '../loader';
import { UploaderService } from '../uploader.service';
import { AxiosService } from 'meepo-axios';
import { CoreService } from 'meepo-core';

import { UaService } from 'meepo-ua';
import { WxService } from 'meepo-jssdk';
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

    isWechat: boolean = false;
    constructor(
        public loader: UploaderLoaderService,
        public uploader: UploaderService,
        public cd: ChangeDetectorRef,
        public axios: AxiosService,
        public core: CoreService,
        public ua: UaService,
        public wx: WxService
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
        if (this.ua.isWechat()) {
            let index = this.files.indexOf(file);
            this.files.splice(index, 1);
        } else {
            this.uploader.remove(file);
        }
    }

    ngOnInit() {
        this.isWechat = this.ua.isWechat();
    }

    ngAfterContentInit() {
        if (this.ua.isWechat()) {

        } else {
            this.loader.init();
        }
    }

    wechatUplaoder() {
        if (this.isWechat) {
            this.wx.chooseImage(this.max).subscribe(res => {
                res.map(id => {
                    this.wx.uploadImage(id).subscribe(sid => {
                        let url = this.core.murl('entry//open', { __do: 'audio.image' }, false);
                        this.axios.bpost(url, { serverId: sid }).then(res => {
                            this.files.push({
                                finished: true,
                                src: res
                            });
                            this.cd.detectChanges();
                        });
                    });
                })
            });
        }
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
}