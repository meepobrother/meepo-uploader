import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { CoreService } from 'meepo-core';
import { UuidService } from 'meepo-uuid';
@Injectable()
export class UploaderService {
    uploader: any;
    plupload: any;

    fileAdd$: Subject<any> = new Subject();
    error$: Subject<any> = new Subject();
    fileProgress$: Subject<any> = new Subject();
    fileLoaded$: Subject<any> = new Subject();
    filesRemoved$: Subject<any> = new Subject();

    width: number = 320;
    height: number = 320;
    quality: number = 90;
    max: number = 9;

    time: any = this.uuid.v1();
    constructor(
        public core: CoreService,
        public uuid: UuidService
    ) {
        console.log('uploader service', this.time);
    }

    init(plupload: any, brower: any) {
        this.plupload = plupload || window['plupload'];
        let url = this.core.murl('entry//upload', { m: 'imeepos_runner' }, false);
        this.uploader = new this.plupload.Uploader({
            browse_button: brower,
            url: this.core.murl('entry//upload', { m: 'imeepos_runner' }, false),
            flash_swf_url: 'https://meepo.com.cn/meepo/libs/plupload-2.3.6/js/Moxie.swf',
            silverlight_xap_url: 'https://meepo.com.cn/meepo/libs/plupload-2.3.6/js/Moxie.xap',
        });
        // 添加文件
        this.uploader.bind('FilesAdded', (up, files: any[]) => {
            // 生成预览文件
            let oldLen = this.uploader.files.length - files.length;
            this.uploader.files.splice(this.max, this.uploader.files.length);
            files = files.slice(0, this.max - oldLen);
            this.fileAdd$.next(this.uploader.files);
        });
        // 上传中...
        this.uploader.bind('UploadProgress', (up, file) => {
            this.fileProgress$.next(file);
        });
        // 全部上传完成
        this.uploader.bind('UploadComplete', (up, files) => {
        });
        // 单个文件上传完成
        this.uploader.bind('FileUploaded', (up, file, info) => {
            let response = info.response;
            let result = JSON.parse(response);
            if (result.url) {
                file.url = result.url;
                file.finished = true;
            }
            this.fileLoaded$.next(file);
        });
        // 文件移除触发
        this.uploader.bind('FilesRemoved', (up, files) => {
            this.filesRemoved$.next(this.uploader.files);
        });
        // 上传失败
        this.uploader.bind('Error', (up, err) => {
            this.error$.next(err);
        });
        this.uploader.init();
    }

    start() {
        this.uploader.start();
    }

    remove(file) {
        this.uploader.removeFile(file);
    }

    reload(file) {

    }

    addFile(file: any) {
        this.uploader.addFile(file);
    }
}